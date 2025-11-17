import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  XMarkIcon,
  PlusCircleIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "department-admin") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSidenavOpen(false);
    navigate("/login"); // redirect
  };

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, to: "/department-admin" },
    { name: "Add Events", icon: PlusCircleIcon, to: "/department-admin/department-add-event" },
    { name: "Add Events Details", icon: PlusCircleIcon, to: "/department-admin/department-add-event-details" },
    { name: "Event Registered Users", icon: UsersIcon, to: "/department-admin/event-registered-users" },
    { name: "Events", icon: UsersIcon, to: "/department-admin/events" },
    { name: "Event Details", icon: UsersIcon, to: "/department-admin/event-details-list" },

    // Logout (no route)
    { name: "Log out", icon: ArrowRightOnRectangleIcon, logout: true },
  ];

  return (
    <div className="font-poppins h-screen relative">

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidenavOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow"
      >
        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {sidenavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidenavOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-white shadow-xl transform 
        transition-transform duration-300 ease-in-out
        ${sidenavOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 sm:relative sm:flex`}
      >
        <div className="space-y-6 mt-10 px-4 w-full overflow-y-auto">

          {/* Close Button (mobile) */}
          <div className="sm:hidden flex justify-end">
            <button
              onClick={() => setSidenavOpen(false)}
              className="text-gray-700 hover:text-red-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center text-teal-600">
            Department Admin
          </h1>

          {/* Menu */}
          <nav className="flex flex-col space-y-2">
            {menuItems.map(({ name, icon: Icon, to, logout }) =>
              logout ? (
                // 🚨 Logout Button
                <button
                  key={name}
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2 px-2
                    hover:bg-red-500 hover:text-white rounded-md transition duration-150 w-full text-left"
                >
                  <Icon className="w-5 h-5" />
                  Log out
                </button>
              ) : (
                <Link
                  key={name}
                  to={to}
                  onClick={() => setSidenavOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2 px-2
                    hover:bg-teal-500 hover:text-white rounded-md transition duration-150"
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
