import { useState } from "react";
import axios from "axios";
import logo from "../assets/midbrains_technologies_logo.jpg";

function InternSignup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    dob: "",
    department: "",
    address: "",
    profile_image: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profile_image") {
      setFormData({
        ...formData,
        profile_image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Registration Successful");

      window.location.href = "/login";

    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-2"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: "700px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-3">

          {/* Logo */}

          <div className="text-center mb-3">
            <img
              src={logo}
              alt="Midbrains Technologies"
              style={{
                width: "280px",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />

            <p
              className="text-muted mt-1"
              style={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Create your intern account
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-2">
              <label className="form-label fw-semibold">
                Profile Photo
              </label>

              <input
                type="file"
                name="profile_image"
                className="form-control form-control"
                style={{ borderRadius: "12px" }}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                className="form-control form-control"
                style={{ borderRadius: "12px" }}
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control form-control"
                  style={{ borderRadius: "12px" }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
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
                    name="password"
                    className="form-control form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
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
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control form-control"
                  style={{ borderRadius: "12px" }}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  className="form-control form-control"
                  style={{ borderRadius: "12px" }}
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Gender
                </label>

                <select
                  name="gender"
                  className="form-select form-select"
                  style={{ borderRadius: "12px" }}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  className="form-control form-control"
                  style={{ borderRadius: "12px" }}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Department
              </label>

              <input
                type="text"
                name="department"
                className="form-control form-control"
                style={{ borderRadius: "12px" }}
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Address
              </label>

              <textarea
                rows="3"
                name="address"
                className="form-control"
                style={{ borderRadius: "12px" }}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold"
              style={{
                borderRadius: "12px",
                fontSize: "17px",
                backgroundColor: "rgb(2, 26, 77)",
                borderColor: "rgb(2, 26, 77)",
              }}
            >
              Register
            </button>

            {/* Already have an account */}
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account? </span>

              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none fw-bold"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </button>
            </div>
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

export default InternSignup;