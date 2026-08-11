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


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# React production build
FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")

# Uploaded files
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)

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
# SERVE REACT FRONTEND
# ==========================================

@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIST, "index.html")


@app.route("/<path:path>")
def serve_react(path):

    # If requested file exists, serve it
    requested_file = os.path.join(FRONTEND_DIST, path)

    if os.path.isfile(requested_file):
        return send_from_directory(FRONTEND_DIST, path)

    # Otherwise send React index.html
    # This is important for React Router
    return send_from_directory(FRONTEND_DIST, "index.html")


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
        }, 500


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
# UPLOAD PROFILE IMAGE
# ==========================================

@app.route("/upload-profile/<int:intern_id>", methods=["POST"])
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

        filename = secure_filename(file.filename)

        # Create unique filename
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
            (image_path, intern_id)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Profile image uploaded successfully",
            "image_path": image_path
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )