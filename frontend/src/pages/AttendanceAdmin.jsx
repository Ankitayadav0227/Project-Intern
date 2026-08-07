import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

function AttendanceAdmin() {
  const [attendance, setAttendance] = useState([]);
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    intern_id: "",
    attendance_date: "",
    status: "Present",
  });

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/attendance"
      );

      setAttendance(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/interns"
      );

      setInterns(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchInterns();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const markAttendance = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/attendance",
        form
      );

      alert(res.data.message);

      setForm({
        intern_id: "",
        attendance_date: "",
        status: "Present",
      });

      fetchAttendance();
    } catch (err) {
      console.log(err);
      alert("Unable to mark attendance");
    }
  };

  const filteredAttendance = attendance.filter(
    (item) =>
      item.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.department
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
  <AdminLayout>
    <div className="container mt-4">
      <h2>Absence Record</h2>

      <div className="card shadow p-4 mb-4">
        <h4>Mark Attendance</h4>

        <form onSubmit={markAttendance}>
          <select
            name="intern_id"
            className="form-control mb-3"
            value={form.intern_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Intern</option>

            {interns.map((intern) => (
              <option
                key={intern.intern_id}
                value={intern.intern_id}
              >
                {intern.full_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="attendance_date"
            className="form-control mb-3"
            value={form.attendance_date}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            className="form-control mb-3"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button
            type="submit"
            className="btn btn-success"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      <div className="card shadow">
        <div className="card-header">
          <h4>Attendance Records</h4>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Manage Attendance</h2>

            <input
              type="text"
              placeholder="Search Intern..."
              className="form-control"
              style={{ width: "300px" }}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <table className="table table-hover align-middle shadow rounded overflow-hidden">
            <thead
              className="text-white"
              style={{ background: "#2563EB" }}
            >
              <tr>
                <th>Intern</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((item) => (
                  <tr key={item.attendance_id}>
                    <td>{item.full_name}</td>
                    <td>{item.department}</td>
                    <td>{item.attendance_date}</td>

                    <td>
                      {item.status === "Present" ? (
                        <span className="badge bg-success">
                          Present
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Absent
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
                    No Attendance Records Found
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

export default AttendanceAdmin;