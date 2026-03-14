import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DepartmentAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/super-admin/department-admins");
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/super-admin/department-admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/super-admin/department-admins/${editingAdmin._id}`,
        editingAdmin
      );
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-10 min-h-[80vh]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Department Admins</h1>
          <p className="text-gray-400">Manage all department-level administrators.</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No department admins found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{admin.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold tracking-wide">
                        {admin.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                        title="Edit Admin"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Admin"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingAdmin && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2 hover:bg-white/10"
                onClick={() => setEditingAdmin(null)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Admin</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editingAdmin.name}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editingAdmin.email}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Department</label>
                    <input
                      type="text"
                      value={editingAdmin.department}
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, department: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase font-bold mb-2">New Password (Optional)</label>
                    <input
                      type="password"
                      onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                      placeholder="Leave blank to keep unchanged"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-600"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setEditingAdmin(null)}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentAdmins;