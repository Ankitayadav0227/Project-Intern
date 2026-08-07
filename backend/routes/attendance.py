from flask import Blueprint, request, jsonify
from db import get_connection

attendance_bp = Blueprint("attendance", __name__)


# ==========================
# Mark Attendance
# ==========================
@attendance_bp.route("/attendance", methods=["POST"])
def mark_attendance():

    try:

        data = request.get_json()

        intern_id = data.get("intern_id")
        attendance_date = data.get("attendance_date")
        status = data.get("status")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO attendance
            (intern_id, attendance_date, status)
            VALUES (%s, %s, %s)
        """, (
            intern_id,
            attendance_date,
            status
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Attendance Marked Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    # ==========================
# Get All Attendance
# ==========================
@attendance_bp.route("/attendance", methods=["GET"])
def get_attendance():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            a.attendance_id,
            i.full_name,
            i.department,
            a.attendance_date,
            a.status
        FROM attendance a
        JOIN interns i
        ON a.intern_id = i.intern_id
        ORDER BY a.attendance_date DESC
    """)

    attendance = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": attendance
    })