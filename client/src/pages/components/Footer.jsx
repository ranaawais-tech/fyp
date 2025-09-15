import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-4 py-10 w-full text-white bg-gradient-to-r from-indigo-900 to-black via-blue-950">
      <div className="grid grid-cols-1 gap-10 mx-auto max-w-7xl md:grid-cols-5">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:col-span-2 md:items-start">
          <Link to="/" className="flex items-center mb-3">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              PAK
            </span>
            <span className="ml-2 text-xl font-bold text-yellow-300">
              WANDERING
            </span>
          </Link>
          <p className="mb-4 max-w-xs text-sm text-center text-gray-300 md:text-left">
            Explore Pakistan and beyond with AI-powered recommendations and
            seamless travel planning.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              className="flex justify-center items-center w-9 h-9 bg-gray-700 rounded-full transition-colors duration-300 hover:bg-blue-600"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-white" />
            </a>
            <a
              href="#"
              className="flex justify-center items-center w-9 h-9 bg-gray-700 rounded-full transition-colors duration-300 hover:bg-sky-400"
              aria-label="Twitter"
            >
              <FaTwitter className="text-white" />
            </a>
            <a
              href="#"
              className="flex justify-center items-center w-9 h-9 bg-gray-700 rounded-full transition-colors duration-300 hover:bg-pink-500"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white" />
            </a>
            <a
              href="#"
              className="flex justify-center items-center w-9 h-9 bg-gray-700 rounded-full transition-colors duration-300 hover:bg-blue-700"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-white" />
            </a>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="mb-2 font-semibold text-white">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-gray-300 transition hover:text-yellow-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 transition hover:text-yellow-300"
            >
              About
            </Link>
            <Link
              to="/search"
              className="text-gray-300 transition hover:text-yellow-300"
            >
              Packages
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 transition hover:text-yellow-300"
            >
              Contact
            </Link>
          </div>
        </div>
        {/* Gallery */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="mb-2 font-semibold text-white">Gallery</h4>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((img) => (
              <div
                key={img}
                className="overflow-hidden w-14 h-14 bg-gray-700 rounded"
              >
                <img
                  src={`/images/gallery/${img}.jpg`}
                  alt={`Gallery ${img}`}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="mb-2 font-semibold text-white">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2 items-start">
              <FiMapPin className="mt-1 text-lg text-blue-400" />
              <span>UET Taxila I Hall </span>
            </li>
            <li className="flex gap-2 items-center">
              <FiPhone className="text-lg text-blue-400" />
              <span>+92 090669948</span>
            </li>
            <li className="flex gap-2 items-center">
              <FiMail className="text-lg text-blue-400" />
              <span>awaisirana02@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="pt-5 mt-10 text-sm text-center text-gray-400 border-t border-gray-700">
        <div className="flex flex-col gap-2 justify-center items-center sm:flex-row">
          <span>
            PakWandering © {new Date().getFullYear()} All Rights Reserved
          </span>
          <span className="hidden sm:inline">|</span>
          <div className="flex gap-3">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </a>
            <span>|</span>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
