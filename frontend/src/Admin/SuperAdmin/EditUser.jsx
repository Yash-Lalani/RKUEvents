import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircleIcon, IdentificationIcon, BuildingOfficeIcon, ShieldCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    enrollmentNumber: "",
    department: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user details
  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`);
      const data = await res.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save edited user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        navigate("/super-admin/users");
      }
    } catch (error) {
      console.error("Update user error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-10"
    >
      <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              Modify User Identity
            </h1>
            <p className="text-gray-400 text-sm">Update clearance levels, department access, and primary identifiers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Communication Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrollment Number */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Enrollment ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IdentificationIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    name="enrollmentNumber"
                    value={user.enrollmentNumber}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. 21SOE..."
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Sector / Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <select
                    name="department"
                    value={user.department}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
                  >
                    <option value="" className="bg-gray-900">Select Department</option>
                    <option value="SOC" className="bg-gray-900">SOC</option>
                    <option value="SOM" className="bg-gray-900">SOM</option>
                    <option value="SOS" className="bg-gray-900">SOS</option>
                    <option value="SOA" className="bg-gray-900">SOA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">System Authorization Level</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
                </div>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
                >
                  <option value="" className="bg-gray-900">Select Level</option>
                  <option value="student" className="bg-gray-900">Student (Standard User)</option>
                  <option value="department-admin" className="bg-gray-900">Department Admin</option>
                  <option value="superadmin" className="bg-gray-900">Super Admin (Global Access)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/super-admin/users")}
                className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold transition-colors"
                disabled={saving}
              >
                Cancel Process
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex justify-center items-center"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Deploy Upgrades"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditUser;
