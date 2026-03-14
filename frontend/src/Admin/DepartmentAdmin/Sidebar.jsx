import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  XMarkIcon,
  PlusCircleIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "department-admin") return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSidenavOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, to: "/department-admin" },
    { name: "Add Events", icon: PlusCircleIcon, to: "/department-admin/department-add-event" },
    { name: "Add Events Details", icon: PlusCircleIcon, to: "/department-admin/department-add-event-details" },
    { name: "Event Registered Users", icon: UsersIcon, to: "/department-admin/event-registered-users" },
    { name: "Events", icon: UsersIcon, to: "/department-admin/events" },
    { name: "Event Details", icon: UsersIcon, to: "/department-admin/event-details-list" },
  ];

  return (
    <>
      <button
        onClick={() => setSidenavOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg text-white border border-white/10 hover:bg-white/10 transition"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {sidenavOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidenavOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-72 glass border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-300 ${
          sidenavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex flex-col gap-1 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-wide">
              Dept Admin
            </h1>
            <button onClick={() => setSidenavOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{user?.department} Department</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 webkit-scrollbar-hide">
          {menuItems.map(({ name, icon: Icon, to }) => {
            const isActive = location.pathname === to || (to !== "/department-admin" && location.pathname.startsWith(to));
            return (
              <Link
                key={name}
                to={to}
                onClick={() => setSidenavOpen(false)}
                className={`flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-xl transition duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-teal-400" : "text-gray-500"}`} />
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-medium text-red-400 py-3 px-4 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent rounded-xl transition w-full text-left"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Log out
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
