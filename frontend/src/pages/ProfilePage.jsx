import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Footer/Footer";
import { 
  UserIcon, 
  CalendarDaysIcon, 
  KeyIcon,
  MapPinIcon,
 
} from "@heroicons/react/24/outline";

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
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-400 text-xl font-semibold">
        {error}
      </div>
    );

  const tabs = [
    { id: "profile", label: "Identity", icon: UserIcon },
    { id: "events", label: "Registrations", icon: CalendarDaysIcon },
    { id: "change-password", label: "Security", icon: KeyIcon },
  ];

  return (
    <div className="min-h-screen bg-black bg-grid text-white relative flex flex-col pt-24 pb-0">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 relative z-10 mb-20">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
            Command Center
          </h1>
          <p className="text-gray-400 text-lg">Manage your identity, security, and event participation.</p>
        </div>

        {/* Main Interface Block */}
        <div className="glass rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 p-2 gap-2 bg-white/5 webkit-scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8 md:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* Profile Info */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col md:flex-row gap-12 items-center"
                >
                  {/* Holographic Avatar */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="w-40 h-40 relative rounded-full bg-gray-900 border-2 border-white/20 flex items-center justify-center text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400 shadow-2xl">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Data Grid */}
                  <div className="flex-1 w-full bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Identification</h3>
                    <div className="space-y-5">
                      <InfoItem label="Full Name" value={userData?.name} />
                      <InfoItem label="Comm Link (Email)" value={userData?.email} />
                      <InfoItem label="Sector (Department)" value={userData?.department} />
                      <InfoItem label="Clearance (Role)" value={userData?.role} highlight />
                      <InfoItem label="Designation No." value={userData?.enrollmentNumber} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Registered Events */}
              {activeTab === "events" && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                >
                  {registeredEvents.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl bg-white/5">
                      <CalendarDaysIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400 text-lg">No event authorizations detected on your profile.</p>
                      <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition">
                        Browse Events
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {registeredEvents.map((reg, idx) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={reg._id}
                          className="group relative p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                          
                          <h3 className="text-xl font-black text-white mb-4 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-colors">
                            {reg.eventId?.name || "Unnamed Event"}
                          </h3>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                              <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400"><CalendarDaysIcon className="w-4 h-4" /></div>
                              <span className="font-medium text-blue-100">{reg.eventId?.date || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                              <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400"><MapPinIcon className="w-4 h-4" /></div>
                              <span className="font-medium">{reg.eventId?.location || "N/A"}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {reg.eventId?.description ? reg.eventId.description : "No briefing provided for this operation."}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Change Password */}
              {activeTab === "change-password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="max-w-md mx-auto"
                >
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <KeyIcon className="w-32 h-32" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 text-white">Encryption Key Update</h2>
                    <p className="text-sm text-gray-400 mb-8">Ensure your new password meets standard security protocols.</p>
                    
                    <ChangePasswordForm userId={userData?._id} />
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

/* -------------------- Change Password Form Component -------------------- */
const ChangePasswordForm = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg("❌ New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/profile/change-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      const data = await res.json();
      
      if (res.ok) {
        setMsg("✅ " + data.msg);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg("❌ " + data.msg);
      }
    } catch (err) {
      console.error("Password change error:", err);
      setMsg("❌ Network intrusion detected (Server Error)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="space-y-5 relative z-10">
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Current Key</label>
        <input
          type="password"
          value={oldPassword}
          required
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition placeholder-gray-600"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">New Key</label>
        <input
          type="password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition placeholder-gray-600"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Verify New Key</label>
        <input
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition placeholder-gray-600"
          placeholder="••••••••"
        />
      </div>

      {msg && (
        <motion.p initial={{opacity:0}} animate={{opacity:1}} className={`text-sm font-medium p-3 rounded-lg border ${msg.includes('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {msg}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-500 hover:to-purple-500 font-medium transition shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Deploy Update"}
      </button>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  userId: PropTypes.string,
};

ChangePasswordForm.defaultProps = {
  userId: null,
};

/* -------------------- Info Item -------------------- */
const InfoItem = ({ label, value, highlight }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 border-b border-white/5 last:border-0 last:pb-0">
    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider w-1/3">
      {label}
    </span>
    <span className={`text-base font-medium flex-1 text-right sm:text-left ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-extrabold uppercase' : 'text-gray-200'}`}>
      {value || "CLASSIFIED"}
    </span>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  highlight: PropTypes.bool,
};

InfoItem.defaultProps = {
  value: null,
  highlight: false,
};

export default ProfilePage;
