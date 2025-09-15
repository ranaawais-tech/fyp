import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";
import { FaComments } from "react-icons/fa";
// import { MessageCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=packageRating&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [topPackages]);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [latestPackages]);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&offer=true&limit=6"
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [offerPackages]);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        {/* Hero Section */}
        <div className="relative h-screen w-full">
          <div className="backaground_image absolute inset-0 w-full h-full"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative h-full flex flex-col items-center justify-center px-4 space-y-8 pt-16">
            <div className="text-center space-y-4 animate-fadeIn">
              <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
                The Travel
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Make Your Travel Dream Come True With Our Amazing Packages
              </p>
            </div>
            {/* Search Section */}
            <div className="w-full max-w-2xl mx-auto space-y-6">
              <div className="flex gap-2 justify-center">
                <div className="relative flex-1 max-w-lg">
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Where do you want to go?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70" />
                </div>
                <button
                  onClick={() => navigate(`/search?searchTerm=${search}`)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Search
                </button>
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => navigate("/search?offer=true")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300"
                >
                  <LuBadgePercent className="text-xl" />
                  <span>Best Offers</span>
                </button>
                <button
                  onClick={() => navigate("/search?sort=packageRating")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300"
                >
                  <FaStar className="text-xl" />
                  <span>Top Rated</span>
                </button>
                <button
                  onClick={() => navigate("/search?sort=createdAt")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300"
                >
                  <FaCalendar className="text-xl" />
                  <span>Latest</span>
                </button>
                <button
                  onClick={() => navigate("/search?sort=packageTotalRatings")}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all duration-300"
                >
                  <FaRankingStar className="text-xl" />
                  <span>Most Rated</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/chatbot`)}
              className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center animate-pulse"
            >
              <FaComments size={24} />
            </button>
          </div>
        </div>

        {/* Packages Sections */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading &&
            topPackages.length === 0 &&
            latestPackages.length === 0 &&
            offerPackages.length === 0 && (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-600">
                  No Packages Available Yet!
                </h2>
                <p className="text-gray-500 mt-2">
                  Please check back later for exciting travel packages.
                </p>
              </div>
            )}

          {/* Top Rated Packages */}
          {!loading && topPackages.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  Top Packages
                </h2>
                <button
                  onClick={() => navigate("/search?sort=packageRating")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {topPackages.map((packageData, i) => (
                  <PackageCard key={i} packageData={packageData} />
                ))}
              </div>
            </section>
          )}

          {/* Latest Packages */}
          {!loading && latestPackages.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  Latest Packages
                </h2>
                <button
                  onClick={() => navigate("/search?sort=createdAt")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {latestPackages.map((packageData, i) => (
                  <PackageCard key={i} packageData={packageData} />
                ))}
              </div>
            </section>
          )}

          {/* Offer Packages */}
          {!loading && offerPackages.length > 0 && (
            <section className="space-y-8">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="offers_img w-full h-[300px]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="p-8 md:p-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Special Offers
                    </h2>
                    <p className="text-gray-200 max-w-lg">
                      Discover amazing deals on our best travel packages.
                      Limited time offers available!
                    </p>
                    <button
                      onClick={() => navigate("/search?offer=true")}
                      className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300"
                    >
                      View All Offers
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-8">
                {offerPackages.map((packageData, i) => (
                  <PackageCard key={i} packageData={packageData} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
