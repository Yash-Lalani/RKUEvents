import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DepAddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    departments: [],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDept, setCurrentDept] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); 
    if (user?.department) {
      setCurrentDept(user.department);
      setFormData((prev) => ({ ...prev, departments: [user.department] }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/events/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Event created successfully!");
        setFormData({
          name: "",
          description: "",
          date: "",
          time: "",
          location: "",
          image: "",
          departments: [currentDept],
        });
      } else {
        setMessage("❌ " + (data.msg || "Failed to create event."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-3xl mx-auto rounded-3xl mt-6 relative overflow-hidden glass shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Create New Event</h2>
        <p className="text-gray-400 mb-8 whitespace-pre-wrap">Publish an event exclusively for the {currentDept} department.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-2">Event Title</label>
              <input type="text" name="name" placeholder="Enter title" value={formData.name} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-2">Short Description</label>
              <input type="text" name="description" placeholder="A brief one-line summary" value={formData.description} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none [color-scheme:dark]" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none [color-scheme:dark]" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Location</label>
              <input type="text" name="location" placeholder="e.g. Main Auditorium" value={formData.location} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Banner Image URL (Optional)</label>
              <input type="url" name="image" placeholder="https://..." value={formData.image} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 transition outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-2">Target Department (Locked)</label>
              <input type="text" value={currentDept || "Loading..."} readOnly disabled
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none font-bold uppercase tracking-wider" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all flex justify-center items-center mt-6"
          >
            {loading ? "Publishing..." : "Publish Event"}
          </motion.button>
        </form>

        {message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 p-4 rounded-xl border ${message.includes('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <p className="text-center font-medium">{message}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DepAddEvent;
