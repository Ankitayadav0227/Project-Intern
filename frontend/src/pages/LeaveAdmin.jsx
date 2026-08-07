import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";


function LeaveAdmin() {

  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/leave"
      );

      setLeaves(res.data.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchLeaves();

  }, []);
  const approveLeave = async (id) => {

    try {

      const res = await axios.put(
        `http://127.0.0.1:5000/leave/approve/${id}`
      );

      alert(res.data.message);

      fetchLeaves();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <AdminLayout>
      <div className="container mt-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Leave Requests</h2>

          <button
            className="btn"
            style={{
              backgroundColor: "rgb(2,26,77)",
              color: "white",
              border: "none",
            }}
            onClick={() => window.location.href = "/admin"}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="card shadow">

          <div
            className="card-header text-white"
            style={{
              backgroundColor: "rgb(2,26,77)",
            }}
          >
            <h4 className="mb-0">All Leave Requests</h4>
          </div>

          <div className="card-body">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>Intern</th>
                  <th>Department</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {leaves.length > 0 ? (

                  leaves.map((leave) => (

                    <tr key={leave.leave_id}>

                      <td>{leave.full_name}</td>

                      <td>{leave.department}</td>

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

                      <td>

                        {leave.status === "Pending" ? (

                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => approveLeave(leave.leave_id)}
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => rejectLeave(leave.leave_id)}
                            >
                              Reject
                            </button>
                          </>

                        ) : (

                          <span className="text-muted">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="7" className="text-center">
                      No Leave Requests Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default LeaveAdmin;