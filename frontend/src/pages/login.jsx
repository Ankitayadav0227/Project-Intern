import { useState } from "react";
import axios from "axios";
import logo from "../assets/midbrains_technologies_logo.jpg";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("intern");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();


    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          username,
          password,
          role
        }
      );


      console.log("LOGIN RESPONSE:", res.data);


      if(res.data.success){


        alert("Login Successful");


        // Remove previous login data
        localStorage.removeItem("admin");
        localStorage.removeItem("intern");


        if(role === "admin" && res.data.admin){

          localStorage.setItem(
            "admin",
            JSON.stringify(res.data.admin)
          );


          window.location.href="/admin";

        }


        else if(role === "intern" && res.data.intern){


          localStorage.setItem(
            "intern",
            JSON.stringify(res.data.intern)
          );


          window.location.href="/intern";

        }


        else{

          alert("Invalid login response");

        }


      }

      else{

        alert(res.data.message);

      }


    }

    catch(err){

      console.log(
        "ERROR:",
        err.response?.data || err.message
      );


      alert(
        err.response?.data?.message ||
        "Server error"
      );

    }

  };



  return (

    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight:"100vh"
      }}
    >


      <div
        className="card shadow-lg border-0"
        style={{
          width:"450px",
          borderRadius:"20px"
        }}
      >


        <div className="card-body p-4">


          <div className="text-center mb-4">


            <img
              src={logo}
              alt="Midbrains Technologies"
              style={{
                width:"280px"
              }}
            />


            <p className="text-muted mt-2">
              Login to continue
            </p>


          </div>



          <form onSubmit={handleLogin}>


            {/* Username */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Username
              </label>


              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Username"
                value={username}
                autoComplete="username"
                onChange={(e)=>
                  setUsername(e.target.value)
                }
                required
              />

            </div>



            {/* Password */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Password
              </label>


              <div className="input-group">


                <input
                  type={
                    showPassword
                    ? "text"
                    : "password"
                  }
                  className="form-control form-control-lg"
                  placeholder="Enter Password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e)=>
                    setPassword(e.target.value)
                  }
                  required
                />


                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={()=>
                    setShowPassword(!showPassword)
                  }
                >

                  <i
                    className={
                      showPassword
                      ? "bi bi-eye-slash-fill"
                      : "bi bi-eye-fill"
                    }
                  ></i>


                </button>


              </div>


            </div>




            {/* Role */}

            <div className="mb-4">


              <label className="form-label fw-semibold">
                Login As
              </label>


              <select
                className="form-select form-select-lg"
                value={role}
                onChange={(e)=>
                  setRole(e.target.value)
                }
              >

                <option value="intern">
                  Intern
                </option>


                <option value="admin">
                  Admin
                </option>


              </select>


            </div>




            <button
              type="submit"
              className="btn w-100 py-3 fw-bold"
              style={{
                backgroundColor:"rgb(2,26,77)",
                color:"white",
                borderRadius:"12px"
              }}
            >

              Login

            </button>



          </form>



          <div className="text-center mt-4">

            <small className="text-muted">
              © 2026 Midbrains Technologies
            </small>

          </div>


        </div>


      </div>


    </div>

  );

}


export default Login;