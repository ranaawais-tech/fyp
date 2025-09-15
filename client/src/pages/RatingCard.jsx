import { Rating } from "@mui/material";
import React, { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaUserCircle,
  FaThumbsUp,
  FaRegThumbsUp,
  FaImage,
} from "react-icons/fa";
import defaultProfileImg from "../assets/images/profile.png";

const RatingCard = ({ packageRatings }) => {
  const [expandedReviews, setExpandedReviews] = useState({});
  const [helpfulMarks, setHelpfulMarks] = useState({});
  const [imageModal, setImageModal] = useState({
    open: false,
    images: [],
    currentIndex: 0,
  });

  const toggleReview = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleHelpful = (reviewId) => {
    setHelpfulMarks((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const openImageModal = (images, startIndex) => {
    setImageModal({ open: true, images, currentIndex: startIndex });
  };

  const nextImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  };

  return (
    <>
      {packageRatings &&
        packageRatings.map((rating, i) => {
          const isExpanded = expandedReviews[i];
          const reviewText =
            rating.review || (rating.rating < 3 ? "Not Bad" : "Good");
          const shouldTruncate = reviewText.length > 150;
          const isHelpful = helpfulMarks[i];

          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rating.userProfileImg ? (
                      <img
                        src={rating.userProfileImg}
                        alt={rating.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-400" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {rating.username}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(rating.createdAt)}
                      </p>
                    </div>
                  </div>
                  {rating.verifiedPurchase && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <Rating
                    value={rating.rating || 0}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {rating.rating.toFixed(1)} out of 5
                  </span>
                </div>

                {/* Review Title if exists */}
                {rating.title && (
                  <h5 className="font-medium text-gray-900">{rating.title}</h5>
                )}

                {/* Review Text */}
                <div className="text-gray-700">
                  {shouldTruncate && !isExpanded ? (
                    <>
                      <p className="leading-relaxed">
                        {reviewText.substring(0, 150)}...
                      </p>
                      <button
                        onClick={() => toggleReview(i)}
                        className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        Read more
                        <FaArrowDown className="w-3 h-3" />
                      </button>
                    </>
                  ) : shouldTruncate ? (
                    <>
                      <p className="leading-relaxed">{reviewText}</p>
                      <button
                        onClick={() => toggleReview(i)}
                        className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        Show less
                        <FaArrowUp className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <p className="leading-relaxed">{reviewText}</p>
                  )}
                </div>

                {/* Review Images */}
                {rating.images && rating.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {rating.images
                      .map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openImageModal(rating.images, index)}
                          className="relative group"
                        >
                          <img
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:border-indigo-300 transition-colors duration-200"
                          />
                          {index === 3 && rating.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white font-medium">
                              +{rating.images.length - 4}
                            </div>
                          )}
                        </button>
                      ))
                      .slice(0, 4)}
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleHelpful(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isHelpful
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isHelpful ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    Helpful
                  </button>
                  {rating.images && rating.images.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaImage className="w-4 h-4" />
                      {rating.images.length}{" "}
                      {rating.images.length === 1 ? "photo" : "photos"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {/* Image Modal */}
      {imageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl mx-auto p-4">
            <button
              onClick={() =>
                setImageModal({ open: false, images: [], currentIndex: 0 })
              }
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={imageModal.images[imageModal.currentIndex]}
              alt={`Review image ${imageModal.currentIndex + 1}`}
              className="max-h-[80vh] w-auto mx-auto rounded-lg"
            />
            {imageModal.images.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                <button
                  onClick={prevImage}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RatingCard;
