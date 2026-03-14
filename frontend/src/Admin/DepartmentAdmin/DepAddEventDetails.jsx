import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, TrashIcon, CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DepAddEventDetails = () => {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [dynamicFields, setDynamicFields] = useState([{ label: "", type: "text", options: [] }]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.department) {
      setSelectedDepartment(storedUser.department);
    }
  }, []);

  useEffect(() => {
    if (!selectedDepartment) return;
    fetch(`http://localhost:5000/api/events?department=${selectedDepartment}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, [selectedDepartment]);

  const handleAddField = () => {
    setDynamicFields([...dynamicFields, { label: "", type: "text", options: [] }]);
  };

  const handleRemoveField = (index) => {
    const newFields = [...dynamicFields];
    newFields.splice(index, 1);
    setDynamicFields(newFields);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...dynamicFields];
    newFields[index][key] = value;
    setDynamicFields(newFields);
  };

  const handleSubmit = async () => {
    if (!selectedEvent || !selectedDepartment) {
      alert("Please select department and event");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/event-details/add-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent,
          department: selectedDepartment,
          dynamicFields,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration Schema saved successfully!");
        setStep(1);
        setSelectedEvent("");
        setDynamicFields([{ label: "", type: "text", options: [] }]);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="pb-10 min-h-[80vh] flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white mb-2">Registration Schema</h1>
          <p className="text-gray-400">Configure dynamic registration fields for {selectedDepartment} events.</p>
        </div>

        <div className="glass rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Progress Header */}
          <div className="flex border-b border-white/10 bg-white/5">
            <div className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${step === 1 ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/10' : 'text-gray-500'}`}>
              1. Select Target Event
            </div>
            <div className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${step === 2 ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/10' : 'text-gray-500'}`}>
              2. Design Form Fields
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Target Department</label>
                    <input
                      value={selectedDepartment || "Loading..."}
                      disabled
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Target Event</label>
                    <select
                      value={selectedEvent}
                      onChange={e => setSelectedEvent(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none disabled:opacity-50"
                      disabled={!selectedDepartment}
                    >
                      <option value="" className="bg-gray-900">Select Event</option>
                      {events.map(ev => (
                        <option key={ev._id} value={ev._id} className="bg-gray-900">{ev.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedEvent}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all"
                    >
                      Next Step <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                >
                  <div className="space-y-4 mb-8">
                    {dynamicFields.map((field, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 relative group transition hover:border-teal-500/30">
                        <button
                          onClick={() => handleRemoveField(i)}
                          className="absolute -top-3 -right-3 p-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Field Label (Question)</label>
                            <input
                              type="text"
                              placeholder="e.g. T-Shirt Size"
                              value={field.label}
                              onChange={e => handleFieldChange(i, "label", e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Input Type</label>
                            <select
                              value={field.type}
                              onChange={e => handleFieldChange(i, "type", e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                            >
                              <option value="text" className="bg-gray-900">Short Text</option>
                              <option value="number" className="bg-gray-900">Number</option>
                              <option value="email" className="bg-gray-900">Email Address</option>
                              <option value="select" className="bg-gray-900">Dropdown (Select)</option>
                            </select>
                          </div>
                        </div>

                        {field.type === "select" && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Dropdown Options (Comma separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. Small, Medium, Large"
                              value={field.options.join(",")}
                              onChange={e => handleFieldChange(i, "options", e.target.value.split(","))}
                              className="w-full bg-black/40 border border-teal-500/30 rounded-lg px-3 py-2.5 text-teal-200 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/10 gap-4">
                    <button
                      onClick={handleAddField}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 font-medium transition w-full sm:w-auto justify-center"
                    >
                      <PlusIcon className="w-5 h-5" /> Add Form Field
                    </button>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition w-full sm:w-auto"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full sm:w-auto justify-center transition"
                      >
                        <CheckCircleIcon className="w-5 h-5" /> Save Schema
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepAddEventDetails;
