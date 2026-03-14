import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlusIcon } from "@heroicons/react/24/outline";

const AddDepartmentAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/department-admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Department Admin added successfully!");
        setFormData({ name: "", email: "", password: "", department: "" });
      } else {
        setMessage(`❌ ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10 min-h-[80vh] flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] w-full max-w-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Add Department Admin
          </h2>
          <p className="text-gray-400">Create a new administrative account for a specific department.</p>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@department.rku.ac.in"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Assigned Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. SOE, SOM, PHARMACY"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 transition uppercase"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><UserPlusIcon className="w-5 h-5" /> Add Administrator</>
            )}
          </motion.button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-xl text-center font-medium border ${message.includes('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AddDepartmentAdmin;
