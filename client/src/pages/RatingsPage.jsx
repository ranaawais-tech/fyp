import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingCard from "./RatingCard";
import {
  FaStar,
  FaArrowLeft,
  FaThumbsUp,
  FaComment,
  FaImage,
} from "react-icons/fa";

const RatingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [packageRatings, setPackageRatings] = useState([]);
  const [showRatingStars, setShowRatingStars] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  const getRatings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/rating/get-ratings/${params.id}/999999999999`
      );
      const res2 = await fetch(`/api/rating/average-rating/${params.id}`);
      const data = await res.json();
      const data2 = await res2.json();
      if (data && data2) {
        setPackageRatings(data);
        setShowRatingStars(data2.rating);
        setTotalRatings(data2.totalRatings);

        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach((rating) => {
          stats[Math.round(rating.rating)]++;
        });
        setRatingStats(stats);

        setLoading(false);
      } else {
        setPackageRatings(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getRatings();
  }, [params.id]);

  const getRatingPercentage = (count) => {
    return totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
  };

  const getFilteredAndSortedRatings = () => {
    if (!packageRatings || !Array.isArray(packageRatings)) return [];

    let filtered = [...packageRatings];

    // Apply rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (rating) => Math.round(rating.rating) === parseInt(filterRating)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  const getRatingStats = () => {
    const withPhotos =
      packageRatings?.filter((r) => r.images?.length > 0).length || 0;
    const withComments =
      packageRatings?.filter((r) => r.review?.length > 0).length || 0;
    return { withPhotos, withComments };
  };

  const stats = getRatingStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : !packageRatings ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center">
              <FaStar className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No Ratings Yet
            </h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">
              Be the first to share your experience with this package!
            </p>
            <button
              onClick={() => navigate(`/package/${params?.id}`)}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(`/package/${params?.id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Package</span>
              </button>
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
                <FaStar className="w-4 h-4" />
                Write a Review
              </button>
            </div>

            {/* Rating Summary */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Overall Rating */}
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Customer Reviews
                    </h2>
                    <div className="mt-6 flex flex-col items-center md:items-start">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-bold text-gray-900">
                          {showRatingStars.toFixed(1)}
                        </span>
                        <div>
                          <Rating
                            size="large"
                            value={showRatingStars || 0}
                            readOnly
                            precision={0.1}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {totalRatings} total ratings
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaImage className="w-4 h-4 text-gray-400" />
                          <span>{stats.withPhotos} with photos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaComment className="w-4 h-4 text-gray-400" />
                          <span>{stats.withComments} with comments</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Rating Distribution */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setFilterRating(
                            filterRating === star.toString()
                              ? "all"
                              : star.toString()
                          )
                        }
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                          filterRating === star.toString()
                            ? "bg-gray-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-700 w-8">
                          {star} star
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{
                              width: `${getRatingPercentage(
                                ratingStats[star]
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-16">
                          {getRatingPercentage(ratingStats[star])}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters and Sorting */}
              <div className="border-b border-gray-100 px-6 md:px-8 py-4 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Filter by:</span>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="p-6 md:p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <RatingCard packageRatings={getFilteredAndSortedRatings()} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsPage;
