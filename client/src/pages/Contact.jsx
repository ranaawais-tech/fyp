import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setStatusMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setStatus(data.status);
      setStatusMessage(data.message);
      if (data.status === "success") {
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => {
          setStatus(null);
          setStatusMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message || error);
      setStatus("error");
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch")
      ) {
        setStatusMessage(
          "Unable to connect to the server. Please try again later."
        );
      } else {
        setStatusMessage(
          error.message || "Failed to send message, please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pt-24 pb-10 w-full min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <section className="flex flex-col gap-12 p-4 w-full max-w-6xl rounded-2xl border border-gray-300 shadow-xl bg-white sm:p-8 lg:p-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 sm:text-5xl tracking-tight">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mt-3">
            Planning your next adventure? We're here to help you every step of
            the way.
          </p>
        </div>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex flex-col flex-1 gap-8 p-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-md">
            <ul className="space-y-4 text-gray-700 text-base">
              <li className="flex items-center gap-3">
                <FiMapPin className="text-xl text-cyan-600" />
                <span>University of Engineering and Technology Taxila</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-xl text-teal-600" />
                <span>+92 309 0669948</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-xl text-pink-600" />
                <span>manazarrasheed5@gmail.com</span>
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all"
                  >
                    <Icon className="text-gray-600 text-lg" />
                  </a>
                )
              )}
            </div>
          </div>

          <div className="flex flex-1">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md w-full"
            >
              <h3 className="text-xl font-bold text-cyan-700">
                Drop Us a Message
              </h3>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                disabled={isLoading}
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 resize-none disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="py-3 w-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-transform transform hover:scale-105 disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  className={`text-center font-medium text-sm mt-2 ${
                    status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md mt-10 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Ready for Inspiration?
          </h3>
          <p className="text-gray-600 text-base max-w-xl mx-auto mb-4">
            Discover handpicked travel destinations tailored for every type of
            traveler.
          </p>
          <a
            href="/search"
            className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full hover:from-cyan-600 hover:to-teal-600 transition-transform transform hover:scale-105"
          >
            Explore Destinations
          </a>
        </div>

        <div className="mt-12">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-4">
            Visit Us
          </h3>
          <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=Islamabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
