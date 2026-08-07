import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

function ManageInterns() {
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
    password: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    department: ""
  });

  const fetchInterns = async () => {
    try {
      const res = await axios.get(
  "http://127.0.0.1:5000/admin/interns"
);
      setInterns(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addIntern = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
  "http://127.0.0.1:5000/admin/interns",
  form
);

      alert(res.data.message);

      setForm({
        full_name: "",
        email: "",
        department: "",
        password: ""
      });

      fetchInterns();

    } catch (err) {
      console.log(err);
      alert("Unable to add intern");
    }
  };

  const updateIntern = async () => {
    try {

      const res = await axios.put(
        `http://127.0.0.1:5000/interns/${editingId}`,
        editForm
      );

      alert(res.data.message);

      setEditingId(null);

      setEditForm({
        full_name: "",
        email: "",
        department: ""
      });

      fetchInterns();

    } catch (err) {
      console.log(err);
      alert("Unable to update intern");
    }
  };

  const deleteIntern = async (id) => {

    if (!window.confirm("Are you sure you want to delete this intern?"))
      return;

    try {

      const res = await axios.delete(
  `http://127.0.0.1:5000/admin/interns/${id}`
);

      alert(res.data.message);

      fetchInterns();

    } catch (err) {
      console.log(err);
      alert("Unable to delete intern");
    }
  };

  // SEARCH FILTER
  const filteredInterns = interns.filter((intern) =>
    intern.full_name.toLowerCase().includes(search.toLowerCase()) ||
    intern.email.toLowerCase().includes(search.toLowerCase()) ||
    intern.department.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <AdminLayout>
      <div className="container-fluid mt-4">

        <h2 className="mb-4">Manage Interns</h2>

        {/* Add Intern */}
        <div
          className="card border-0 shadow-lg p-4 mb-4"
          style={{ borderRadius: "18px" }}
        >
          <h4 className="mb-3">Add Intern</h4>

          <form onSubmit={addIntern}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              className="form-control mb-3"
              value={form.full_name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              className="form-control mb-3"
              value={form.department}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn px-4"
              style={{
                backgroundColor: "rgb(2,26,77)",
                color: "white",
                border: "none",
              }}
            >
              Add Intern
            </button>
          </form>
        </div>

        {/* Edit Intern */}
        {editingId && (
          <div className="card shadow p-4 mb-4">
            <h4 className="mb-3">Edit Intern</h4>

            <input
              className="form-control mb-3"
              value={editForm.full_name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  full_name: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  email: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              value={editForm.department}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  department: e.target.value
                })
              }
            />

            <button
              className="btn btn-success me-2"
              onClick={updateIntern}
            >
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setEditForm({
                  full_name: "",
                  email: "",
                  department: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Search */}
        <div className="card shadow p-3 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by Name, Email or Department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Intern List */}
        <div className="card shadow">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Intern List</h4>

            <span
              className="badge"
              style={{
                backgroundColor: "rgb(2,26,77)",
                color: "white",
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              Total: {filteredInterns.length}
            </span>
          </div>

          <div className="card-body">
            <table className="table table-bordered table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInterns.length > 0 ? (
                  filteredInterns.map((intern) => (
                    <tr key={intern.intern_id}>
                      <td>{intern.intern_id}</td>

                      <td>{intern.full_name}</td>

                      <td>{intern.email}</td>

                      <td>
                        <span className="badge bg-info text-dark">
                          {intern.department}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => {
                            setEditingId(intern.intern_id);

                            setEditForm({
                              full_name: intern.full_name,
                              email: intern.email,
                              department: intern.department
                            });

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth"
                            });
                          }}
                        >
                          ✏ Edit
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            deleteIntern(intern.intern_id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-muted py-4"
                    >
                      No interns found.
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

export default ManageInterns;