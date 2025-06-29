import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import orgProfileService from "../../service/OrganizationProfileApis";
import { toast } from "react-toastify";
import axios from "axios";

export default function OrganizationProfile() {
  const { userData, fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    orgName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    description: "",
    logo: "",
    taxId: "",
    registrationNumber: "",
    foundingDate: "",
    focusAreas: [],
    teamSize: "",
    operatingHours: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });
  const [newFocusArea, setNewFocusArea] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchProfileData();
  }, [fetchUserData]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      console.log(response)
      const apiData = response.data.data.user;

      // Map the API data to your profile state structure
      setProfile({
        orgName: apiData.orgName || "",
        email: apiData.email || "",
        phone: apiData.phone || "",
        address: apiData.address || "",
        city: apiData.city || "",
        state: apiData.state || "",
        zipCode: apiData.zipCode || "",
        country: apiData.country || "",
        website: apiData.website || "",
        description: apiData.description || "",
        logo: apiData.logo || "",
        taxId: apiData.taxId || "",
        registrationNumber: apiData.registrationNumber || "",
        foundingDate: apiData.foundingDate || "",
        focusAreas: apiData.focusAreas || [],
        teamSize: apiData.teamSize || "",
        operatingHours: apiData.operatingHours || "",
        socialMedia: {
          facebook: apiData.socialMedia?.facebook || "",
          twitter: apiData.socialMedia?.twitter || "",
          instagram: apiData.socialMedia?.instagram || "",
          linkedin: apiData.socialMedia?.linkedin || "",
        },
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      toast.error("Failed to load profile data");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleAddFocusArea = () => {
    if (
      newFocusArea.trim() &&
      !profile.focusAreas.includes(newFocusArea.trim())
    ) {
      setProfile((prev) => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()],
      }));
      setNewFocusArea("");
    }
  };

  const handleRemoveFocusArea = (area) => {
    setProfile((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((a) => a !== area),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to match your API's expected format
      const updateData = {
        orgName: profile.orgName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        website: profile.website,
        description: profile.description,
        taxId: profile.taxId,
        registrationNumber: profile.registrationNumber,
        foundingDate: profile.foundingDate,
        focusAreas: profile.focusAreas,
        teamSize: profile.teamSize,
        operatingHours: profile.operatingHours,
        socialMedia: profile.socialMedia,
      };

      await orgProfileService.updateProfile(updateData);
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchUserData(); // Refresh user data in context
      fetchProfileData(); // Refresh profile data
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("logo", file);

        const response = await orgProfileService.uploadLogo(formData);
        setProfile((prev) => ({ ...prev, logo: response.data.logoUrl }));
        toast.success("Logo uploaded successfully");
      } catch (err) {
        console.error("Error uploading logo:", err);
        toast.error("Failed to upload logo");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar and Main Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white text-2xl font-bold">NGO Connect</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <a
                  href="/organization-dashboard"
                  className="text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </a>
                <a
                  href="#"
                  className="bg-indigo-800 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </a>
                {/* Other sidebar links */}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {profile.orgName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "O"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {profile.orgName || "Organization"}
                  </p>
                  <p className="text-xs font-medium text-indigo-200">
                    View profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top Navigation */}
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="md:hidden bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <h1 className="text-xl font-semibold text-gray-900 ml-4">
                    Organization Profile
                  </h1>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Profile Header */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
                  <div className="px-6 pb-6 -mt-16 relative">
                    <div className="flex items-end justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          {profile.logo ? (
                            <img
                              className="h-24 w-24 rounded-full border-4 border-white bg-white"
                              src={profile.logo}
                              alt="Organization logo"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                              {profile.orgName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "O"}
                            </div>
                          )}
                          {editing && (
                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                              <svg
                                className="h-5 w-5 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoUpload}
                              />
                            </label>
                          )}
                        </div>
                        <div className="ml-6">
                          {editing ? (
                            <input
                              type="text"
                              name="orgName"
                              value={profile.orgName}
                              onChange={handleInputChange}
                              className="text-2xl font-bold text-gray-900 bg-gray-100 rounded-md px-3 py-1 w-full"
                            />
                          ) : (
                            <h2 className="text-2xl font-bold text-gray-900">
                              {profile.orgName}
                            </h2>
                          )}
                          <div className="mt-1 flex items-center">
                            <svg
                              className="h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {editing ? (
                              <input
                                type="text"
                                name="city"
                                value={profile.city}
                                onChange={handleInputChange}
                                className="ml-1 text-gray-600 bg-gray-100 rounded-md px-2 py-1 w-full"
                              />
                            ) : (
                              <span className="ml-1 text-gray-600">
                                {profile.city}, {profile.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {editing ? (
                          <div className="space-x-2">
                            <button
                              onClick={() => setEditing(false)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSubmit}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Save Changes
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          About
                        </h3>
                      </div>
                      <div className="px-6 py-4">
                        {editing ? (
                          <textarea
                            name="description"
                            rows="4"
                            value={profile.description}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Tell us about your organization..."
                          />
                        ) : (
                          <p className="text-gray-600">
                            {profile.description || "No description provided."}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Focus Areas Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Focus Areas
                        </h3>
                      </div>
                      <div className="px-6 py-4">
                        {editing ? (
                          <div>
                            <div className="flex mb-4">
                              <input
                                type="text"
                                value={newFocusArea}
                                onChange={(e) =>
                                  setNewFocusArea(e.target.value)
                                }
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Add a focus area"
                              />
                              <button
                                type="button"
                                onClick={handleAddFocusArea}
                                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {profile.focusAreas.map((area) => (
                                <div
                                  key={area}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {area}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFocusArea(area)}
                                    className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {profile.focusAreas.length > 0 ? (
                              profile.focusAreas.map((area) => (
                                <span
                                  key={area}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {area}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No focus areas specified
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Organization Details Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Organization Details
                        </h3>
                      </div>
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            {editing ? (
                              <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.email || "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Phone
                            </label>
                            {editing ? (
                              <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.phone || "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Website
                            </label>
                            {editing ? (
                              <input
                                type="url"
                                name="website"
                                value={profile.website}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.website ? (
                                  <a
                                    href={
                                      profile.website.startsWith("http")
                                        ? profile.website
                                        : `https://${profile.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    {profile.website}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Team Size
                            </label>
                            {editing ? (
                              <input
                                type="text"
                                name="teamSize"
                                value={profile.teamSize}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.teamSize || "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Tax ID
                            </label>
                            {editing ? (
                              <input
                                type="text"
                                name="taxId"
                                value={profile.taxId}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.taxId || "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Registration Number
                            </label>
                            {editing ? (
                              <input
                                type="text"
                                name="registrationNumber"
                                value={profile.registrationNumber}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.registrationNumber || "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Founding Date
                            </label>
                            {editing ? (
                              <input
                                type="date"
                                name="foundingDate"
                                value={profile.foundingDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.foundingDate
                                  ? new Date(
                                      profile.foundingDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Operating Hours
                            </label>
                            {editing ? (
                              <input
                                type="text"
                                name="operatingHours"
                                value={profile.operatingHours}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.operatingHours || "-"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Address Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Address
                        </h3>
                      </div>
                      <div className="px-6 py-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Street Address
                            </label>
                            {editing ? (
                              <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.address || "-"}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                City
                              </label>
                              {editing ? (
                                <input
                                  type="text"
                                  name="city"
                                  value={profile.city}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.city || "-"}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                State/Province
                              </label>
                              {editing ? (
                                <input
                                  type="text"
                                  name="state"
                                  value={profile.state}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.state || "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                ZIP/Postal Code
                              </label>
                              {editing ? (
                                <input
                                  type="text"
                                  name="zipCode"
                                  value={profile.zipCode}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.zipCode || "-"}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Country
                              </label>
                              {editing ? (
                                <input
                                  type="text"
                                  name="country"
                                  value={profile.country}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.country || "-"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Social Media
                        </h3>
                      </div>
                      <div className="px-6 py-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Facebook
                            </label>
                            {editing ? (
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                  facebook.com/
                                </span>
                                <input
                                  type="text"
                                  name="facebook"
                                  value={profile.socialMedia.facebook}
                                  onChange={handleSocialMediaChange}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  placeholder="username"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.socialMedia.facebook ? (
                                  <a
                                    href={`https://facebook.com/${profile.socialMedia.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    facebook.com/{profile.socialMedia.facebook}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Twitter
                            </label>
                            {editing ? (
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                  twitter.com/
                                </span>
                                <input
                                  type="text"
                                  name="twitter"
                                  value={profile.socialMedia.twitter}
                                  onChange={handleSocialMediaChange}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  placeholder="username"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.socialMedia.twitter ? (
                                  <a
                                    href={`https://twitter.com/${profile.socialMedia.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    twitter.com/{profile.socialMedia.twitter}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Instagram
                            </label>
                            {editing ? (
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                  instagram.com/
                                </span>
                                <input
                                  type="text"
                                  name="instagram"
                                  value={profile.socialMedia.instagram}
                                  onChange={handleSocialMediaChange}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  placeholder="username"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.socialMedia.instagram ? (
                                  <a
                                    href={`https://instagram.com/${profile.socialMedia.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    instagram.com/
                                    {profile.socialMedia.instagram}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              LinkedIn
                            </label>
                            {editing ? (
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                  linkedin.com/company/
                                </span>
                                <input
                                  type="text"
                                  name="linkedin"
                                  value={profile.socialMedia.linkedin}
                                  onChange={handleSocialMediaChange}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  placeholder="username"
                                />
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">
                                {profile.socialMedia.linkedin ? (
                                  <a
                                    href={`https://linkedin.com/company/${profile.socialMedia.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    linkedin.com/company/
                                    {profile.socialMedia.linkedin}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
