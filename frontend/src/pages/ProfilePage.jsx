import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
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
      <div className="flex justify-center items-center h-screen text-xl font-semibold animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );

    const getFirstThreeWords = (text = "") => {
  return text.split(" ").slice(0, 3).join(" ") + "...";
};


  return (
    <div className="max-w-5xl mx-auto mt-24 mb-16 px-6">
      {/* Main Card */}
      <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          My Profile
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-gray-100 p-2 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === "events"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Registered Events
            </button>
          </div>
        </div>

        {/* Profile Info */}
        {activeTab === "profile" && (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Avatar */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-5xl font-bold shadow-lg">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-md">

  <div className="space-y-1">
    <InfoItem label="Name" value={userData?.name} />
    <InfoItem label="Email" value={userData?.email} />
    <InfoItem label="Department" value={userData?.department} />
    <InfoItem label="Role" value={userData?.role} />
    <InfoItem label="Enrollment No" value={userData?.enrollmentNumber} />
  </div>

</div>

            </div>
          </div>
        )}

        {/* Registered Events */}
        {activeTab === "events" && (
          <div className="animate-fadeIn">
            {registeredEvents.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                You haven’t registered for any events yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {registeredEvents.map((reg) => (
                  <div
                    key={reg._id}
                    className="p-6 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:scale-[1.02] transition-all"
                  >
                    <h3 className="text-2xl font-semibold text-blue-600">
                      {reg.eventId?.name || "Unnamed Event"}
                    </h3>

                    <p className="text-gray-700 mt-2">
                      <strong>Date:</strong> {reg.eventId?.date || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Venue:</strong> {reg.eventId?.location || "N/A"}
                    </p>

                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
  {reg.eventId?.description
    ? getFirstThreeWords(reg.eventId.description)
    : "No description available."}
</p>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 items-center py-2">
    <span className="font-semibold text-gray-700 text-right">{label}:</span>
    <span className="text-gray-900 col-span-2 md:col-span-3">{value}</span>
  </div>
);


export default ProfilePage;
