import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const availableDepts = ["ALL", "SOE", "SOS", "SOM", "PHARMACY"];

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (dept) => {
    setSelectedEvent((prev) => {
      let updated = [...(prev.departments || [])];
      if (updated.includes(dept)) {
        updated = updated.filter((d) => d !== dept);
      } else {
        if (dept === "ALL") updated = ["ALL"];
        else {
          updated = updated.filter((d) => d !== "ALL");
          updated.push(dept);
        }
      }
      return { ...prev, departments: updated };
    });
  };

  const updateEvent = async () => {
    if (!selectedEvent.departments || selectedEvent.departments.length === 0) {
      alert("Please select at least one target department.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, {
        name: selectedEvent.name,
        description: selectedEvent.description,
        date: selectedEvent.date,
        departments: selectedEvent.departments,
        time: selectedEvent.time,
        location: selectedEvent.location,
        image: selectedEvent.image,
      });
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update event.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="pb-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Manage Events</h1>
        <p className="text-gray-400">View, edit, and remove university events.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event Name</th>
                  <th className="px-6 py-4 font-semibold">Target Departments</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-center">Registrations</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No events found.</td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{event.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{event.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(event.departments || []).map((dept, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/20">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold font-mono">
                          {event.totalRegistrations || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="p-2 glass rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition"
                            title="Edit Event"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="p-2 glass rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                            title="Delete Event"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-black border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10">
                <h2 className="text-2xl font-bold text-white">Edit Event</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] relative z-10 webkit-scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-medium mb-1">Event Name</label>
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                      value={selectedEvent.name}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, name: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-medium mb-1">Description</label>
                    <textarea
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none resize-none"
                      value={selectedEvent.description}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none [color-scheme:dark]"
                      value={selectedEvent.date}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none [color-scheme:dark]"
                      value={selectedEvent.time}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-medium mb-1">Location</label>
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                      value={selectedEvent.location}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-medium mb-1">Image URL</label>
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                      value={selectedEvent.image}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, image: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-medium mb-2">Target Departments</label>
                    <div className="flex flex-wrap gap-2">
                      {availableDepts.map(dept => {
                        const isSelected = (selectedEvent.departments || []).includes(dept);
                        return (
                          <button
                            type="button"
                            key={dept}
                            onClick={() => handleCheckboxChange(dept)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isSelected 
                                ? 'bg-blue-600/40 text-blue-200 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
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
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-4 relative z-10 bg-black/50">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateEvent}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsList;
