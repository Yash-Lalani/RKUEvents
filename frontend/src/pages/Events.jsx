import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Card = ({
  image,
  name,
  description,
  date,
  time,
  location,
  totalRegistrations,
  buttonText,
  buttonBg = "bg-purple-600",
  buttonHover = "hover:bg-purple-700",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full max-w-md bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
    >
      <img
        className="h-56 w-full object-cover rounded-t-xl"
        src={image}
        alt={name}
      />

      <div className="p-5 flex flex-col gap-2">
        <h2 className="font-bold text-xl">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="text-sm text-gray-700 mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-indigo-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-red-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-green-600" />
            <span>{totalRegistrations} registered</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            className={`text-white px-4 py-2 rounded-md inline-block ${buttonBg} ${buttonHover} transition`}
          >
            {buttonText || "Learn More"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="pt-24 px-6 pb-12 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">
        Upcoming Events
      </h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {events.map((event) => (
            <Card
              key={event._id}
              {...event}
              onClick={() => navigate(`/event/${event._id}`)}
            />
          ))}
          
        </div>
      )}
    </div>
  );
};

export default Events;
