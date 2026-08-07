import { useEffect, useState } from "react";
import axios from "axios";
import InternSidebar from "../components/InternSidebar";
import InternNavbar from "../components/InternNavbar";

function LeaveIntern() {
  const internData = localStorage.getItem("intern");
  const intern = internData ? JSON.parse(internData) : null;

  useEffect(() => {
    if (!intern) {
      window.location.href = "/login";
    }
  }, [intern]);

  // If not logged in, don't render
  if (!intern) return null;

  // Form state
  const [form, setForm] = useState({
    intern_id: intern.intern_id,
    from_date: "",
    to_date: "",
    reason: "",
  });

  // ✅ Added missing state
  const [leaves, setLeaves] = useState([]);

  // Fetch leave history
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/leave/${intern.intern_id}`
      );

      setLeaves(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Apply leave
  const applyLeave = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/leave",
        form
      );

      alert(res.data.message);

      setForm({
        intern_id: intern.intern_id,
        from_date: "",
        to_date: "",
        reason: "",
      });

      fetchLeaves();
    } catch (err) {
      console.log(err);
      alert("Unable to apply leave");
    }
  };

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

        <div className="container mt-4">
          <h2>Leave Planner</h2>

          {/* Apply Leave Form */}
          <div className="card shadow p-4 mb-4">
            <h4>Apply for Leave</h4>

            <form onSubmit={applyLeave}>
              <input
                type="date"
                name="from_date"
                className="form-control mb-3"
                value={form.from_date}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="to_date"
                className="form-control mb-3"
                value={form.to_date}
                onChange={handleChange}
                required
              />

              <textarea
                name="reason"
                className="form-control mb-3"
                placeholder="Reason for Leave"
                value={form.reason}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-success"
              >
                Apply Leave
              </button>
            </form>
          </div>

          {/* Leave History */}
          <div className="card shadow">
            <div
              className="card-header text-white"
              style={{
                backgroundColor: "rgb(2,26,77)",
              }}
            >
              <h4 className="mb-0">My Leave Requests</h4>
            </div>

            <div className="card-body">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <tr key={leave.leave_id}>
                        <td>{leave.from_date}</td>
                        <td>{leave.to_date}</td>
                        <td>{leave.reason}</td>
                        <td>
                          {leave.status === "Approved" ? (
                            <span className="badge bg-success">
                              Approved
                            </span>
                          ) : leave.status === "Rejected" ? (
                            <span className="badge bg-danger">
                              Rejected
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center"
                      >
                        No Leave Requests Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LeaveIntern;