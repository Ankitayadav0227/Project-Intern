from flask import Blueprint, request, jsonify
from db import get_connection

leave_bp = Blueprint("leave", __name__)

# ==========================
# Apply Leave
# ==========================
@leave_bp.route("/leave", methods=["POST"])
def apply_leave():

    try:

        data = request.get_json()

        intern_id = data.get("intern_id")
        from_date = data.get("from_date")
        to_date = data.get("to_date")
        reason = data.get("reason")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO leave_requests
            (intern_id, from_date, to_date, reason)
            VALUES (%s, %s, %s, %s)
        """, (
            intern_id,
            from_date,
            to_date,
            reason
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Leave Request Submitted Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
    # ==========================
# Get All Leave Requests
# ==========================
@leave_bp.route("/leave", methods=["GET"])
def get_leave_requests():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            l.leave_id,
            i.full_name,
            i.department,
            l.from_date,
            l.to_date,
            l.reason,
            l.status
        FROM leave_requests l
        JOIN interns i
        ON l.intern_id = i.intern_id
        ORDER BY l.from_date DESC
    """)

    leave_requests = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": leave_requests
    })
# ==========================
# Approve Leave
# ==========================
@leave_bp.route("/leave/approve/<int:leave_id>", methods=["PUT"])
def approve_leave(leave_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE leave_requests
        SET status='Approved'
        WHERE leave_id=%s
    """, (leave_id,))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Leave Approved Successfully"
    })
# ==========================
# Reject Leave
# ==========================
@leave_bp.route("/leave/reject/<int:leave_id>", methods=["PUT"])
def reject_leave(leave_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE leave_requests
        SET status='Rejected'
        WHERE leave_id=%s
    """, (leave_id,))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Leave Rejected Successfully"
    })
# ==========================
# Get Leave Requests of One Intern
# ==========================
@leave_bp.route("/leave/<int:intern_id>", methods=["GET"])
def get_intern_leave(intern_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            leave_id,
            from_date,
            to_date,
            reason,
            status
        FROM leave_requests
        WHERE intern_id=%s
        ORDER BY from_date DESC
    """, (intern_id,))

    leaves = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "data": leaves
    })