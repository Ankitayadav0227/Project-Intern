import { useState, useEffect } from "react";
import axios from "axios";
import InternSidebar from "../components/InternSidebar";
import InternNavbar from "../components/InternNavbar";

function InternDashboard() {
  const intern = JSON.parse(localStorage.getItem("intern"));

  useEffect(() => {
    if (!intern) {
      window.location.href = "/";
    }
  }, []);

  const [form, setForm] = useState({
    intern_id: intern?.intern_id || "",
    work_date: "",
    task_title: "",
    description: "",
    hours_worked: "",
    file: null,
  });

  const [logs, setLogs] = useState([]);

  const [stats, setStats] = useState({
    totalLogs: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    work_date: "",
    task_title: "",
    description: "",
    hours_worked: "",
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/worklogs/${intern.intern_id}`
      );

      setLogs(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/intern-summary/${intern.intern_id}`
      );

      setStats(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (intern) {
      fetchLogs();
      fetchSummary();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.keys(form).forEach((k) => {
      if (form[k] != null) {
        fd.append(k, form[k]);
      }
    });

    await axios.post(
      "http://127.0.0.1:5000/worklog",
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    fetchLogs();
    fetchSummary();

    setForm({
      intern_id: intern.intern_id,
      work_date: "",
      task_title: "",
      description: "",
      hours_worked: "",
      file: null,
    });
  };

  const deleteLog = async (id) => {
    await axios.delete(
      `http://127.0.0.1:5000/worklog/${id}`
    );

    fetchLogs();
    fetchSummary();
  };

  const updateLog = async () => {
    await axios.put(
      `http://127.0.0.1:5000/worklog/${editingId}`,
      editForm
    );

    setEditingId(null);

    fetchLogs();
    fetchSummary();
  };

  const logout = () => {
    localStorage.removeItem("intern");
    window.location.href = "/";
  };

  return (
    <div className="d-flex">
      <InternSidebar />

      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
          minHeight: "100vh"
        }}
      >
        <InternNavbar />

        <div className="p-4"></div>
        <div className="container-fluid bg-light min-vh-100 p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2 className="fw-bold">
                Welcome, {intern?.full_name}
              </h2>

              <p className="text-muted mb-0">
                Track work logs and progress
              </p>
            </div>

            <button
              className="btn btn-danger"
              onClick={logout}
            >
              Logout
            </button>

          </div>

          <div className="row mb-4">

            <div className="col-lg-3 col-md-6 mb-3">

              <div
                className="card border-0 shadow-lg text-white"
                style={{
                  backgroundColor: "rgb(2,26,77)",
                }}
              >
                <div className="card-body">
                  <h6>Total Logs</h6>
                  <h2>{stats.totalLogs}</h2>
                </div>
              </div>

            </div>

            <div className="col-lg-3 col-md-6 mb-3">

              <div className="card border-0 shadow-lg bg-success text-white">

                <div className="card-body">

                  <h6>Approved</h6>

                  <h2>{stats.approved}</h2>

                </div>

              </div>

            </div>

            <div className="col-lg-3 col-md-6 mb-3">

              <div className="card border-0 shadow-lg bg-warning">

                <div className="card-body">

                  <h6>Pending</h6>

                  <h2>{stats.pending}</h2>

                </div>

              </div>

            </div>

            <div className="col-lg-3 col-md-6 mb-3">

              <div className="card border-0 shadow-lg bg-danger text-white">

                <div className="card-body">

                  <h6>Rejected</h6>

                  <h2>{stats.rejected}</h2>

                </div>

              </div>

            </div>

          </div>
          {/* Add Work Log */}

          <div className="card border-0 shadow-lg mb-4">

            <div
              className="card-header text-white"
              style={{
                backgroundColor: "rgb(2,26,77)",
              }}
            >
              <h4 className="mb-0">Add Daily Work Log</h4>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">Work Date</label>

                    <input
                      type="date"
                      name="work_date"
                      className="form-control"
                      value={form.work_date}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">Hours Worked</label>

                    <input
                      type="number"
                      step="0.5"
                      name="hours_worked"
                      className="form-control"
                      value={form.hours_worked}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                <div className="mb-3">

                  <label className="form-label">Task Title</label>

                  <input
                    type="text"
                    name="task_title"
                    className="form-control"
                    placeholder="Enter task title"
                    value={form.task_title}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">Description</label>

                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    placeholder="Describe today's work..."
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                </div>
 
                <div className="mb-3">

                  <label className="form-label">Upload File</label>

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        file: e.target.files[0],
                      })
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-success px-4"
                >
                  Submit Work Log
                </button>

              </form>

            </div>

          </div>

          {/* Edit Work Log */}

          {editingId && (

            <div className="card border-0 shadow-lg mb-4">

              <div className="card-header bg-warning">
                <h5 className="mb-0">Edit Work Log</h5>
              </div>

              <div className="card-body">

                <input
                  type="date"
                  className="form-control mb-3"
                  value={editForm.work_date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      work_date: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  className="form-control mb-3"
                  value={editForm.task_title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      task_title: e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  value={editForm.hours_worked}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      hours_worked: e.target.value,
                    })
                  }
                />

                <button
                  className="btn btn-primary me-2"
                  onClick={updateLog}
                >
                  Save Changes
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

          {/* Work Log Table */}

          <div className="card border-0 shadow-lg">

            <div className="card-header bg-dark text-white">

              <h4 className="mb-0">
                My Work Logs
              </h4>

            </div>

            <div className="card-body">

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">

                    <tr>

                      <th>Date</th>
                      <th>Task</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>File</th>
                      <th>Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.length > 0 ? (

                      logs.map((log) => (

                        <tr key={log.log_id}>

                          <td>{log.work_date}</td>

                          <td>{log.task_title}</td>

                          <td>{log.hours_worked}</td>

                          <td>

                            <span
                              className={`badge ${log.status === "Approved"
                                ? "bg-success"
                                : log.status === "Rejected"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                                }`}
                            >
                              {log.status}
                            </span>

                          </td>

                          <td>

                            {log.file_name ? (

                              <a
                                href={`http://127.0.0.1:5000/uploads/${log.file_name}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-info btn-sm"
                              >
                                View File
                              </a>

                            ) : (

                              <span className="text-muted">
                                No File
                              </span>

                            )}

                          </td>

                          <td>

                            {log.status === "Pending" ? (

                              <>

                                <button
                                  className="btn btn-outline-primary btn-sm me-2"
                                  onClick={() => {

                                    setEditingId(log.log_id);

                                    setEditForm({
                                      ...log,
                                      work_date: String(log.work_date).split("T")[0],
                                    });

                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    deleteLog(log.log_id)
                                  }
                                >
                                  Delete
                                </button>

                              </>

                            ) : (

                              <span className="badge bg-secondary">
                                Locked
                              </span>

                            )}

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No work logs found.
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
    </div>

  );
}

export default InternDashboard;