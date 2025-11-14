import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // ⚡ for department mismatch error

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await res.json();
        setEvent(data);

        // initialize form state
        const initial = {};
        data.dynamicFields?.forEach((field) => {
          initial[field.label] = "";
        });
        setFormData(initial);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = user?.id || user?.user?.id;
      const eventId = event?._id;

      const res = await fetch(
        "http://localhost:5000/api/event-registrations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, eventId, responses: formData }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        setShowModal(false);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };


  const handleRegisterClick = () => {
    const userDept = user?.department || user?.user?.department; // safe access
    const eventDept = event?.department;

    console.log("User Department:", userDept);
    console.log("Event Department:", eventDept);

    if (
      userDept &&
      eventDept &&
      eventDept !== "All" &&
      userDept.trim().toLowerCase() !== eventDept.trim().toLowerCase()
    ) {
      setErrorMessage(
        `You cannot register. This event is only for ${eventDept} department.`
      );
      return;
    }

    setErrorMessage("");
    setShowModal(true);
  };

  if (!event) {
    return <p className="pt-24 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-4 sm:px-8">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden shadow-lg max-w-6xl mx-auto">
        <img
          src={event.image}
          alt="Event Banner"
          className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 sm:p-10 text-white flex flex-col justify-end">
          <h1 className="text-3xl sm:text-4xl font-bold">{event.name}</h1>
          <p className="text-sm mt-2 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-white" />
            {event.date}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            About the Event
          </h2>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>

          {/* Error message if wrong department */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Register Button */}
          {/* <div className="mt-6">
            <button
              onClick={handleRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Register Now
            </button>
          </div> */}
        </div>

        {/* Right: Info Cards */}
        <div className="space-y-4">
          <InfoCard
            icon={
              <CalendarDaysIcon className="w-6 h-6 text-white bg-blue-600 rounded-full p-1" />
            }
            label=""
            value={
              <button
                onClick={handleRegisterClick}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Register Now
              </button>
            }
          />
          <InfoCard
            icon={<CalendarDaysIcon className="w-6 h-6 text-blue-500" />}
            label="Date"
            value={event.date}
          />
          <InfoCard
            icon={<ClockIcon className="w-6 h-6 text-indigo-500" />}
            label="Time"
            value={event.time}
          />
          <InfoCard
            icon={<MapPinIcon className="w-6 h-6 text-red-500" />}
            label="Location"
            value={event.location}
          />
          <InfoCard
            icon={<UserGroupIcon className="w-6 h-6 text-green-600" />}
            label="Registered"
            value={`${event.totalRegistrations || 0} Participants`}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Register for {event.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {event.dynamicFields?.map((field, idx) => (
                  <div key={idx} className="w-full text-left">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData[field.label]}
                        onChange={(e) =>
                          handleChange(field.label, e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter your ${field.label}`}
                        value={formData[field.label]}
                        onChange={(e) =>
                          handleChange(field.label, e.target.value)
                        }
                        required
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small reusable InfoCard component
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center gap-4">
    {icon}
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default EventDetails;
