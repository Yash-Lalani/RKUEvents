import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartmentAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:5000/api/super-admin/department-admins");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete Admin
  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    await axios.delete(`http://localhost:5000/api/super-admin/department-admins/${id}`);
    fetchAdmins();
  };

  // Save edit
  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/super-admin/department-admins/${editingAdmin._id}`,
      editingAdmin
    );
    setEditingAdmin(null);
    fetchAdmins();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Department Admins
      </h1>

      {/* EDIT MODAL */}
     {editingAdmin && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-2xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-teal-700">
        Edit Department Admin
      </h2>

      {/* NAME */}
      <input
        type="text"
        value={editingAdmin.name}
        onChange={(e) =>
          setEditingAdmin({ ...editingAdmin, name: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-teal-500 outline-none"
        placeholder="Name"
      />

      {/* EMAIL */}
      <input
        type="email"
        value={editingAdmin.email}
        onChange={(e) =>
          setEditingAdmin({ ...editingAdmin, email: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-teal-500 outline-none"
        placeholder="Email"
      />

      {/* DEPARTMENT */}
      <input
        type="text"
        value={editingAdmin.department}
        onChange={(e) =>
          setEditingAdmin({ ...editingAdmin, department: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-teal-500 outline-none"
        placeholder="Department"
      />

      {/* PASSWORD (Optional Update) */}
      <input
        type="password"
        onChange={(e) =>
          setEditingAdmin({ ...editingAdmin, password: e.target.value })
        }
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-teal-500 outline-none"
        placeholder="New Password (optional)"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setEditingAdmin(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>

        <button
          onClick={saveEdit}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


      {/* TABLE */}
      <table className="w-full border-collapse shadow-md">
        <thead>
          <tr className="bg-teal-600 text-white">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No Admins Found
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin._id} className="border-b">
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.department}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditingAdmin(admin)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAdmin(admin._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentAdmins;