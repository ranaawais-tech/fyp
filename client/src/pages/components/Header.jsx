import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // <-- ADD useLocation
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // <-- GET current route

  // Check if the current route is home
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 90);
    };

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrolled(true); // Always solid background on other pages
    }
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled && isHome
          ? "bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 shadow-md"
          : !isHome
          ? "bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-transform duration-300 group hover:scale-105"
        >
          <h1 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            PAK
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
            <span className="ml-2 text-xl font-bold text-yellow-300 sm:text-2xl">
              WANDERING
            </span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center space-x-20 md:flex">
          {[
            { name: "Home", to: "/" },
            { name: "Packages", to: "/search" },
            { name: "About", to: "/about" },
            { name: "Contact", to: "/contact" },
            { name: "Trip With AI", to: "/airecommendation" },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <Link
                to={item.to}
                className="py-2 text-2xl font-semibold text-white transition-colors duration-300 hover:text-yellow-300"
              >
                {item.name}
              </Link>
              <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </div>
          ))}
        </nav>

        {/* Profile or Login */}
        <div className="flex gap-4 items-center ml-4">
          {currentUser ? (
            <Link
              to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
              className="group"
              aria-label="Profile"
            >
              <img
                // src={currentUser.avatar || defaultProfileImg}
                src="../images/profile_3.jpeg"
                alt={currentUser.username}
                className="object-cover w-10 h-10 rounded-full border-2 border-yellow-300 shadow-md transition-transform duration-300 hover:scale-110"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 font-semibold text-indigo-900 bg-yellow-300 rounded-full shadow-md transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="px-6 pb-2 space-x-4 text-center md:hidden">
        {["Home", "Packages", "About", "Contact"].map((name, i) => (
          <Link
            key={i}
            to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
            className="text-sm font-semibold text-white transition-colors duration-300 hover:text-yellow-300"
          >
            {name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
