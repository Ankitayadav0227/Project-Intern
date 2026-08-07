import { useEffect, useState } from "react";
import axios from "axios";
import InternSidebar from "../components/InternSidebar";
import InternNavbar from "../components/InternNavbar";

function InternProfile() {
  const internData = localStorage.getItem("intern");
  const intern = internData ? JSON.parse(internData) : null;

  const [profile, setProfile] = useState({});
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    if (!intern) {
      window.location.href = "/login";
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/intern/${intern.intern_id}`
      );

      setProfile(res.data);

      setFormData({
        full_name: res.data.full_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        department: res.data.department || "",
      });

    } catch (error) {
      console.log(error);
    }
  };


  const updateProfile = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/update-profile/${intern.intern_id}`,
        formData
      );

      alert("Profile Updated Successfully");

      setShowEdit(false);
      fetchProfile();

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };


  if (!intern) return null;


  return (
    <div className="d-flex">

      <InternSidebar />

      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >

        <InternNavbar />

        <div className="container py-4">

          <div className="card shadow border-0">

            {/* Cover */}
            <div
              style={{
                height: "220px",
                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",
              }}
            ></div>


            {/* Profile Header */}
            <div
              className="text-center"
              style={{
                marginTop: "-80px",
              }}
            >

              <img
                src={
                  profile.profile_image
                    ? `http://127.0.0.1:5000/${profile.profile_image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="rounded-circle border border-4 border-white shadow"
                width="160"
                height="160"
                style={{
                  objectFit: "cover",
                }}
              />


              <h2 className="mt-3 fw-bold">
                {profile.full_name || "Intern"}
              </h2>


              <p className="text-muted">
                {profile.department || "Department"}
              </p>


              <button
                className="btn btn-primary"
                onClick={() => setShowEdit(true)}
              >
                Edit Profile
              </button>

            </div>



            {/* Details */}

            <div className="card-body p-5">

              <div className="row">


                <div className="col-md-6 mb-4">

                  <div className="card shadow-sm h-100">

                    <div className="card-body">

                      <h4 className="text-primary">
                        Personal Information
                      </h4>

                      <hr />


                      <p>
                        <strong>Name:</strong>{" "}
                        {profile.full_name}
                      </p>


                      <p>
                        <strong>Email:</strong>{" "}
                        {profile.email}
                      </p>


                      <p>
                        <strong>Phone:</strong>{" "}
                        {profile.phone}
                      </p>


                      <p>
                        <strong>Department:</strong>{" "}
                        {profile.department}
                      </p>


                    </div>

                  </div>

                </div>



                <div className="col-md-6 mb-4">

                  <div className="card shadow-sm h-100">

                    <div className="card-body">

                      <h4 className="text-success">
                        Internship Details
                      </h4>

                      <hr />


                      <p>
                        <strong>Intern ID:</strong>{" "}
                        {profile.intern_id}
                      </p>


                      <p>
                        <strong>Status:</strong>

                        <span className="badge bg-success ms-2">
                          Active
                        </span>

                      </p>


                      <p>
                        <strong>Role:</strong> Intern
                      </p>


                      <p>
                        <strong>Organization:</strong>{" "}
                        MidBrains Technologies
                      </p>


                    </div>

                  </div>

                </div>


              </div>



              {/* Edit Modal */}

              {showEdit && (

                <div
                  className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                  style={{
                    background:"rgba(0,0,0,.5)",
                    zIndex:9999
                  }}
                >

                  <div
                    className="bg-white rounded shadow p-4"
                    style={{
                      width:"450px"
                    }}
                  >

                    <h3 className="mb-4 text-center">
                      Edit Profile
                    </h3>


                    <input
                      className="form-control mb-3"
                      placeholder="Full Name"
                      value={formData.full_name}
                      onChange={(e)=>
                        setFormData({
                          ...formData,
                          full_name:e.target.value
                        })
                      }
                    />


                    <input
                      className="form-control mb-3"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e)=>
                        setFormData({
                          ...formData,
                          email:e.target.value
                        })
                      }
                    />


                    <input
                      className="form-control mb-3"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e)=>
                        setFormData({
                          ...formData,
                          phone:e.target.value
                        })
                      }
                    />


                    <input
                      className="form-control mb-4"
                      placeholder="Department"
                      value={formData.department}
                      onChange={(e)=>
                        setFormData({
                          ...formData,
                          department:e.target.value
                        })
                      }
                    />


                    <div className="text-end">

                      <button
                        className="btn btn-secondary me-2"
                        onClick={() => setShowEdit(false)}
                      >
                        Cancel
                      </button>


                      <button
                        className="btn btn-primary"
                        onClick={updateProfile}
                      >
                        Save Changes
                      </button>

                    </div>


                  </div>

                </div>

              )}


            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default InternProfile; 