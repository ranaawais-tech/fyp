import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (photo) => {
    if (!photo) {
      alert("No photo selected!");
      return;
    }

    try {
      dispatch(updateUserStart());

      // Step 1: Upload to Cloudinary
      const formDataCloud = new FormData();
      formDataCloud.append("file", photo);
      formDataCloud.append("upload_preset", "user_profile_photo"); // Ensure this matches your Cloudinary preset
      formDataCloud.append("cloud_name", "dckbljq0f"); // Ensure this matches your Cloudinary cloud name

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dckbljq0f/image/upload",
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error(
          `Cloudinary upload failed with status: ${cloudinaryRes.status}`
        );
      }

      const cloudinaryData = await cloudinaryRes.json();
      console.log("Cloudinary response:", cloudinaryData);

      if (!cloudinaryData.secure_url) {
        throw new Error(
          "Image upload failed: No secure URL returned from Cloudinary"
        );
      }

      // Step 2: Update user profile with the new avatar URL
      const backendRes = await fetch(
        `/api/user/update-profile-photo/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ avatar: cloudinaryData.secure_url }),
        }
      );

      if (!backendRes.ok) {
        throw new Error(`Backend API failed with status: ${backendRes.status}`);
      }

      const backendData = await backendRes.json();
      console.log("Backend API response:", backendData);

      if (backendData?.success) {
        setFormData((prev) => ({ ...prev, avatar: cloudinaryData.secure_url }));
        dispatch(updateUserSuccess(backendData.user));
        setProfilePhoto(null);
        alert(backendData.message || "Profile photo updated successfully!");
      } else {
        throw new Error(
          backendData.message || "Failed to update profile photo"
        );
      }
    } catch (error) {
      console.error("Error in handleProfilePhoto:", error);
      dispatch(updateUserFailure(error.message));
      alert(`Error: ${error.message}`);
      setProfilePhoto(null); // Reset even on error to allow retry
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      alert(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data?.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-24">
      {currentUser ? (
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-6">
          {/* Profile Section */}
          <div className="w-full lg:w-[350px] bg-blue-300 text-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <img
                  // src={
                  //   (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                  //   formData.avatar
                  // }
                  src="../images/profile_3.jpeg"
                  alt="Profile photo"
                  className="w-48 h-48 object-cover rounded-full ring-4 ring-teal-100 cursor-pointer transition duration-300 hover:ring-teal-300"
                  onClick={() => fileRef.current.click()}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-teal-500 bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </div>
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
              </div>

              {profilePhoto && (
                <button
                  onClick={() => handleProfilePhoto(profilePhoto)}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                  {loading ? "Uploading..." : "Upload Photo"}
                </button>
              )}

              <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-500 border-2 border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setActivePanelId(8)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="bg-blue-400 rounded-xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-teal-800">
                    Welcome, {currentUser.username}!
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span className="break-all">{currentUser.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{currentUser.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Address:</span>
                      <span className="break-all">{currentUser.address}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  className="text-red-500 text-sm hover:text-red-700 transition duration-300"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            <nav className="bg-blue-500 border-b border-blue-700">
              <div className="flex gap-1 p-2 overflow-x-auto text-white">
                {[
                  "Bookings",
                  "Add Packages",
                  "All Packages",
                  "Users",
                  "Payments",
                  "Ratings/Reviews",
                  "History",
                ].map((label, idx) => (
                  <button
                    key={label}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition duration-300 ${
                      activePanelId === idx + 1
                        ? "bg-blue-700 text-white"
                        : "text-gray-200 hover:bg-blue-500"
                    }`}
                    onClick={() => setActivePanelId(idx + 1)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-6">
              {activePanelId === 1 ? (
                <AllBookings />
              ) : activePanelId === 2 ? (
                <AddPackages />
              ) : activePanelId === 3 ? (
                <AllPackages />
              ) : activePanelId === 4 ? (
                <AllUsers />
              ) : activePanelId === 5 ? (
                <Payments />
              ) : activePanelId === 6 ? (
                <RatingsReviews />
              ) : activePanelId === 7 ? (
                <History />
              ) : activePanelId === 8 ? (
                <AdminUpdateProfile />
              ) : (
                <div>Page Not Found!</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-red-600 text-xl font-medium">
            Please login to access the dashboard
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
