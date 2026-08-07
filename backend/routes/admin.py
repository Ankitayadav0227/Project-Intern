from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from db import get_connection
from routes.middleware import admin_required
admin_bp = Blueprint("admin", __name__)


# ==========================
# Get All Work Logs
# ==========================
@admin_bp.route("/all-worklogs", methods=["GET"])
def all_worklogs():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            w.log_id,
            i.full_name,
            w.work_date,
            w.task_title,
            w.description,
            w.hours_worked,
            w.status
        FROM work_logs w
        JOIN interns i
        ON w.intern_id = i.intern_id
        ORDER BY w.work_date DESC
    """)

    logs = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(logs)


# # ==========================
# Approve Work Log
# ==========================
@admin_bp.route("/approve/<int:log_id>", methods=["PUT"])
def approve_log(log_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE work_logs SET status=%s WHERE log_id=%s",
        ("Approved", log_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Work Log Approved Successfully"
    })
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE work_logs SET status='Approved' WHERE log_id=%s",
        (log_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Work log approved"
    })


# ==========================
# Reject Work Log
# ==========================
@admin_bp.route("/reject/<int:log_id>", methods=["PUT"])
def reject_log(log_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE work_logs SET status=%s WHERE log_id=%s",
        ("Rejected", log_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Work Log Rejected Successfully"
    })

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE work_logs SET status='Rejected' WHERE log_id=%s",
        (log_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Work log rejected"
    })
# ==========================
# Get All Interns
# ==========================
@admin_bp.route("/interns", methods=["GET"])
def get_interns():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            intern_id,
            full_name,
            email,
            department
        FROM interns
        ORDER BY intern_id DESC
    """)

    interns = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": interns
    })


   
# ==========================
# Add Intern
# ==========================
@admin_bp.route("/interns", methods=["POST"])
def add_intern():

    try:
        data = request.get_json()

        full_name = data.get("full_name")
        email = data.get("email")
        department = data.get("department")
        password = data.get("password")

        if not full_name or not email or not department or not password:
            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        hashed_password = generate_password_hash(password)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO interns
            (full_name, email, department, password)
            VALUES (%s, %s, %s, %s)
        """, (
            full_name,
            email,
            department,
            hashed_password
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Intern Added Successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================
# Update Intern
# ==========================
@admin_bp.route("/interns/<int:intern_id>", methods=["PUT"])
def update_intern(intern_id):

    try:
        data = request.get_json()

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE interns
            SET
                full_name=%s,
                email=%s,
                department=%s
            WHERE intern_id=%s
        """, (
            data.get("full_name"),
            data.get("email"),
            data.get("department"),
            intern_id
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Intern Updated Successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route("/interns/<int:intern_id>", methods=["DELETE"])
def delete_intern(intern_id):

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM interns
            WHERE intern_id = %s
        """, (intern_id,))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Intern Deleted Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# ==========================
# Analytics
# ==========================
@admin_bp.route("/analytics", methods=["GET"])
def analytics():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Work Log Status
    cursor.execute("""
        SELECT status, COUNT(*) AS total
        FROM work_logs
        GROUP BY status
    """)
    worklogs = cursor.fetchall()

    # Department Distribution
    cursor.execute("""
        SELECT department, COUNT(*) AS total
        FROM interns
        GROUP BY department
    """)
    departments = cursor.fetchall()

    # Attendance (Last 7 Days)
    cursor.execute("""
        SELECT attendance_date, COUNT(*) AS total
        FROM attendance
        WHERE attendance_date >= CURDATE() - INTERVAL 6 DAY
        GROUP BY attendance_date
        ORDER BY attendance_date
    """)
    attendance = cursor.fetchall()

    # Leave Status
    cursor.execute("""
        SELECT status, COUNT(*) AS total
        FROM leave_requests
        GROUP BY status
    """)
    leaves = cursor.fetchall()

    # Top 5 Interns
    cursor.execute("""
        SELECT
            i.full_name,
            SUM(w.hours_worked) AS total_hours
        FROM interns i
        JOIN work_logs w
            ON i.intern_id = w.intern_id
        GROUP BY i.intern_id
        ORDER BY total_hours DESC
        LIMIT 5
    """)
    top_interns = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
    "worklogs": worklogs,
    "departments": departments,
    "attendance": attendance,
    "leaves": leaves,
    "topInterns": top_interns
})
# ==========================
# Dashboard Summary
# ==========================
@admin_bp.route("/dashboard-summary", methods=["GET"])
def dashboard_summary():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Total Interns
    cursor.execute("SELECT COUNT(*) AS totalInterns FROM interns")
    totalInterns = cursor.fetchone()["totalInterns"]

    # Pending Work Logs
    cursor.execute("""
        SELECT COUNT(*) AS pending
        FROM work_logs
        WHERE status='Pending'
    """)
    pending = cursor.fetchone()["pending"]

    # Approved Work Logs
    cursor.execute("""
        SELECT COUNT(*) AS approved
        FROM work_logs
        WHERE status='Approved'
    """)
    approved = cursor.fetchone()["approved"]

    # Rejected Work Logs
    cursor.execute("""
        SELECT COUNT(*) AS rejected
        FROM work_logs
        WHERE status='Rejected'
    """)
    rejected = cursor.fetchone()["rejected"]

    cursor.close()
    conn.close()

    return jsonify({
        "totalInterns": totalInterns,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    })