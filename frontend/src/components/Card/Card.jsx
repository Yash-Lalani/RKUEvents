import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'; 

const Card = ({
  image,
  name,
  description,
  date,
  time,
  location,
  totalRegistrations,
  departments,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={onClick}
      className="w-full h-[420px] max-w-[400px] rounded-[2rem] overflow-hidden cursor-pointer group relative bg-gray-900 border border-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] isolate"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            className="w-full h-full object-cover"
            src={image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
            alt={name}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-[#0a0a0a] z-10" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-900/80 to-transparent z-10 transition-opacity duration-500" />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 h-full">
        <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex flex-wrap gap-2 max-w-[70%]">
            {departments && departments.map((dept, idx) => (
              <span key={idx} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                {dept}
              </span>
            ))}
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl text-white outline outline-1 outline-white/20">
            <ArrowRightIcon className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>

        <div className="w-full group-hover:translate-y-[-10px] transition-transform duration-500">
          <h2 className="font-extrabold text-3xl text-white mb-2 leading-tight drop-shadow-2xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
            {name}
          </h2>
          <p className="text-sm text-gray-300 mb-6 line-clamp-2 md:line-clamp-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-semibold text-gray-400 w-full mb-2">
            <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400"><CalendarDaysIcon className="w-4 h-4" /></div>
              <span>{date}</span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-400"><ClockIcon className="w-4 h-4" /></div>
              <span>{time}</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="p-1.5 rounded-md bg-pink-500/20 text-pink-400"><MapPinIcon className="w-4 h-4" /></div>
              <span className="truncate">{location}</span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="p-1.5 rounded-md bg-green-500/20 text-green-400"><UserGroupIcon className="w-4 h-4" /></div>
              <span>{totalRegistrations || 0} Regs</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

Card.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  location: PropTypes.string,
  totalRegistrations: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  departments: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};

export default Card;
