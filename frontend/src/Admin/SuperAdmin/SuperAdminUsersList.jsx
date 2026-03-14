import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const SuperAdminUsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("User permanently deleted.");
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="pb-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Registered Users Database</h1>
        <p className="text-gray-400">Complete list of all active students and administrators across the platform.</p>
      </div>

      <div className="glass rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No users found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Context</th>
                  <th className="px-6 py-4 font-semibold">Enrollment Config</th>
                  <th className="px-6 py-4 font-semibold">Department Node</th>
                  <th className="px-6 py-4 font-semibold">System Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={user._id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-bold">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-300">
                        {user.enrollmentNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.department ? (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {user.department}
                        </span>
                      ) : (
                        <span className="text-gray-600 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider
                        ${user.role === 'superadmin' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : ''}
                        ${user.role === 'department-admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : ''}
                        ${user.role === 'student' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : ''}
                        ${!['superadmin', 'department-admin', 'student'].includes(user.role) ? 'bg-gray-500/20 text-gray-400' : ''}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/super-admin/edit-user/${user._id}`)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                        title="Edit Configuration"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Terminate Node"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminUsersList;
