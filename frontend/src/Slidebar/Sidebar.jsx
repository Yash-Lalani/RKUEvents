import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  XMarkIcon,
   PlusCircleIcon,
  UserPlusIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [sidenavOpen, setSidenavOpen] = useState(false);
   const navigate = useNavigate();
   const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login
    navigate("/login");
  };
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "Add Events", icon: PlusCircleIcon },
    { name: "Add Events Details", icon: PlusCircleIcon },
  { name: "Add Department Admin", icon: UserPlusIcon },
  { name: "Event Registered Users", icon: UsersIcon },
  { name: "Events", icon: UsersIcon },
  { name: "Event Details", icon: UsersIcon },
  { name: "Log out", icon: ArrowRightOnRectangleIcon },
   
   
  ];
  

  


  return (
    <div className="font-poppins relative">

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidenavOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
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
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidenavOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative sm:flex`}
      >
        <div className="space-y-6 mt-10 px-4 w-full overflow-y-auto">
          {/* Close Button (mobile only) */}
          <div className="sm:hidden flex justify-end">
            <button
              onClick={() => setSidenavOpen(false)}
              className="text-gray-700 hover:text-red-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center text-teal-600">
            SuperAdmin
          </h1>

          {/* Search */}
          <div className="flex border-2 border-gray-200 rounded-md focus-within:ring-2 ring-teal-500">
            <input
              type="text"
              className="w-full px-2 py-2 text-sm text-gray-600 focus:outline-none rounded-l-md"
              placeholder="Search"
            />
            <button className="px-2 py-2 hidden md:block">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 
                     4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col space-y-2">
  {menuItems.map(({ name, icon: Icon }) => {
    // Determine the correct route for each menu item
    let to = "#"; 
    if (name === "Add Events") to = "/super-admin/add-event";
    else if (name === "Add Events Details") to = "/super-admin/add-event-details";
    else if (name === "Dashboard") to = "/super-admin";

    else if (name === "Add Department Admin") to = "/super-admin/add-department-admin";
    else if (name === "Events") to = "/super-admin/events";
    else if (name === "Add Events Details") to = "/super-admin/event-details";
    else if (name === "Event Details") to = "/super-admin/event-details-list";


    else if (name === "Event Registered Users") to = "/super-admin/event-registered-users";

     if (name === "Log out") {
                return (
                  <button
                    key={name}
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2 px-2 hover:bg-red-500 hover:text-white rounded-md transition duration-150 w-full text-left"
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </button>
                );
              }

    return (
      <Link
        key={name}
        to={to}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition duration-150"
      >
        <Icon className="w-5 h-5" />
        {name}
      </Link>
    );
  })}
</nav>

        </div>
      </div>

      {/* Main content placeholder */}
      {/* <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          This is the main content area. Resize the screen to see responsive behavior.
        </p>
      </main> */}
    </div>
  );
};

export default Sidebar;
