import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const RestaurantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    cuisineType: "",
    contactPerson: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = response.data.data.user;
        setProfile(userData);
        setFormData({
          restaurantName: userData.restaurantName || "",
          cuisineType: userData.cuisineType || "",
          contactPerson: userData.contactPerson || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile");
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API_URL}/auth/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(response.data.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-amber-800">
          <svg
            className="animate-spin h-12 w-12 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl font-medium">
            Loading your restaurant profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-amber-200">
          {/* Profile Header with restaurant theme */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-600 flex items-end">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    isEditing
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      : "bg-white text-amber-700 hover:bg-amber-50 shadow-md"
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              <div className="p-6 w-full bg-gradient-to-t from-black/60 to-transparent">
                <h1 className="text-3xl font-bold text-white">
                  {profile.restaurantName}
                </h1>
                <p className="text-amber-100 mt-1 text-lg">
                  {profile.cuisineType || "No cuisine type specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-amber-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-amber-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      required
                    />
                    <p className="mt-1 text-xs text-amber-600">
                      e.g., Italian, Mexican, Fusion, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-amber-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-amber-200">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h2 className="text-lg font-medium text-amber-800 mb-4 pb-2 border-b border-amber-200">
                      Restaurant Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-amber-600">
                          Restaurant Name
                        </h3>
                        <p className="mt-1 text-amber-900 font-medium">
                          {profile.restaurantName}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-600">
                          Cuisine Type
                        </h3>
                        <p className="mt-1 text-amber-900 font-medium">
                          {profile.cuisineType || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-600">
                          Contact Person
                        </h3>
                        <p className="mt-1 text-amber-900 font-medium">
                          {profile.contactPerson || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h2 className="text-lg font-medium text-amber-800 mb-4 pb-2 border-b border-amber-200">
                      Contact Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-amber-600">
                          Email
                        </h3>
                        <p className="mt-1 text-amber-900 font-medium">
                          {profile.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-600">
                          Phone
                        </h3>
                        <p className="mt-1 text-amber-900 font-medium">
                          {profile.phone || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h2 className="text-lg font-medium text-amber-800 mb-4 pb-2 border-b border-amber-200">
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-amber-600">
                        License Number
                      </h3>
                      <p className="mt-1 text-amber-900 font-medium">
                        {profile.licenseNumber || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-600">
                        Member Since
                      </h3>
                      <p className="mt-1 text-amber-900 font-medium">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h2 className="text-lg font-medium text-amber-800 mb-4 pb-2 border-b border-amber-200">
                    Quick Actions
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition">
                      View Menu
                    </button>
                    <button className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 transition">
                      View Reservations
                    </button>
                    <button className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 transition">
                      View Reviews
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
