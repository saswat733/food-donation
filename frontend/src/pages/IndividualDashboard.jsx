import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import dashboardService from "../service/IndividualDashboardApi";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const API_URL =
  import.meta.env.VITE_API_BASE_URL + "/individual" ||
  "http://localhost:3000/api/v1/individual";
// import { Organization } from "../../../backend/models/userModels";
export default function UserDashboard() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDonationRequestModal, setShowDonationRequestModal] =
    useState(false);
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    donations: true,
    donors: true,
    organizations: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
const navigate = useNavigate();

  const [donationRequest, setDonationRequest] = useState({
    donor: "",
    foodType: "other",
    foodDescription: "",
    quantity: {
      value: "",
      unit: "kg",
    },
    storageRequirements: "frozen",
    preferredDeliveryDate: "",
    purpose: "",
    specialInstructions: "",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [volunteerForm, setVolunteerForm] = useState({
    organization: "",
    skills: [],
    currentSkill: "",
    availability: "",
    motivation: "",
  });

  const [serviceForm, setServiceForm] = useState({
    serviceType: "",
    description: "",
    availability: "",
    location: "",
  });

  const stats = [
    {
      name: "Total Donations",
      value: "$1,800",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Active Volunteers",
      value: "24",
      change: "+4",
      changeType: "positive",
    },
    {
      name: "Service Requests",
      value: "8",
      change: "-2",
      changeType: "negative",
    },
    { name: "Upcoming Events", value: "3", change: "0", changeType: "neutral" },
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDashboardData = async () => {
    try {
      const [donationsRes, donorsRes, orgsRes] = await Promise.all([
        axios.get(`${API_URL}/donations`, getAuthHeaders()),
        axios.get(`${API_URL}/donors`, getAuthHeaders()),
        axios.get(`${API_URL}/organizations`, getAuthHeaders()),
      ]);

      setDonations(donationsRes.data.data.donations);
      setDonors(donorsRes.data.data.donors);
      setOrganizations(
        orgsRes.data.data.organizations.map((org) => ({
          id: org._id,
          name: org.orgName,
          category: org.category,
          logo: org.orgName
            .split(" ")
            .map((n) => n[0])
            .join(""),
        }))
      );

      setLoading({
        donations: false,
        donors: false,
        organizations: false,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("donations::",donations)

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    if (volunteerForm.skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    if (!volunteerForm.availability) {
      toast.error("Please select your availability");
      return;
    }

    if (volunteerForm.motivation.length > 500) {
      toast.error("Motivation should be 500 characters or less");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_URL}/volunteer`,
        {
          organization: volunteerForm.organization,
          skills: volunteerForm.skills,
          availability: volunteerForm.availability,
          motivation: volunteerForm.motivation,
        },
        getAuthHeaders()
      );

      toast.success("Volunteer application submitted successfully!");
      setShowVolunteerModal(false);
      setVolunteerForm({
        organization: "",
        skills: [],
        currentSkill: "",
        availability: "",
        motivation: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit volunteer application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = () => {
    if (
      volunteerForm.currentSkill.trim() &&
      !volunteerForm.skills.includes(volunteerForm.currentSkill.trim())
    ) {
      setVolunteerForm({
        ...volunteerForm,
        skills: [...volunteerForm.skills, volunteerForm.currentSkill.trim()],
        currentSkill: "",
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setVolunteerForm({
      ...volunteerForm,
      skills: volunteerForm.skills.filter((skill) => skill !== skillToRemove),
    });
  };
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/service`, serviceForm, getAuthHeaders());
      toast.success("Service offer submitted");
      setShowServiceModal(false);
    } catch (err) {
      console.error("Error submitting service offer:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit service offer"
      );
    }
  };
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home page
    navigate("/");
  };

  const handleDonationRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert quantity value to number
      const requestData = {
        ...donationRequest,
        quantity: {
          value: Number(donationRequest.quantity.value),
          unit: donationRequest.quantity.unit,
        },
        preferredDeliveryDate: new Date(donationRequest.preferredDeliveryDate),
      };

      await axios.post(`${API_URL}/donation`, requestData, getAuthHeaders());

      toast.success("Food donation request submitted successfully!");
      setShowDonationRequestModal(false);
      // Reset form
      setDonationRequest({
        donor: "",
        foodType: "other",
        foodDescription: "",
        quantity: {
          value: "",
          unit: "kg",
        },
        storageRequirements: "frozen",
        preferredDeliveryDate: "",
        purpose: "",
        specialInstructions: "",
        deliveryAddress: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error submitting food donation request:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit food donation request"
      );
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar and Main Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white text-2xl font-bold">Feeders</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
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
                    aria-hidden="true"
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
                  className="text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Volunteers
                </a>
                <a
                  href="#"
                  className="text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Donations
                </a>
                <a
                  href="#"
                  className="text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Services
                </a>
                <a
                  href="#"
                  className="text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Events
                </a>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <Link to={"/individual-dashboard/profile"}>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {userData?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                      View profile
                    </p>
                  </div>
                </div>
              </Link>
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
                      aria-hidden="true"
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
                    Dashboard
                  </h1>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-xl overflow-hidden mb-8">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Welcome back, {userData.name}!
                        </h2>
                        <p className="mt-1 text-indigo-100 max-w-lg">
                          Here's what's happening with your NGO activities
                          today.
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <button
                          onClick={() => setShowDonationRequestModal(true)}
                          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Request Donation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {stats.map((stat) => (
                    <div
                      key={stat.name}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                            <svg
                              className="h-6 w-6 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {stat.name}
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {stat.value}
                              </div>
                              <div
                                className={`ml-2 flex items-baseline text-sm font-semibold ${
                                  stat.changeType === "positive"
                                    ? "text-green-600"
                                    : stat.changeType === "negative"
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {stat.changeType === "positive" ? (
                                  <svg
                                    className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : stat.changeType === "negative" ? (
                                  <svg
                                    className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : null}
                                <span className="sr-only">
                                  {stat.changeType === "positive"
                                    ? "Increased"
                                    : stat.changeType === "negative"
                                    ? "Decreased"
                                    : ""}{" "}
                                  by
                                </span>
                                {stat.change}
                              </div>
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div
                      onClick={() => setShowVolunteerModal(true)}
                      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:p-6 flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Apply to Volunteer
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Join an organization as a volunteer
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setShowServiceModal(true)}
                      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:p-6 flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Offer a Service
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Provide professional services to NGOs
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setShowDonationRequestModal(true)}
                      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:p-6 flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Request Donation
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Reach out to potential donors
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Donations */}
                  <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Recent Donations Requests
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {donations?.map((donation) => (
                            <li key={donation._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <span className="text-indigo-600 font-medium">
                                        {donation.donor.name
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {donation.donor.name} (
                                        {donation.donor.email})
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {donation.foodType} - {donation.purpose}
                                      </div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                          donation.createdAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {donation.quantity.value}{" "}
                                      {donation.quantity.unit}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {donation.deliveryAddress.city},{" "}
                                      {donation.deliveryAddress.state}
                                    </div>
                                    <span
                                      className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      donation.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : donation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : donation.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                                    >
                                      {donation.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all donations
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organizations */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Organizations
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {organizations.slice(0, 3).map((org) => (
                            <li key={org.id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-medium">
                                      {org.logo}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {org.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {org.category}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={() => {
                                      setVolunteerForm({
                                        organization: org.id,
                                        skills: [],
                                        currentSkill: "",
                                        availability: "",
                                        motivation: "",
                                      });
                                      setShowVolunteerModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Volunteer
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <Link
                            to="/individual-dashboard/organizations" // Assuming you're using React Router
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all organizations →
                          </Link>
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

      {/* Volunteer Application Modal */}
      {showVolunteerModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                      Volunteer Application
                    </h3>
                    {volunteerForm.organization && (
                      <p className="text-sm text-gray-500 mb-6">
                        Applying to:{" "}
                        <span className="font-medium text-indigo-600">
                          {organizations.find(
                            (org) => org.id === volunteerForm.organization
                          )?.name || ""}
                        </span>
                      </p>
                    )}

                    <form onSubmit={handleVolunteerSubmit}>
                      {/* Organization Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization *
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={volunteerForm.organization}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              organization: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select an organization</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Skills Section */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Skills *
                        </label>
                        <div className="flex mb-2">
                          <input
                            type="text"
                            className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={volunteerForm.currentSkill}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                currentSkill: e.target.value,
                              })
                            }
                            placeholder="Add a skill (e.g., Cooking)"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add
                          </button>
                        </div>

                        {/* Selected Skills */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {volunteerForm.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600 focus:outline-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        {volunteerForm.skills.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            Please add at least one skill
                          </p>
                        )}
                      </div>

                      {/* Availability */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Availability *
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={volunteerForm.availability}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              availability: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select your availability</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekends">Weekends</option>
                          <option value="both">
                            Both weekdays and weekends
                          </option>
                          <option value="flexible">Flexible schedule</option>
                        </select>
                      </div>

                      {/* Motivation */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motivation *
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            ({volunteerForm.motivation.length}/500 characters)
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={volunteerForm.motivation}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              motivation: e.target.value,
                            })
                          }
                          maxLength={500}
                          placeholder="Why do you want to volunteer with this organization?"
                          required
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="mt-8 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowVolunteerModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            volunteerForm.skills.length === 0 ||
                            !volunteerForm.availability ||
                            !volunteerForm.organization
                          }
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Offering Modal */}
      {showServiceModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Offer a Service
                    </h3>
                    <form onSubmit={handleServiceSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="serviceType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Service Type
                        </label>
                        <select
                          id="serviceType"
                          value={serviceForm.serviceType}
                          onChange={(e) =>
                            setServiceForm({
                              ...serviceForm,
                              serviceType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select service type</option>
                          <option value="consulting">Consulting</option>
                          <option value="teaching">Teaching</option>
                          <option value="technical">Technical Support</option>
                          <option value="creative">Creative Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          value={serviceForm.description}
                          onChange={(e) =>
                            setServiceForm({
                              ...serviceForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe the service you're offering"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="availability"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Availability
                        </label>
                        <input
                          type="text"
                          id="availability"
                          value={serviceForm.availability}
                          onChange={(e) =>
                            setServiceForm({
                              ...serviceForm,
                              availability: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="When are you available to provide this service?"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={serviceForm.location}
                          onChange={(e) =>
                            setServiceForm({
                              ...serviceForm,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Where can you provide this service?"
                          required
                        />
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Submit Service Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowServiceModal(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Request Modal */}
      {showDonationRequestModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                      Request Food Donation
                    </h3>
                    <form onSubmit={handleDonationRequestSubmit}>
                      {/* Donor Selection */}
                      <div className="mb-4">
                        <label
                          htmlFor="donor"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Donor (Organization) *
                        </label>
                        <select
                          id="donor"
                          value={donationRequest.donor}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              donor: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select donor organization</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Food Type */}
                      <div className="mb-4">
                        <label
                          htmlFor="foodType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Type of Food *
                        </label>
                        <select
                          id="foodType"
                          value={donationRequest.foodType}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              foodType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="perishable">Perishable</option>
                          <option value="non-perishable">Non-Perishable</option>
                          <option value="prepared">Prepared Food</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Food Description */}
                      <div className="mb-4">
                        <label
                          htmlFor="foodDescription"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Food Description *
                        </label>
                        <textarea
                          id="foodDescription"
                          rows={3}
                          value={donationRequest.foodDescription}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              foodDescription: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Detailed description of the food items"
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="number"
                              id="quantityValue"
                              min="1"
                              value={donationRequest.quantity.value}
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  quantity: {
                                    ...donationRequest.quantity,
                                    value: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Amount"
                              required
                            />
                          </div>
                          <div>
                            <select
                              id="unit"
                              value={donationRequest.quantity.unit}
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  quantity: {
                                    ...donationRequest.quantity,
                                    unit: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            >
                              <option value="kg">Kilograms</option>
                              <option value="lbs">Pounds</option>
                              <option value="units">Units</option>
                              <option value="meals">Meals</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Storage Requirements */}
                      <div className="mb-4">
                        <label
                          htmlFor="storageRequirements"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Storage Requirements *
                        </label>
                        <select
                          id="storageRequirements"
                          value={donationRequest.storageRequirements}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              storageRequirements: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="refrigerated">Refrigerated</option>
                          <option value="frozen">Frozen</option>
                          <option value="shelf-stable">Shelf-stable</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      {/* Preferred Delivery Date */}
                      <div className="mb-4">
                        <label
                          htmlFor="preferredDeliveryDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preferred Delivery Date *
                        </label>
                        <input
                          type="date"
                          id="preferredDeliveryDate"
                          value={donationRequest.preferredDeliveryDate}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              preferredDeliveryDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>

                      {/* Purpose */}
                      <div className="mb-4">
                        <label
                          htmlFor="purpose"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Purpose *
                        </label>
                        <input
                          type="text"
                          id="purpose"
                          value={donationRequest.purpose}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              purpose: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="What will this food be used for?"
                          required
                        />
                      </div>

                      {/* Delivery Address */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address *
                        </label>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="Street"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={
                                donationRequest.deliveryAddress?.street || ""
                              }
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  deliveryAddress: {
                                    ...donationRequest.deliveryAddress,
                                    street: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="City"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={
                                donationRequest.deliveryAddress?.city || ""
                              }
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  deliveryAddress: {
                                    ...donationRequest.deliveryAddress,
                                    city: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="State"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={
                                donationRequest.deliveryAddress?.state || ""
                              }
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  deliveryAddress: {
                                    ...donationRequest.deliveryAddress,
                                    state: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Postal Code"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={
                                donationRequest.deliveryAddress?.postalCode ||
                                ""
                              }
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  deliveryAddress: {
                                    ...donationRequest.deliveryAddress,
                                    postalCode: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Country"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={
                                donationRequest.deliveryAddress?.country || ""
                              }
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  deliveryAddress: {
                                    ...donationRequest.deliveryAddress,
                                    country: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="mb-4">
                        <label
                          htmlFor="specialInstructions"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          id="specialInstructions"
                          rows={2}
                          value={donationRequest.specialInstructions}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              specialInstructions: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Any special handling or delivery instructions"
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                        >
                          Submit Request
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDonationRequestModal(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
