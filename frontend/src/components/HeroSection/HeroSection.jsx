import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/event.jpeg'; // Make sure path is correct or use public folder path

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="text-gray-700 body-font pt-24 bg-gray-50">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        
        {/* Text Content */}
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-5xl text-4xl mb-6 font-extrabold text-gray-900">
            Experience the best  <span className="text-blue-600">events</span>{' '} with <br className="hidden lg:inline-block" /> RKUEvents
          </h1>
          <p className="mb-8 leading-relaxed text-lg max-w-xl">
            Join us to discover a vibrant community of exciting events tailored for you. Whether it's workshops, meetups, or exclusive networking, we bring it all to one place.
            <br />
            <br />
            
          </p>

          {/* Buttons */}
          <div className="flex justify-center md:justify-start gap-4">
            <button className="inline-flex text-white bg-indigo-600 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-700 rounded-lg text-lg font-semibold"
            onClick={() => navigate("/events")}
            >
              
              View Events
            </button>
            <button className="inline-flex text-indigo-700 bg-indigo-100 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-200 rounded-lg text-lg font-semibold"
            onClick={() => navigate("/register")}
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded-3xl shadow-lg"
            alt="Hero"
            src={heroImg}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
