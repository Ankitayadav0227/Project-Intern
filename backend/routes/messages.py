import os

from flask import (
    Blueprint,
    request,
    jsonify,
    send_from_directory
)

from werkzeug.utils import secure_filename

from db import get_connection


messages_bp = Blueprint(
    "messages",
    __name__
)


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

UPLOAD_FOLDER = "uploads/messages"

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",

    "pdf",

    "doc",
    "docx",

    "xls",
    "xlsx",

    "ppt",
    "pptx",

    "txt",

    "zip",
    "rar",

    "csv"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


def allowed_file(filename):

    if "." not in filename:
        return False

    extension = (
        filename.rsplit(".", 1)[1]
        .lower()
    )

    return extension in ALLOWED_EXTENSIONS


# =========================================================
# GET INTERN NAME
# =========================================================

def get_intern_name(intern_id):

    conn = get_connection()
    cursor = conn.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT
            full_name
        FROM interns
        WHERE intern_id = %s
        """,
        (intern_id,)
    )

    intern = cursor.fetchone()

    cursor.close()
    conn.close()

    if intern:
        return intern["full_name"]

    return "Intern"


# =========================================================
# GET ADMIN NAME
# =========================================================

def get_admin_name(admin_id):

    if not admin_id:
        return "Admin"

    conn = get_connection()
    cursor = conn.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT
            username
        FROM admins
        WHERE admin_id = %s
        """,
        (admin_id,)
    )

    admin = cursor.fetchone()

    cursor.close()
    conn.close()

    if admin:
        return admin["username"]

    return "Admin"


# =========================================================
# SEND MESSAGE / FILE
# =========================================================

@messages_bp.route(
    "/messages",
    methods=["POST"]
)
def send_message():

    try:

        # -----------------------------------------
        # FORM DATA
        # -----------------------------------------

        intern_id = request.form.get(
            "intern_id"
        )

        sender = request.form.get(
            "sender"
        )

        admin_id = request.form.get(
            "admin_id"
        )

        message = request.form.get(
            "message",
            ""
        ).strip()

        uploaded_file = request.files.get(
            "file"
        )

        # -----------------------------------------
        # VALIDATION
        # -----------------------------------------

        if not intern_id or not sender:

            return jsonify({
                "success": False,
                "message":
                    "Intern ID and sender are required"
            }), 400

        if sender not in [
            "intern",
            "admin"
        ]:

            return jsonify({
                "success": False,
                "message":
                    "Invalid sender"
            }), 400

        if not message and not uploaded_file:

            return jsonify({
                "success": False,
                "message":
                    "Message or file is required"
            }), 400

        # -----------------------------------------
        # GET SENDER NAME
        # -----------------------------------------

        if sender == "intern":

            sender_name = get_intern_name(
                intern_id
            )

        else:

            sender_name = get_admin_name(
                admin_id
            )

        # -----------------------------------------
        # FILE INFORMATION
        # -----------------------------------------

        file_name = None
        file_url = None

        if uploaded_file:

            if not uploaded_file.filename:

                return jsonify({
                    "success": False,
                    "message":
                        "Invalid file"
                }), 400

            if not allowed_file(
                uploaded_file.filename
            ):

                return jsonify({
                    "success": False,
                    "message":
                        "File type is not allowed"
                }), 400

            # Check file size
            uploaded_file.seek(0, 2)

            file_size = uploaded_file.tell()

            uploaded_file.seek(0)

            if file_size > MAX_FILE_SIZE:

                return jsonify({
                    "success": False,
                    "message":
                        "Maximum file size is 10 MB"
                }), 400

            original_name = secure_filename(
                uploaded_file.filename
            )

            # Create unique filename
            import uuid

            unique_name = (
                str(uuid.uuid4())
                + "_"
                + original_name
            )

            save_path = os.path.join(
                UPLOAD_FOLDER,
                unique_name
            )

            uploaded_file.save(
                save_path
            )

            file_name = original_name

            file_url = (
                "/messages/files/"
                + unique_name
            )

        # -----------------------------------------
        # DATABASE
        # -----------------------------------------

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO messages
            (
                intern_id,
                sender,
                sender_name,
                message,
                file_name,
                file_url,
                is_read
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                FALSE
            )
            """,
            (
                intern_id,
                sender,
                sender_name,
                message,
                file_name,
                file_url
            )
        )

        conn.commit()

        message_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message":
                "Message sent successfully",
            "message_id":
                message_id,
            "sender_name":
                sender_name,
            "file_name":
                file_name,
            "file_url":
                file_url
        }), 201

    except Exception as e:

        print(
            "SEND MESSAGE ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# GET INTERN MESSAGES
# =========================================================

@messages_bp.route(
    "/messages/intern/<int:intern_id>",
    methods=["GET"]
)
def get_intern_messages(
    intern_id
):

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                message_id,
                intern_id,
                sender,
                sender_name,
                message,
                file_name,
                file_url,
                is_read,
                created_at
            FROM messages
            WHERE intern_id = %s
            ORDER BY
                created_at ASC,
                message_id ASC
            """,
            (intern_id,)
        )

        messages = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "data": messages
        }), 200

    except Exception as e:

        print(
            "INTERN MESSAGE ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# ADMIN - GET ALL MESSAGES
# =========================================================

@messages_bp.route(
    "/messages/admin",
    methods=["GET"]
)
def get_admin_messages():

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                m.message_id,
                m.intern_id,
                i.full_name,
                i.email,
                m.sender,
                m.sender_name,
                m.message,
                m.file_name,
                m.file_url,
                m.is_read,
                m.created_at
            FROM messages m

            INNER JOIN interns i
                ON m.intern_id =
                   i.intern_id

            ORDER BY
                m.created_at ASC,
                m.message_id ASC
            """
        )

        messages = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "data": messages
        }), 200

    except Exception as e:

        print(
            "ADMIN MESSAGE ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# ADMIN - MARK INTERN MESSAGES AS READ
# =========================================================

@messages_bp.route(
    "/messages/admin/read/<int:intern_id>",
    methods=["PUT"]
)
def mark_intern_messages_read(
    intern_id
):

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE messages
            SET is_read = TRUE

            WHERE intern_id = %s

            AND sender = 'intern'

            AND is_read = FALSE
            """,
            (intern_id,)
        )

        conn.commit()

        updated = cursor.rowcount

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message":
                "Messages marked as read",
            "updated":
                updated
        }), 200

    except Exception as e:

        print(
            "MARK READ ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# SERVE MESSAGE FILES
# =========================================================

@messages_bp.route(
    "/messages/files/<path:filename>",
    methods=["GET"]
)
def serve_message_file(filename):

    try:

        return send_from_directory(
            UPLOAD_FOLDER,
            filename
        )

    except Exception as e:

        print(
            "FILE SERVE ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message":
                "File not found"
        }), 404
