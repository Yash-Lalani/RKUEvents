import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const EventRegisteredDepartmentUsers = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // read logged-in user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // Fetch events — only events for the department if user is a department-admin
 useEffect(() => {
  setLoading(true);
  setErr("");

  const fetchEvents = async () => {
    try {
      let url = "http://localhost:5000/api/events";

      if (user?.role === "department-admin") {
        const dept = user?.department || "";
        url += `?department=${encodeURIComponent(dept)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);

      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      setErr("Could not load events. Try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);   // <-- FIXED


  // Fetch registrations for selected event
  const loadRegistrations = (eventId) => {
    setSelectedEvent(eventId);
    setRegistrations([]);
    fetch(`http://localhost:5000/api/super-admin/events/${eventId}/registrations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch registrations");
        return res.json();
      })
      .then((data) => setRegistrations(data))
      .catch((err) => {
        console.error(err);
        setErr("Could not load registrations.");
      });
  };

  // Download CSV
  const downloadCSV = () => {
    if (registrations.length === 0) return;

    const headers = ["Name", "Email", ...Object.keys(registrations[0].responses || {})];
    const rows = registrations.map((reg) => [
      reg.userId?.name || "N/A",
      reg.userId?.email || "N/A",
      ...Object.values(reg.responses || {}),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Excel
  const downloadExcel = () => {
    if (registrations.length === 0) return;

    const data = registrations.map((reg) => ({
      Name: reg.userId?.name || "N/A",
      Email: reg.userId?.email || "N/A",
      ...reg.responses,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "registrations.xlsx");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-center py-20 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-center py-6 text-red-500">{err}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 mt-15">Event Registered Users</h2>

      {/* Show Events */}
      {!selectedEvent && (
        <>
          {events.length === 0 ? (
            <p className="text-gray-500">No events available for your department.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition"
                  onClick={() => loadRegistrations(event._id)}
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {event.date} | {event.time}
                    </p>
                    <p className="text-xs text-gray-500">Department: {event.department}</p>
                    <p className="text-xs text-gray-500">Location: {event.location}</p>
                    <p className="text-xs text-teal-600 font-medium mt-1">
                      Total Registrations: {event.totalRegistrations ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Show Registrations */}
      {selectedEvent && (
        <div className="mt-6">
          <button
            className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => {
              setSelectedEvent(null);
              setRegistrations([]);
            }}
          >
            ← Back to Events
          </button>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Registered Users</h3>
            <div className="flex gap-2">
              <button
                onClick={downloadCSV}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download CSV
              </button>
              <button
                onClick={downloadExcel}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download Excel
              </button>
            </div>
          </div>

          {registrations.length === 0 ? (
            <p>No users registered for this event.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    {registrations[0] &&
                      Object.keys(registrations[0].responses || {}).map((field) => (
                        <th key={field} className="border p-2">
                          {field}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg._id}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{reg.userId?.name || "N/A"}</td>
                      <td className="border p-2">{reg.userId?.email || "N/A"}</td>
                      {Object.values(reg.responses || {}).map((val, idx) => (
                        <td key={idx} className="border p-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventRegisteredDepartmentUsers;
