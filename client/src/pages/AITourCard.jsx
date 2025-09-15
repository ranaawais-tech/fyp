import React, { useState } from "react";
import { Image, Modal, Rate, Tooltip } from "antd";
import {
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaUsers,
  FaRegHeart,
  FaUtensils,
  FaHotel,
  FaPlane,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AITourCard = ({ packageData, tourDetail }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle modal open
  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Handle Book Now click
  const handleBookNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/package/create-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...packageData,
          packageImages: packageData.packageImages.map((img) =>
            typeof img === "string" ? img : img.url
          ),
        }),
      });

      const data = await res.json();

      const newPackageId = data.data?._id;

      if (currentUser) {
        navigate(`/booking/${newPackageId}`);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating package or navigating:", error);
    }
  };

  return (
    <>
      <Link
        to="#" // Prevent default navigation if modal is used
        className="group block w-full max-w-md bg-white rounded-3xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Image Container */}
        <div className="relative w-full h-72 overflow-hidden">
          <Image
            alt={packageData.packageImages[0]?.author}
            src={packageData.packageImages[0]?.url}
            preview={false}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            style={{ objectFit: "cover" }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Price Tag */}
          <div className="absolute top-4 right-4 z-10">
            {packageData.offer && packageData.packageDiscountPrice ? (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <MdLocalOffer className="text-lg" />
                  <span>SPECIAL OFFER</span>
                </div>
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-gray-400 line-through text-sm">
                    ${formatPrice(packageData.packagePrice)}
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    ${formatPrice(packageData.packageDiscountPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-gray-900 font-bold text-lg">
                  ${formatPrice(packageData.packagePrice)}
                </span>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/95 backdrop-blur-sm p-2.5 rounded-full transition-all duration-300 group-hover:opacity-100 opacity-0">
            <FaRegHeart className="text-white group-hover:text-red-500 text-xl transition-colors" />
          </button>

          {/* Quick Info Pills */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
            {packageData.packageIncludes?.flight && (
              <Tooltip title="Flight Included">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  <FaPlane className="text-xs" />
                  Flight
                </span>
              </Tooltip>
            )}
            {packageData.packageIncludes?.hotel && (
              <Tooltip title="Hotel Included">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  <FaHotel className="text-xs" />
                  Hotel
                </span>
              </Tooltip>
            )}
            {packageData.packageIncludes?.meals && (
              <Tooltip title="Meals Included">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  <FaUtensils className="text-xs" />
                  Meals
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Location */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {packageData.packageName}
              </h3>
              {packageData.packageTotalRatings > 0 && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-blue-700 font-semibold text-sm">
                    {packageData.packageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium">
                {packageData.packageDestination}
              </span>
            </div>
          </div>

          {/* Duration and Group Size */}
          <div className="flex items-center gap-6">
            {(+packageData.packageDays > 0 ||
              +packageData.packageNights > 0) && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">
                  {+packageData.packageDays > 0 &&
                    (+packageData.packageDays > 1
                      ? `${packageData.packageDays} Days`
                      : `${packageData.packageDays} Day`)}
                  {+packageData.packageDays > 0 &&
                    +packageData.packageNights > 0 &&
                    " - "}
                  {+packageData.packageNights > 0 &&
                    (+packageData.packageNights > 1
                      ? `${packageData.packageNights} Nights`
                      : `${packageData.packageNights} Night`)}
                </span>
              </div>
            )}
            {packageData.maxGroupSize && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaUsers className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">
                  Max {packageData.maxGroupSize} people
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {packageData.packageDescription && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {packageData.packageDescription}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Rate
                allowHalf
                disabled
                value={packageData.packageRating}
                style={{ fontSize: 14 }}
              />
              <span className="text-sm text-gray-500">
                ({packageData.packageTotalRatings} reviews)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-blue-600 text-sm font-medium group-hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  e.stopPropagation(); // Stop event bubbling
                  handleModalOpen(); // Open modal
                }}
              >
                View Details →
              </span>
              <span
                className="text-blue-600 text-sm font-medium group-hover:underline cursor-pointer"
                onClick={handleBookNow}
              >
                Book Now
              </span>
            </div>
          </div>
        </div>
      </Link>
      <Modal
        title="AI Travel Plan Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <button
            key="close"
            onClick={handleModalClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Close
          </button>,
        ]}
        width={800}
      >
        {tourDetail && tourDetail?.plan_text ? (
          <div className="text-gray-800">
            <h3 className="text-lg font-semibold mb-4">
              Your Personalized Travel Plan
            </h3>
            <p className="text-sm whitespace-pre-line mb-6">
              {tourDetail.plan_text}
            </p>
            {tourDetail?.images && tourDetail.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3">Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {tourDetail?.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image.url}
                      alt={image.title || `Image ${index + 1}`}
                      className="w-full !h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </Modal>
    </>
  );
};

export default AITourCard;
