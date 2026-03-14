import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DepartmentEditEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);

  // Load event details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/event-details/detail/${id}`
        );
        const data = await res.json();

        const detail = Array.isArray(data) ? data[0] : data;
        if (detail) {
          setSelectedDepartment(detail.department);
          setSelectedEvent(detail.eventId?._id || detail.eventId);
          setDynamicFields(detail.dynamicFields || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Load events for selected department
  useEffect(() => {
    if (!selectedDepartment) return;

    fetch(`http://localhost:5000/api/events?department=${selectedDepartment}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, [selectedDepartment]);

  // Handle field changes
  const handleFieldChange = (index, key, value) => {
    const updated = [...dynamicFields];
    updated[index][key] = value;
    setDynamicFields(updated);
  };

  const handleAddField = () => {
    setDynamicFields([
      ...dynamicFields,
      { label: "", type: "text", options: [] },
    ]);
  };

  const handleDeleteField = (i) => {
    setDynamicFields(dynamicFields.filter((_, idx) => idx !== i));
  };

  // Save
  const handleSave = async () => {
    if (!selectedEvent || !selectedDepartment) {
      alert("Please select department and event");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/event-details/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent,
            department: selectedDepartment,
            dynamicFields,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Event details updated successfully!");
        navigate("/department-admin/event-details-list");
      } else {
        alert(data.msg || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4">Edit Event Details</h2>

      {/* Department */}
      <select
        value={selectedDepartment}
        disabled
        className="w-full border p-2 rounded mb-4 bg-gray-100 cursor-not-allowed"
      >
        <option value={selectedDepartment}>{selectedDepartment}</option>
      </select>

      {/* Event */}
      <select
        value={selectedEvent}
        disabled
        className="w-full border p-2 rounded mb-4 bg-gray-100 cursor-not-allowed"
      >
        {events.length > 0 && (
          <option value={selectedEvent}>
            {events.find((ev) => ev._id === selectedEvent)?.name ||
              "Selected Event"}
          </option>
        )}
      </select>

      {/* Dynamic Fields */}
      <h3 className="text-lg font-semibold mb-2">Edit Registration Fields</h3>

      {dynamicFields.map((field, i) => (
        <div
          key={i}
          className="mb-4 border p-3 rounded bg-gray-50 shadow-sm"
        >
          <input
            type="text"
            placeholder="Field Label"
            value={field.label}
            onChange={(e) =>
              handleFieldChange(i, "label", e.target.value)
            }
            className="border p-2 rounded mb-2 w-full"
          />

          <select
            value={field.type}
            onChange={(e) =>
              handleFieldChange(i, "type", e.target.value)
            }
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
              value={field.options?.join(",") || ""}
              onChange={(e) =>
                handleFieldChange(i, "options", e.target.value.split(","))
              }
              className="border p-2 rounded w-full mt-2"
            />
          )}

          {/* Delete button */}
          <button
            onClick={() => handleDeleteField(i)}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}

      {/* Buttons */}
      <button
        onClick={handleAddField}
        className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
      >
        Add Field
      </button>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default DepartmentEditEventDetails;
