import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Motivational slogans for food donors
  const slogans = [
    "Your donation feeds hope to the hungry",
    "One meal can change a life",
    "Together we can end hunger",
    "Share your plate, share your heart",
    "Food is love made visible",
    "No one should sleep hungry",
    "Your generosity nourishes communities",
    "Small acts, big impacts",
    "Fight hunger, feed hope",
    "Be the reason someone smiles today",
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(data.data.user);
        reset(data.data.user);
      } catch (error) {
        toast.error("Failed to fetch profile data");
        console.error("Fetch error:", error);
      }
    };

    fetchUserData();
  }, [reset]);

  // Rotate slogans every 5 seconds
  useEffect(() => {
    if (slogans.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * slogans.length);
        setCurrentSlogan(slogans[randomIndex]);
      }, 5000);

      setCurrentSlogan(slogans[0]);
      return () => clearInterval(interval);
    }
  }, []);

  // Handle profile update
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await axios.patch(
        `${API_URL}/auth/update`,
        data,
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with slogan */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {user.role === "individual"
              ? "Your Food Hero Profile"
              : user.role === "organization"
              ? "Organization Profile"
              : "Restaurant Profile"}
          </h1>
          <div className="mt-4 h-12">
            <p className="text-xl text-indigo-600 font-medium transition-opacity duration-500">
              {currentSlogan}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {user.role === "individual"
                ? "Personal Information"
                : user.role === "organization"
                ? "Organization Details"
                : "Restaurant Details"}
            </h3>
            <div className="mt-4 sm:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      reset(user);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profileForm"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-6">
              {/* Email (read-only) */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Email address
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Name/Org Name/Restaurant Name */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label
                  htmlFor="nameField"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  {user.role === "individual"
                    ? "Full name"
                    : user.role === "organization"
                    ? "Organization name"
                    : "Restaurant name"}
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        id="nameField"
                        {...register(
                          user.role === "individual"
                            ? "name"
                            : user.role === "organization"
                            ? "orgName"
                            : "restaurantName",
                          { required: "This field is required" }
                        )}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.name ||
                      errors.orgName ||
                      errors.restaurantName ? (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.name?.message ||
                            errors.orgName?.message ||
                            errors.restaurantName?.message}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-gray-900">
                      {user.role === "individual"
                        ? user.name
                        : user.role === "organization"
                        ? user.orgName
                        : user.restaurantName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Phone number
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        id="phone"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Please enter a valid 10-digit phone number",
                          },
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900">{user.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Address
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <>
                      <textarea
                        id="address"
                        rows={3}
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 whitespace-pre-line">
                      {user.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Role-specific fields */}
              {user.role === "organization" && (
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label
                    htmlFor="missionStatement"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Mission Statement
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      <>
                        <textarea
                          id="missionStatement"
                          rows={3}
                          {...register("missionStatement")}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </>
                    ) : (
                      <p className="text-gray-900 whitespace-pre-line">
                        {user.missionStatement || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {user.role === "restaurant" && (
                <>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="cuisineType"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Cuisine Type
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="cuisineType"
                            {...register("cuisineType")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </>
                      ) : (
                        <p className="text-gray-900">
                          {user.cuisineType || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Contact Person
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="contactPerson"
                            {...register("contactPerson")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </>
                      ) : (
                        <p className="text-gray-900">
                          {user.contactPerson || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Member Since */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Member since
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Stats Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Impact
            </h3>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-indigo-800 text-sm font-medium">
                Total Donations
              </div>
              <div className="mt-1 text-2xl font-semibold text-indigo-900">
                24
              </div>
              <div className="mt-1 text-xs text-indigo-600">
                +3 from last month
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-800 text-sm font-medium">
                People Fed
              </div>
              <div className="mt-1 text-2xl font-semibold text-green-900">
                120+
              </div>
              <div className="mt-1 text-xs text-green-600">
                Equivalent to 10 families
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-800 text-sm font-medium">
                Active Requests
              </div>
              <div className="mt-1 text-2xl font-semibold text-yellow-900">
                2
              </div>
              <div className="mt-1 text-xs text-yellow-600">
                Pending delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
