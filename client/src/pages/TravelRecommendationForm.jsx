import { message } from "antd";
import React, { useState } from "react";
import AITourCard from "./AITourCard";

const TravelRecommendationForm = () => {
  const [formData, setFormData] = useState({
    destinationName: "",
    locationType: "City",
    province: "Punjab",
    startingLocation: "",
    budget: 0,
    gender: "Male",
    numberOfPeople: 1,
    numberOfDays: 7,
    additionalPreferences: "",
    hasChildren: false,
    activityType: "Adventure",
    travelGroup: "Solo",
    preferences: [], // Array to store selected preferences
  });

  const [currentPreference, setCurrentPreference] = useState(""); // Temporary state for the current selection
  const [loading, setLoading] = useState(false);
  const [tourDetail, setTourDetail] = useState();
  const [tourCardDetail, setTourCardDetail] = useState();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "currentPreference") {
      setCurrentPreference(value); // Update the temporary selection
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addPreference = () => {
    if (
      currentPreference &&
      !formData.preferences.includes(currentPreference)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        preferences: [...prevData.preferences, currentPreference],
      }));
      setCurrentPreference(""); // Reset the dropdown after adding
    }
  };

  const removePreference = (preferenceToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      preferences: prevData.preferences.filter(
        (pref) => pref !== preferenceToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      destination: formData.destinationName,
      location_type: formData.locationType,
      province: formData.province,
      starting_location: formData.startingLocation,
      gender: formData.gender,
      num_people: Number(formData.numberOfPeople),
      has_children: formData.hasChildren,
      activity_type: formData.activityType,
      travel_group: formData.travelGroup,
      preferences: formData.preferences,
      budget: Number(formData.budget),
      num_days: Number(formData.numberOfDays),
      additional_preferences: formData.additionalPreferences,
    };

    try {
      // Step 1: Generate the travel plan
      const response = await fetch(
        "https://myousafrana-travelling-agent.hf.space/generate_plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        message.error("Failed to fetch travel plan");
      }

      const result = await response.json();
      console.log("Travel Plan Generated:", result);

      const planText = result?.plan_text;

      if (!planText) {
        message.error("No plan text received from the travel plan API.");
      }

      message.success("Travel plan generated successfully!");

      // Step 2: Extract structured package from plan text
      const extractResponse = await fetch(
        "https://myousafrana-travelling-agent.hf.space/extract_package",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_text: planText }),
        }
      );

      if (!extractResponse.ok) {
        message.error("Failed to extract package from plan text");
      }

      const extracted = await extractResponse.json();
      console.log("Extracted Package:", extracted);

      message.success("Package extracted successfully!");

      setTourDetail(result);
      setTourCardDetail(extracted);
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setFormData({
        destinationName: "",
        locationType: "City",
        province: "Punjab",
        startingLocation: "",
        budget: 0,
        gender: "Male",
        numberOfPeople: 1,
        numberOfDays: 7,
        additionalPreferences: "",
        hasChildren: false,
        activityType: "Adventure",
        travelGroup: "Solo",
        preferences: [],
      });
    }
  };

  return (
    <div className="min-h-screen text-gray-800 flex flex-col gap-10 items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-2xl mt-16">
        <h1
          className="text-3xl font-bold text-center mb-6 flex items-center justify-center text-green-600
"
        >
          <span className="mr-2">🌍</span> Customize Your Travel Plan With AI
        </h1>
        <p className="text-center text-gray-700 mb-6 font-bold text-xl">
          Plan your perfect trip with personalized itineraries.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Destination Name
              </label>
              <input
                type="text"
                name="destinationName"
                value={formData.destinationName}
                onChange={handleChange}
                placeholder="e.g., Neelum Valley (optional if additional preference)"
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Location *
              </label>
              <input
                type="text"
                required
                name="startingLocation"
                value={formData.startingLocation}
                onChange={handleChange}
                placeholder="e.g., Islamabad"
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Type *
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>City</option>
                <option>Beach</option>
                <option>Mountain</option>
                <option>Historical Site</option>
                <option>National Park</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Activity Type *
              </label>
              <select
                name="activityType"
                value={formData.activityType}
                required
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Adventure</option>
                <option>Sightseeing</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province *
              </label>
              <select
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Punjab</option>
                <option>Sindh</option>
                <option>Khyber Pakhtunkhwa</option>
                <option>Balochistan</option>
                <option>Gilgit-Baltistan</option>
                <option>Azad Kashmir</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Travel Group *
              </label>
              <select
                name="travelGroup"
                required
                value={formData.travelGroup}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Solo</option>
                <option>With partner</option>
                <option>With family</option>
                <option>With friends</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget (PKR)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Days
              </label>
              <input
                type="number"
                name="numberOfDays"
                value={formData.numberOfDays}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender *
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of People *
              </label>
              <input
                type="number"
                required
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferences (Select one at a time)
            </label>
            <div className="flex items-center space-x-2">
              <select
                name="currentPreference"
                value={currentPreference}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a preference</option>
                <option value="Cultural Experience">Cultural Experience</option>
                <option value="Food and Dining">Food and Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Nature">Nature</option>
                <option value="History">History</option>
              </select>
              <button
                type="button"
                onClick={addPreference}
                disabled={!currentPreference}
                className="mt-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400"
              >
                Add
              </button>
            </div>
            {formData.preferences.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">Selected Preferences:</p>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {formData.preferences.map((pref, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => removePreference(pref)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Preferences or Requests
            </label>
            <textarea
              name="additionalPreferences"
              value={formData.additionalPreferences}
              onChange={handleChange}
              placeholder="e.g., I want to see nature in Neelum Valley"
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasChildren"
              checked={formData.hasChildren}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              Are there children in the group?
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate My Travel Plan"}
          </button>
        </form>
      </div>

      {tourCardDetail && tourDetail && (
        <AITourCard packageData={tourCardDetail} tourDetail={tourDetail} />
      )}
    </div>
  );
};

export default TravelRecommendationForm;
