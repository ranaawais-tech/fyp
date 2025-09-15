"use client";
import { useState } from "react";

export default function AboutPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* About Section */}
      <section className="flex relative flex-col gap-10 justify-between items-center px-4 py-12 mx-auto mt-20 max-w-7xl rounded-xl border border-gray-300 shadow-md bg-white sm:px-6 sm:py-16 md:flex-row">
        <div className="space-y-8 md:w-1/2">
          <h2 className="px-6 py-3 mb-4 text-3xl font-bold tracking-wide text-indigo-600 uppercase bg-gradient-to-r from-blue-300 to-cyan-300 rounded-lg border-2 border-cyan-400 shadow-md sm:text-4xl">
            About Us
          </h2>

          <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
            Welcome to{" "}
            <span className="font-bold text-indigo-600">PakWandering</span>,
            where technology meets travel to create unforgettable experiences!{" "}
            <span className="text-teal-500">🌍✨</span> We are revolutionizing
            the way people explore Pakistan and beyond with our{" "}
            <span className="font-semibold text-cyan-600">
              AI-powered travel recommendation system
            </span>
            , smart chatbot, and fully customizable trip planner. Whether you're
            a solo backpacker, a luxury traveler, or an adventure enthusiast, we
            tailor your journey to match your unique preferences.{" "}
            <span className="text-coral-500">🌟</span>
          </p>

          {expanded && (
            <div className="p-4 mt-2 text-base leading-relaxed text-gray-700 rounded-lg border border-gray-300 shadow-sm sm:p-6 bg-gray-50">
              <p className="py-2 text-xl font-semibold text-indigo-600">
                Why Choose PakWandering?
              </p>
              <ul className="pl-4 space-y-3 list-disc list-inside">
                <li>
                  <span className="font-semibold text-cyan-600">
                    AI-Powered Personalized Travel:
                  </span>{" "}
                  Get smart recommendations based on your interests, budget, and
                  travel style.
                </li>
                <li>
                  <span className="font-semibold text-cyan-600">
                    24/7 AI Chatbot Assistance:
                  </span>{" "}
                  Instant travel support for bookings, itineraries, and travel
                  queries.
                </li>
                <li>
                  <span className="font-semibold text-cyan-600">
                    Customizable Trips:
                  </span>{" "}
                  Create and adjust your itinerary in real-time.
                </li>
                <li>
                  <span className="font-semibold text-cyan-600">
                    Seamless & Hassle-Free Planning:
                  </span>{" "}
                  No more research stress; our AI does it for you!{" "}
                  <span className="text-teal-500">🚀</span>
                </li>
              </ul>
              <p className="mt-4">
                With{" "}
                <span className="font-bold text-indigo-600">PakWandering</span>,
                you don’t just visit destinations—you experience them in a way
                that feels uniquely yours.{" "}
                <span className="text-coral-500">✈️</span>
              </p>
            </div>
          )}

          <button
            className="px-8 py-2 mt-4 font-semibold text-white bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg shadow-md transition-all duration-300 sm:px-10 sm:py-3 hover:from-cyan-400 hover:to-blue-400 hover:scale-105 hover:shadow-lg"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>
        <div className="flex justify-center mt-10 md:w-1/2 md:mt-0">
          <div className="relative group">
            <img
              src="/images/profile_3.jpeg"
              alt="About Us"
              className="object-cover w-64 h-64 rounded-full border-4 border-teal-400 shadow-lg transition-transform duration-300 sm:w-80 sm:h-80 md:w-96 md:h-96 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-full opacity-20 transition duration-300 group-hover:opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="px-4 mx-auto mt-12 w-full max-w-5xl sm:px-6 sm:mt-16">
        <div className="flex overflow-hidden relative flex-col items-center bg-gray-50 rounded-xl border border-gray-300 shadow-md transition-all duration-500 md:flex-row">
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
          <div className="flex flex-shrink-0 justify-center items-center py-8 w-full md:w-1/3 md:py-0">
            <div className="p-5 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-full shadow-md">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 p-6 sm:p-8 md:pl-0 md:pr-10">
            <h3 className="flex gap-2 items-center mb-3 text-2xl font-bold text-indigo-600 sm:text-3xl">
              Our Mission
            </h3>
            <p className="mb-2 text-base text-gray-700 sm:text-lg">
              To empower travelers with smart, seamless, and personalized
              journeys across Pakistan and beyond, using the latest in AI and
              digital innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="px-4 mx-auto mt-12 w-full max-w-7xl sm:px-6 sm:mt-16">
        <h3 className="mb-8 text-2xl font-bold tracking-wide text-center text-indigo-600 sm:text-3xl">
          Meet the Team
        </h3>
        <div className="flex flex-wrap gap-6 justify-center sm:gap-8">
          {[
            {
              name: "Manazar Butt",
              // role: "Founde & CEO",
              img: "./images/profile_3.jpeg",
            },
            {
              name: "Muhammaad Arslan",
              // role: "Lead Developer",
              img: "./images/profile_1.png",
            },
            {
              name: "Muhammad Awais",
              // role: "Product Designer",
              img: "./images/profile_2.jpg",
            },
            {
              name: "Abdul Ahad",
              // role: "AI Specialist",
              img: "./images/profile_5.jpeg",
            },
          ].map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 w-44 rounded-xl border border-teal-400 shadow-md bg-white transition-all duration-300 sm:p-6 sm:w-56 hover:scale-105 hover:shadow-xl hover:bg-teal-50"
            >
              <img
                src={member.img}
                alt={member.name}
                className="object-cover mb-3 w-20 h-20 rounded-full border-4 border-teal-300 shadow-sm sm:w-24 sm:h-24"
              />
              <h4 className="text-base font-semibold text-indigo-600 sm:text-lg">
                {member.name}
              </h4>
              <span className="text-xs text-gray-600 sm:text-sm">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 mx-auto mt-12 w-full max-w-7xl sm:px-6 sm:mt-16">
        <h3 className="mb-8 text-2xl font-bold tracking-wide text-center text-indigo-600 sm:text-3xl">
          What Our Users Say
        </h3>
        <div className="flex flex-col gap-6 justify-center items-stretch sm:gap-8 md:flex-row">
          {[
            {
              quote:
                "PakWandering made my trip to Hunza unforgettable. The AI recommendations were spot on!",
              name: "Fatima S.",
              img: "https://randomuser.me/api/portraits/women/65.jpg",
            },
            {
              quote:
                "I loved the customizable itinerary and the chatbot was super helpful. Highly recommended!",
              name: "Omar L.",
              img: "https://randomuser.me/api/portraits/men/41.jpg",
            },
            {
              quote:
                "Best travel platform for exploring Pakistan. The team really cares about your experience.",
              name: "Zainab M.",
              img: "https://randomuser.me/api/portraits/women/22.jpg",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 w-full rounded-xl border border-gray-300 shadow-md bg-white transition-all duration-300 sm:p-6 md:w-1/3 hover:scale-105 hover:shadow-xl hover:bg-cyan-50 hover:border-cyan-400"
            >
              <div className="flex gap-3 items-center mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="object-cover w-10 h-10 rounded-full border-2 border-teal-300 sm:w-12 sm:h-12"
                />
                <span className="font-semibold text-indigo-600">{t.name}</span>
              </div>
              <p className="text-sm italic text-center text-gray-700 sm:text-base">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mt-12 w-full bg-gray-50 sm:py-16 sm:mt-16">
        <h3 className="mb-8 text-2xl font-bold tracking-wide text-center text-indigo-600 sm:text-3xl">
          Our Features
        </h3>
        <div className="grid grid-cols-1 gap-6 mx-auto max-w-7xl text-center sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "Mountains",
              img: "/images/mountain.jpg",
              desc: "Climb the mountain not to conquer it, but to find yourself",
            },
            {
              title: "Waterfalls",
              img: "/images/waterfall.jpg",
              desc: "Let the waterfalls refresh your soul and spirit",
            },
            {
              title: "Road Travel",
              img: "/images/road.jpg",
              desc: "Every road leads to a new adventure",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-md bg-white transition-all duration-300 sm:p-8 hover:scale-110 hover:shadow-xl hover:bg-blue-50 hover:border-blue-400"
            >
              <img
                src={item.img}
                alt={item.title}
                className="object-cover mb-4 w-20 h-20 rounded-full border-4 border-teal-300 shadow-sm sm:w-28 sm:h-28"
              />
              <h3 className="mt-2 text-xl font-semibold text-indigo-600 sm:text-2xl">
                {item.title}
              </h3>
              <p className="px-2 mt-2 text-sm text-gray-700 sm:px-4 sm:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
