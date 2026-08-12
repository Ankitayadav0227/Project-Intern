from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from routes.auth import auth_bp
from routes.intern import intern_bp
from routes.admin import admin_bp
from routes.attendance import attendance_bp
from routes.leave import leave_bp
from routes.messages import messages_bp

from db import get_connection

import os

app = Flask(__name__)
CORS(app)

# ==========================================
# UPLOAD FOLDER
# ==========================================

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================================
# REGISTER BLUEPRINTS
# ==========================================

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(intern_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(leave_bp)
app.register_blueprint(messages_bp)


# ==========================================
# REACT FRONTEND
# ==========================================

FRONTEND_FOLDER = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../frontend/dist"
    )
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):

    # If requested file exists, serve it
    file_path = os.path.join(FRONTEND_FOLDER, path)

    if path and os.path.exists(file_path):
        return send_from_directory(
            FRONTEND_FOLDER,
            path
        )

    # Otherwise send React index.html
    return send_from_directory(
        FRONTEND_FOLDER,
        "index.html"
    )


# ==========================================
# TEST API
# ==========================================

@app.route("/api")
def api_home():

    return {
        "message": "Intern Management API Running"
    }


# ==========================================
# TEST DATABASE
# ==========================================

@app.route("/test-db")
def test_db():

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT DATABASE();")

        db = cursor.fetchone()

        cursor.close()
        conn.close()

        return {
            "status": "Success",
            "database": db[0]
        }

    except Exception as e:

        return {
            "status": "Failed",
            "error": str(e)
        }


# ==========================================
# SERVE UPLOADED FILES
# ==========================================

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ==========================================
# PROFILE IMAGE UPLOAD
# ==========================================

@app.route(
    "/upload-profile/<int:intern_id>",
    methods=["POST"]
)
def upload_profile(intern_id):

    try:

        if "profile_image" not in request.files:

            return jsonify({
                "success": False,
                "message": "No file selected"
            }), 400


        file = request.files["profile_image"]


        if file.filename == "":

            return jsonify({
                "success": False,
                "message": "Empty filename"
            }), 400


        filename = secure_filename(
            file.filename
        )


        # Unique filename
        filename = f"{intern_id}_{filename}"


        filepath = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )


        file.save(filepath)


        image_path = f"uploads/{filename}"


        conn = get_connection()
        cursor = conn.cursor()


        cursor.execute(
            """
            UPDATE interns
            SET profile_image = %s
            WHERE intern_id = %s
            """,
            (
                image_path,
                intern_id
            )
        )


        conn.commit()

        cursor.close()
        conn.close()


        return jsonify({

            "success": True,

            "message":
            "Profile image uploaded successfully",

            "image_path":
            image_path

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )