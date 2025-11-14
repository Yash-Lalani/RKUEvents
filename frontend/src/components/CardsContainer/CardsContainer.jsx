import React from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'; // Install @heroicons/react if not already

const Card = ({
  image,
  title,
  description,
  date,
  time,
  location,
  registrations,
  buttonText,
  buttonBg = 'bg-purple-600',
  buttonHover = 'hover:bg-purple-700',
  buttonLink = '#',
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
      <img className="h-56 w-full object-cover rounded-t-xl" src={image} alt={title} />

      <div className="p-5 flex flex-col gap-2">
        <h2 className="font-bold text-xl">{title}</h2>
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
            <span>{registrations} registered</span>
          </div>
        </div>

        <div className="mt-4">
          <a
            href={buttonLink}
            className={`text-white px-4 py-2 rounded-md inline-block ${buttonBg} ${buttonHover} transition`}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

const CardsContainer = () => {
  const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=750&q=80',
      title: 'React Conference 2025',
      description: 'Join industry experts for a day of React insights and networking.',
      date: 'August 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'San Francisco, CA',
      registrations: 250,
      buttonText: 'Learn More',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      buttonLink: '/react-conference',
    },
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=750&q=80',
      title: 'JavaScript Meetup',
      description: 'Monthly meetup for JavaScript developers and enthusiasts.',
      date: 'September 5, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'New York, NY',
      registrations: 120,
      buttonText: 'Join Now',
      buttonBg: 'bg-sky-500',
      buttonHover: 'hover:bg-sky-600',
      buttonLink: '/js-meetup',
    },
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=750&q=80',
      title: 'CSS Workshop',
      description: 'Hands-on workshop to master advanced CSS techniques.',
      date: 'October 10, 2025',
      time: '9:00 AM - 12:00 PM',
      location: 'Online',
      registrations: 180,
      buttonText: 'Register',
      buttonBg: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      buttonLink: '/css-workshop',
    },
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=750&q=80',
      title: 'Startup Pitch Night',
      description: 'Pitch your startup ideas to investors and mentors.',
      date: 'November 20, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Austin, TX',
      registrations: 90,
      buttonText: 'Apply Now',
      buttonBg: 'bg-yellow-500',
      buttonHover: 'hover:bg-yellow-600',
      buttonLink: '/pitch-night',
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen w-full py-12 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {cardsData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CardsContainer;
