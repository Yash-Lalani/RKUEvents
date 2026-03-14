import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownTrayIcon, ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, TrashIcon } from "@heroicons/react/24/outline";

const EventRegisteredUsers = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all events
  useEffect(() => {
    fetch("http://localhost:5000/api/super-admin/events/all")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ✅ Fetch registrations for selected event
  const loadRegistrations = (event) => {
    setSelectedEvent(event);
    setRegistrations([]);
    fetch(`http://localhost:5000/api/super-admin/events/${event._id}/registrations`)
      .then((res) => res.json())
      .then((data) => setRegistrations(data))
      .catch((err) => console.error(err));
  };

  // ✅ Download CSV
  const downloadCSV = () => {
    if (registrations.length === 0) return;
    const headers = [...Object.keys(registrations[0].responses)];
    const rows = registrations.map((reg) => [...Object.values(reg.responses)]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${selectedEvent?.name?.replace(/\s+/g, "_")}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to remove this specific registration?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/super-admin/events/registrations/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setRegistrations(registrations.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete registration");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting registration");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to completely clear ALL registrations for this event? This action will permanently remove all attendees and cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/super-admin/events/${selectedEvent._id}/registrations`, {
        method: "DELETE"
      });
      if (res.ok) {
        setRegistrations([]);
        alert("All registrations have been cleared successfully.");
      } else {
        alert("Failed to clear registrations");
      }
    } catch (err) {
      console.error(err);
      alert("Error clearing registrations");
    }
  };

  return (
    <div className="pb-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Registered Users</h1>
        <p className="text-gray-400">View and export attendee data for platform events.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div 
              key="events-grid"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => loadRegistrations(event)}
                  className="glass rounded-3xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-1 justify-end max-w-[80%]">
                      {(event.departments || []).map((dept, i) => (
                        <span key={i} className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-blue-600/60 text-white backdrop-blur-md">
                          {dept}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="text-xl font-bold text-white drop-shadow-md">{event.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-400 gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 gap-2">
                        <MapPinIcon className="w-4 h-4 text-pink-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Attendees</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                        {event.totalRegistrations || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 glass rounded-3xl border border-white/10">
                  No events found in the system.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="registrations-view"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass p-6 rounded-3xl border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 glass rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-white">Registrations: {selectedEvent.name}</h3>
                    <p className="text-sm text-gray-400">{registrations.length} attendees</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearAll}
                    disabled={registrations.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Clear All
                  </button>
                  <button
                    onClick={downloadCSV}
                    disabled={registrations.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                {registrations.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No users have registered for this event yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 font-semibold w-16">#</th>
                          {Object.keys(registrations[0].responses).map((field) => (
                            <th key={field} className="px-6 py-4 font-semibold">{field}</th>
                          ))}
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {registrations.map((reg, index) => (
                          <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-mono">{index + 1}</td>
                            {Object.values(reg.responses).map((val, idx) => (
                              <td key={idx} className="px-6 py-4 text-white text-sm whitespace-nowrap">
                                {val}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteRegistration(reg._id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                title="Delete Registration"
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
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default EventRegisteredUsers;
