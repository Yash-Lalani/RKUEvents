import { useState } from "react";
import { motion } from "framer-motion";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    departments: [], // array for multiple departments
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const availableDepts = ["ALL", "SOE", "SOS", "SOM", "PHARMACY"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (dept) => {
    setFormData((prev) => {
      let updated = [...prev.departments];
      if (updated.includes(dept)) {
        updated = updated.filter((d) => d !== dept);
      } else {
        if (dept === "ALL") updated = ["ALL"]; // ALL overrides others
        else {
          updated = updated.filter((d) => d !== "ALL");
          updated.push(dept);
        }
      }
      return { ...prev, departments: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.departments.length === 0) {
      setMessage("Please select at least one target department.");
      return;
    }

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
          name: "", description: "", date: "", time: "", location: "", image: "", departments: [],
        });
      } else {
        setMessage("❌ " + (data.msg || "Failed to create event."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Check database connection.");
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
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Create New Event</h2>
        <p className="text-gray-400 mb-8 whitespace-pre-wrap">Publish an event to the selected departments across the university.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-2">Event Title</label>
              <input type="text" name="name" placeholder="Enter title" value={formData.name} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-2">Short Description</label>
              <input type="text" name="description" placeholder="A brief one-line summary" value={formData.description} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none [color-scheme:dark]" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none [color-scheme:dark]" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Location</label>
              <input type="text" name="location" placeholder="e.g. Main Auditorium" value={formData.location} onChange={handleChange} required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Banner Image URL</label>
              <input type="url" name="image" placeholder="https://..." value={formData.image} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm font-medium mb-3">Target Departments</label>
              <div className="flex flex-wrap gap-3">
                {availableDepts.map(dept => {
                  const isSelected = formData.departments.includes(dept);
                  return (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => handleCheckboxChange(dept)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex justify-center items-center mt-6"
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

export default AddEvent;
