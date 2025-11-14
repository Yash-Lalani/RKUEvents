import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User object from localStorage:", user);

    const userId = user?._id || user?.id;
    if (!userId) {
      setError("No user found. Please log in again.");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`http://localhost:5000/api/profile/user/${userId}`),
      fetch(`http://localhost:5000/api/profile/registered-events/${userId}`),
    ])
      .then(async ([userRes, eventsRes]) => {
        if (!userRes.ok || !eventsRes.ok)
          throw new Error("Failed to fetch data");

        const userData = await userRes.json();
        const eventsData = await eventsRes.json();

        setUserData(userData);
        setRegisteredEvents(eventsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-24 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        My Profile
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-medium text-lg border-b-4 transition-all duration-300 ${
            activeTab === "profile"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-3 font-medium text-lg border-b-4 transition-all duration-300 ${
            activeTab === "events"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Registered Events
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "profile" && (
        <div className="animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Name:</span>{" "}
                {userData?.name}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {userData?.email}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Department:</span>{" "}
                {userData?.department}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Role:</span>{" "}
                {userData?.role}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">
                  Enrollment No:
                </span>{" "}
                {userData?.enrollmentNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registered Events Tab */}
      {activeTab === "events" && (
        <div className="animate-fadeIn">
          {registeredEvents.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven’t registered for any events yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registeredEvents.map((reg) => (
                <div
                  key={reg._id}
                  className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="text-xl font-semibold text-blue-600">
                    {reg.eventId?.name || "Unnamed Event"}
                  </h3>
                  <p className="text-gray-700 mt-1">
                    <strong>Date:</strong> {reg.eventId?.date || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Venue:</strong> {reg.eventId?.venue || "N/A"}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm">
                    {reg.eventId?.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
