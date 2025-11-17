import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

const DepartmentEventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Read logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      let url = "http://localhost:5000/api/events";

      // If this is department admin → load only their department events
      if (user?.role === "department-admin") {
        const dept = user.department || user.dept || "";
        url += `?department=${encodeURIComponent(dept)}`;
      }

      const res = await axios.get(url);
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await axios.delete(`http://localhost:5000/api/events/${id}`);
    fetchEvents();
  };

  const updateEvent = async () => {
    await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, {
      name: selectedEvent.name,
      description: selectedEvent.description,
      date: selectedEvent.date,
      department: selectedEvent.department,
      time: selectedEvent.time,
      location: selectedEvent.location,
      image: selectedEvent.image,
    });

    setSelectedEvent(null);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-teal-600 mb-6">
        {user?.role === "department-admin"
          ? `${user.department} Department Events`
          : "All Events"}
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date</th>
              <th className="p-3">Registrations</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="odd:bg-gray-100">
                <td className="p-3">{event.name}</td>
                <td className="p-3">{event.department}</td>
                <td className="p-3">{event.date}</td>
                <td className="p-3">{event.totalRegistrations}</td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="w-6" />
                  </button>

                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT POPUP */}
      {selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-[450px] relative">

      {/* Close button */}
      <button
        onClick={() => setSelectedEvent(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <XMarkIcon className="w-6" />
      </button>

      <h2 className="text-xl font-bold mb-4 text-teal-600">
        Edit Event
      </h2>

      {/* Name */}
      <label className="block font-medium">Name</label>
      <input
        className="w-full border p-2 rounded mb-3"
        value={selectedEvent.name}
        onChange={(e) =>
          setSelectedEvent({ ...selectedEvent, name: e.target.value })
        }
      />

      {/* Description */}
      <label className="block font-medium">Description</label>
      <textarea
        className="w-full border p-2 rounded mb-3"
        rows={2}
        value={selectedEvent.description}
        onChange={(e) =>
          setSelectedEvent({
            ...selectedEvent,
            description: e.target.value,
          })
        }
      />

      {/* Department */}
      <label className="block font-medium">Department</label>
      <select
        className="w-full border p-2 rounded mb-3"
        value={selectedEvent.department}
        onChange={(e) =>
          setSelectedEvent({
            ...selectedEvent,
            department: e.target.value,
          })
        }
      >
        <option>SOE</option>
        <option>SOS</option>
        <option>SOM</option>
        <option>LAW</option>
        <option>PHARMACY</option>
      </select>

      {/* Date */}
      <label className="block font-medium">Date</label>
      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        value={selectedEvent.date}
        onChange={(e) =>
          setSelectedEvent({ ...selectedEvent, date: e.target.value })
        }
      />

      {/* Time */}
      <label className="block font-medium">Time</label>
      <input
        type="time"
        className="w-full border p-2 rounded mb-3"
        value={selectedEvent.time}
        onChange={(e) =>
          setSelectedEvent({ ...selectedEvent, time: e.target.value })
        }
      />

      {/* Location */}
      <label className="block font-medium">Location</label>
      <input
        className="w-full border p-2 rounded mb-3"
        value={selectedEvent.location}
        onChange={(e) =>
          setSelectedEvent({
            ...selectedEvent,
            location: e.target.value,
          })
        }
      />

      {/* Image URL */}
      <label className="block font-medium">Image URL</label>
      <input
        className="w-full border p-2 rounded mb-6"
        value={selectedEvent.image}
        onChange={(e) =>
          setSelectedEvent({ ...selectedEvent, image: e.target.value })
        }
      />

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSelectedEvent(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={updateEvent}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default DepartmentEventsList;
