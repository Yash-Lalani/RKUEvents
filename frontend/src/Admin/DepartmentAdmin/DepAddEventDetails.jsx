import React, { useState, useEffect } from "react";

const DepAddEventDetails = () => {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [dynamicFields, setDynamicFields] = useState([{ label: "", type: "text", options: [] }]);

  // ✅ Load department directly from localStorage (department admin info)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.department) {
      setSelectedDepartment(storedUser.department);
    }
  }, []);

  // ✅ Fetch events for this department
  useEffect(() => {
  if (!selectedDepartment) return;
  fetch(`http://localhost:5000/api/events?department=${selectedDepartment}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched events:", data); // 👀 log here
      setEvents(data);
    })
    .catch((err) => console.error(err));
}, [selectedDepartment]);


  const handleAddField = () => {
    setDynamicFields([...dynamicFields, { label: "", type: "text", options: [] }]);
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
      if (res.ok) alert("Event details added successfully!");
      else alert(data.error || "Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-6">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select Department & Event</h2>

          {/* ✅ Show fixed department dropdown (unchangeable) */}
          <select
            value={selectedDepartment}
            disabled
            className="w-full border p-2 rounded mb-4 bg-gray-100 text-gray-700"
          >
            <option value="">{selectedDepartment || "Loading..."}</option>
          </select>

          {/* ✅ Event dropdown now works */}
         <select
  value={selectedEvent}
  onChange={(e) => setSelectedEvent(e.target.value)}
  className="w-full border p-2 rounded mb-4"
  disabled={!selectedDepartment}
>
  <option value="">Select Event</option>
  {events.map((ev) => (
    <option key={ev._id} value={ev._id}>
      {ev.name} {/* 👈 show event name */}
    </option>
  ))}
</select>


          <button
            onClick={() => setStep(2)}
            disabled={!selectedEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Add Dynamic Registration Fields</h2>

          {dynamicFields.map((field, i) => (
            <div key={i} className="mb-4">
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => handleFieldChange(i, "label", e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(i, "type", e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="select">Select</option>
              </select>

              {field.type === "select" && (
                <input
                  type="text"
                  placeholder="Options comma separated"
                  value={field.options.join(",")}
                  onChange={(e) => handleFieldChange(i, "options", e.target.value.split(","))}
                  className="border p-2 rounded w-full mt-2"
                />
              )}
            </div>
          ))}

          <button
            onClick={handleAddField}
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Add Field
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default DepAddEventDetails;
