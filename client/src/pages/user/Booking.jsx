import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { message } from "antd";

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/package/get-package-data/${params?.packageId}`
      );
      const data = await res.json();
      if (data?.success) {
        setPackageData({ ...data?.packageData });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/package/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [currentUser]);

  const handleBookPackage = async () => {
    if (
      !bookingData.packageDetails ||
      !bookingData.buyer ||
      bookingData.totalPrice <= 0 ||
      !bookingData.date
    ) {
      message.error("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/book-package/${params?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      setLoading(false);
      if (data?.success) {
        message.success(data.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        message.success(data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setCurrentDate(today.toISOString().substring(0, 10));
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      const totalPrice = packageData.packageDiscountPrice
        ? packageData.packageDiscountPrice * bookingData.persons
        : packageData.packagePrice * bookingData.persons;

      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice,
      });
    }
  }, [packageData, params]);

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-16 px-4 mt-20">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Book Your Adventure
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Info Card */}
          <div className="flex-1 bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <div className="space-y-3">
              <input
                disabled
                value={currentUser.username}
                className="input-style"
                placeholder="Username"
              />
              <input
                disabled
                value={currentUser.email}
                className="input-style"
                placeholder="Email"
              />
              <textarea
                disabled
                value={currentUser.address}
                className="input-style resize-none"
                rows={3}
                placeholder="Address"
              />
              <input
                disabled
                value={currentUser.phone}
                className="input-style"
                placeholder="Phone"
              />
            </div>
          </div>

          {/* Package Info Card */}
          <div className="flex-1 bg-green-50 p-6 rounded-xl border border-green-200 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={packageData.packageImages[0]}
                className="w-28 h-20 rounded object-cover shadow"
                alt="Package"
              />
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {packageData.packageName}
                </h2>
                <p className="flex items-center gap-2 text-sm text-green-800">
                  <FaMapMarkerAlt /> {packageData.packageDestination}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <FaClock />
                  {packageData.packageDays} Day
                  {packageData.packageDays > 1 && "s"} -{" "}
                  {packageData.packageNights} Night
                  {packageData.packageNights > 1 && "s"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold">Select Date:</label>
              <input
                type="date"
                min={currentDate}
                className="input-style"
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
              />

              <div className="flex items-center gap-3 mt-3">
                <p className="font-semibold text-lg">Price:</p>
                {packageData.packageOffer ? (
                  <div className="flex items-center gap-2 text-lg">
                    <span className="line-through text-gray-500">
                      ${packageData.packagePrice}
                    </span>
                    <span className="text-green-700 font-semibold">
                      ${packageData.packageDiscountPrice}
                    </span>
                    <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded">
                      {Math.floor(
                        ((packageData.packagePrice -
                          packageData.packageDiscountPrice) /
                          packageData.packagePrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-green-700 font-semibold text-lg">
                    ${packageData.packagePrice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() =>
                    bookingData.persons > 1 &&
                    setBookingData((prev) => ({
                      ...prev,
                      persons: prev.persons - 1,
                      totalPrice:
                        (packageData.packageDiscountPrice ||
                          packageData.packagePrice) *
                        (prev.persons - 1),
                    }))
                  }
                >
                  -
                </button>
                <input
                  disabled
                  value={bookingData.persons}
                  className="w-12 text-center border rounded"
                />
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() =>
                    bookingData.persons < 10 &&
                    setBookingData((prev) => ({
                      ...prev,
                      persons: prev.persons + 1,
                      totalPrice:
                        (packageData.packageDiscountPrice ||
                          packageData.packagePrice) *
                        (prev.persons + 1),
                    }))
                  }
                >
                  +
                </button>
              </div>

              <p className="font-semibold text-xl text-blue-800">
                Total: ${bookingData.totalPrice}
              </p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-red-600">
                  {!instance && "Loading payment form..."}
                </p>
                {clientToken && (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700 disabled:opacity-60"
                      onClick={handleBookPackage}
                      disabled={loading || !instance || !currentUser?.address}
                    >
                      {loading ? "Processing..." : "Book Now"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind custom styles */}
      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default Booking;
