import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from '@heroicons/react/24/outline'; 
import Card from "../Card/Card";

const CardsContainer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        let data = await res.json();
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="py-24 px-6 bg-transparent relative z-10 w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight shadow-black drop-shadow-lg"
          >
            Featured Events
          </motion.h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-gray-400 text-lg font-medium tracking-wide">No exciting events available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center w-full">
            {events.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="w-full flex justify-center"
              >
                <Card
                  {...event}
                  onClick={() => navigate(`/event/${event._id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/events")}
            className="group px-10 py-4 rounded-full border-2 border-blue-500/50 hover:border-blue-500 text-blue-400 hover:text-white transition-all font-bold backdrop-blur-md flex items-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] bg-blue-500/10 hover:bg-blue-600"
          >
            Explore All Operations <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CardsContainer;
