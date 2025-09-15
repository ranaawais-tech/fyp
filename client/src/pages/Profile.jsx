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
} from "../redux/user/userSlice";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser) {
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
    try {
      dispatch(updateUserStart());
      const formDataData = new FormData();
      formDataData.append("file", photo);
      formDataData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.floor((event.loaded / event.total) * 100);
          setPhotoPercentage(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const downloadUrl = data.secure_url;

          const res = await fetch(
            `/api/user/update-profile-photo/${currentUser._id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ avatar: downloadUrl }),
            }
          );

          const resData = await res.json();

          if (resData.success) {
            alert(resData.message);
            setFormData((prev) => ({ ...prev, avatar: downloadUrl }));
            dispatch(updateUserSuccess(resData.user));
            setProfilePhoto(null);
          } else {
            dispatch(updateUserFailure(resData.message));
            alert(resData.message);
          }
        } else {
          dispatch(updateUserFailure("Cloudinary upload failed"));
          alert("Cloudinary upload failed");
        }
      };

      xhr.onerror = () => {
        dispatch(updateUserFailure("Error uploading image"));
        alert("Upload error");
      };

      xhr.send(formDataData);
    } catch (error) {
      console.error(error);
      dispatch(updateUserFailure(error.message));
      alert("Error uploading image");
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (!data.success) {
        dispatch(logOutFailure(data.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirmDelete = confirm(
      "Are you sure? Your account will be permanently deleted!"
    );
    if (confirmDelete) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) {
          dispatch(deleteUserAccountFailure(data.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data.message);
        navigate("/register");
      } catch (error) {
        dispatch(deleteUserAccountFailure("Failed to delete account"));
      }
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2 mt-20">
      {currentUser ? (
        <>
          <div className="w-[40%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3">
              <div className="w-full flex flex-col items-center relative">
                <img
                  src={
                    (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                    formData.avatar
                  }
                  alt="Profile"
                  className="w-64 min-h-52 max-h-64 rounded-lg object-cover cursor-pointer"
                  onClick={() => fileRef.current.click()}
                />
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
                <label
                  htmlFor="photo"
                  className="w-64 bg-black bg-opacity-70 text-white absolute bottom-0 p-2 text-center text-lg font-semibold rounded-b-lg"
                >
                  Click to change photo
                </label>
              </div>

              {profilePhoto && (
                <button
                  onClick={() => handleProfilePhoto(profilePhoto)}
                  className="bg-green-600 text-white py-2 px-4 rounded mt-2 hover:bg-green-700 transition"
                >
                  {loading ? `Uploading... (${photoPercentage}%)` : "Upload"}
                </button>
              )}

              <div className="w-full shadow-lg p-4 rounded-lg bg-white">
                <h2 className="text-2xl font-bold mb-2">
                  Hi, {formData.username}
                </h2>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {formData.address}
                </p>
              </div>

              <div className="w-full flex justify-between mt-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={() => setActivePanelId(3)}
                  className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
                >
                  Edit Profile
                </button>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:underline mt-4"
              >
                Delete Account
              </button>
            </div>
          </div>

          <div className="w-[60%] max-sm:w-full">
            <nav className="border-b-2 border-blue-600 mb-2">
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-t ${
                    activePanelId === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => setActivePanelId(1)}
                >
                  Bookings
                </button>
                <button
                  className={`px-4 py-2 rounded-t ${
                    activePanelId === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => setActivePanelId(2)}
                >
                  History
                </button>
              </div>
            </nav>

            <div className="p-2">
              {activePanelId === 1 && <MyBookings />}
              {activePanelId === 2 && <MyHistory />}
              {activePanelId === 3 && <UpdateProfile />}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-full text-red-500 text-xl">
          Please login first
        </div>
      )}
    </div>
  );
};

export default Profile;
