from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from db import get_connection
import os


auth_bp = Blueprint("auth", __name__)


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



# ==========================
# INTERN SIGNUP
# ==========================

@auth_bp.route("/signup", methods=["POST"])
def signup():

    try:

        data = request.form

        profile_image = request.files.get("profile_image")

        image_path = None


        if profile_image and profile_image.filename:

            filename = secure_filename(
                profile_image.filename
            )

            filepath = os.path.join(
                UPLOAD_FOLDER,
                filename
            )

            profile_image.save(filepath)

            image_path = f"uploads/{filename}"



        hashed_password = generate_password_hash(
            data.get("password")
        )


        conn = get_connection()
        cursor = conn.cursor()


        cursor.execute(
            """
            INSERT INTO interns
            (
                full_name,
                email,
                password,
                department,
                join_date,
                phone,
                age,
                gender,
                dob,
                address,
                profile_image
            )

            VALUES
            (
                %s,%s,%s,%s,
                CURDATE(),
                %s,%s,%s,%s,%s,%s
            )
            """,

            (
                data.get("full_name"),
                data.get("email"),
                hashed_password,
                data.get("department"),
                data.get("phone"),
                data.get("age") or None,
                data.get("gender"),
                data.get("dob") or None,
                data.get("address"),
                image_path
            )
        )


        conn.commit()

        cursor.close()
        conn.close()


        return jsonify({

            "success": True,
            "message": "Registration Successful"

        }),201



    except Exception as e:

        print("SIGNUP ERROR:",e)

        return jsonify({

            "success":False,
            "message":str(e)

        }),500





# ==========================
# LOGIN
# ==========================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()


        username = data.get("username")
        password = data.get("password")
        role = data.get("role")


        print(data)



        if not username or not password or not role:

            return jsonify({

                "success":False,
                "message":"Username, password and role are required"

            }),400



        conn = get_connection()

        cursor = conn.cursor(dictionary=True)



        # ==================
        # ADMIN LOGIN
        # ==================

        if role == "admin":


            cursor.execute(
                """
                SELECT *
                FROM admins
                WHERE username=%s
                """,
                (username,)
            )


            admin = cursor.fetchone()



            cursor.close()
            conn.close()



            if admin and check_password_hash(
                admin["password"],
                password
            ):


                return jsonify({

                    "success":True,

                    "admin":{

                        "username":admin["username"]

                    }

                })



            return jsonify({

                "success":False,
                "message":"Invalid Admin Username or Password"

            }),401





        # ==================
        # INTERN LOGIN
        # ==================

        else:


            # username field contains email
            cursor.execute(

                """
                SELECT *
                FROM interns
                WHERE email=%s
                """,

                (username,)

            )


            intern = cursor.fetchone()



            cursor.close()
            conn.close()



            if intern and check_password_hash(
                intern["password"],
                password
            ):


                return jsonify({

                    "success":True,

                    "intern":{

                        "intern_id":intern["intern_id"],
                        "full_name":intern["full_name"],
                        "email":intern["email"],
                        "department":intern["department"]

                    }

                })



            return jsonify({

                "success":False,
                "message":"Invalid Intern Username or Password"

            }),401




    except Exception as e:


        print("LOGIN ERROR:",e)


        return jsonify({

            "success":False,
            "message":str(e)

        }),500