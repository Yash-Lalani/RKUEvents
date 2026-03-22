import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Footer from "../../Footer/Footer";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await res.json();
        setEvent(data);

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

      if (!userId) {
        alert("User ID not found, please log in again.");
        return;
      }

      if (event.isPaid && event.price > 0) {
        // --- RAZORPAY PAYMENT FLOW ---
        // 1. Create order
        const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: event.price }),
        });
        
        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          alert("Failed to initialize payment.");
          return;
        }

        // 2. Open Razorpay Checkout Modal
        const options = {
          key: "rzp_test_SR323JD5KLvkO7", // Using the test key directly for frontend
          amount: orderData.amount,
          currency: orderData.currency,
          name: "RKU Events",
          description: `Registration for ${event.name}`,
          order_id: orderData.id,
          handler: async function (response) {
            // 3. Verify Payment
            const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                eventId,
                responses: formData,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              const userEmail = user?.email || user?.user?.email || "your registered email";
              alert(`✅ Registration and Payment successful!\n\nA confirmation email has been sent to:\n${userEmail}\n\nPlease check your inbox (and spam folder).`);
              setShowModal(false);
            } else {
              alert(verifyData.msg || "Payment verification failed.");
            }
          },
          prefill: {
            name: user?.name || user?.user?.name || "Test User",
            email: user?.email || user?.user?.email || "test@example.com",
            contact: "9999999999", // Added dummy Indian phone number to prevent International card errors
          },
          theme: {
            color: "#3B82F6",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // --- FREE EVENT FLOW ---
        const res = await fetch("http://localhost:5000/api/event-registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, eventId, responses: formData }),
        });

        const data = await res.json();

        if (res.ok) {
          const userEmail = user?.email || user?.user?.email || "your registered email";
          alert(`✅ Registration successful!\n\nA confirmation email has been sent to:\n${userEmail}\n\nPlease check your inbox (and spam folder).`);
          setShowModal(false);
        } else {
          alert(data.message || "Registration failed.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      alert("You must be logged in to register.");
      return;
    }

    const userDept = user?.department || user?.user?.department || "";
    const eventDepts = event?.departments || [];

    if (!event.dynamicFields || event.dynamicFields.length === 0) {
      alert("This event has no registration form fields. Registration is disabled.");
      return;
    }

    if (
      !eventDepts.includes("ALL") &&
      !eventDepts.some((d) => d.trim().toUpperCase() === userDept?.trim().toUpperCase())
    ) {
      setErrorMessage(
        `You cannot register. This event is only for ${eventDepts.join(", ")} departments.`
      );
      return;
    }

    setErrorMessage("");
    setShowModal(true);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-grid min-h-screen pt-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-transparent flex flex-col pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pb-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden glass border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-12"
        >
          <img
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
            alt="Event Banner"
            className="w-full h-64 sm:h-80 md:h-[400px] object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-12 flex flex-col justify-end">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.departments?.map((dept, idx) => (
                <span key={idx} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500/30 text-blue-200 border border-blue-500/50 backdrop-blur-md">
                  {dept}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg mb-4">
              {event.name}
            </h1>
            <p className="text-lg text-blue-300 flex items-center gap-2 font-medium">
              <CalendarDaysIcon className="w-6 h-6" />
              {event.date}
            </p>
            {event.isPaid && event.price > 0 && (
              <p className="mt-2 text-2xl font-bold text-green-400 drop-shadow-md">
                ₹{event.price} <span className="text-sm font-medium text-gray-300">/ per ticket</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left / Description */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-6">About the Event</h2>
            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {event.description}
            </p>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3"
              >
                <XMarkIcon className="w-6 h-6" />
                <p className="font-medium">{errorMessage}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="glass rounded-3xl p-6 border border-white/5 border-b-blue-500/30">
              <button
                onClick={handleRegisterClick}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Secure Your Spot
              </button>
            </div>
            <InfoCard icon={<CalendarDaysIcon className="w-7 h-7 text-blue-400" />} label="Date" value={event.date} />
            <InfoCard icon={<ClockIcon className="w-7 h-7 text-purple-400" />} label="Time" value={event.time} />
            <InfoCard icon={<MapPinIcon className="w-7 h-7 text-pink-400" />} label="Location" value={event.location} />
            <InfoCard icon={<UserGroupIcon className="w-7 h-7 text-green-400" />} label="Registered" value={`${event.totalRegistrations || 0} Participants`} />
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-1"
                onClick={() => setShowModal(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Register for <span className="text-blue-400">{event.name}</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {event.dynamicFields?.map((field, idx) => (
                    <div key={idx} className="w-full text-left">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                          value={formData[field.label]}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          required
                        >
                          <option value="" className="bg-gray-900">Select</option>
                          {field.options.map((opt, i) => (
                            <option key={i} value={opt} className="bg-gray-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                          placeholder={`Enter your ${field.label}`}
                          value={formData[field.label]}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          required
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                  >
                    Submit Registration
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-5 border border-white/5 hover:border-white/10 transition-colors">
    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="font-medium text-white text-lg truncate">{value}</p>
    </div>
  </div>
);

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InfoCard.defaultProps = {
  value: "",
};

export default EventDetails;
