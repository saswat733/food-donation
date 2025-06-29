import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_BASE_URL + "/restaurant" ||
  "http://localhost:3000/api/v1/restaurant";

export default function RestaurantDashboard() {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [loading, setLoading] = useState({
    donations: true,
    organizations: true,
    pickups: true,
  });

  const navigate = useNavigate();
  const [foodDonation, setFoodDonation] = useState({
    organization: "",
    foodType: "prepared",
    foodDescription: "",
    quantity: {
      value: "",
      unit: "kg",
    },
    storageRequirements: "refrigerated",
    pickupDate: "",
    specialInstructions: "",
    estimatedShelfLife: "24",
    mealCount: "",
    dietaryRestrictions: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    organization: "",
    frequency: "one-time",
    days: [],
    pickupTime: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const stats = [
    {
      name: "Total Donations",
      value: donations.length,
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Meals Donated",
      value: donations.reduce((sum, d) => sum + (d.mealCount || 0), 0),
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Scheduled Pickups",
      value: scheduledPickups.length,
      change: "+2",
      changeType: "positive",
    },
    {
      name: "Partner Organizations",
      value: organizations.length,
      change: "0",
      changeType: "neutral",
    },
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
      const [donationsRes, orgsRes, pickupsRes] = await Promise.all([
        axios.get(`${API_URL}/donations`, getAuthHeaders()),
        axios.get(`${API_URL}/organisations`, getAuthHeaders()),
        axios.get(`${API_URL}/pickups`, getAuthHeaders()),
      ]);
      console.log("org::",orgsRes.data.data)
      setDonations(donationsRes.data.data);
      setOrganizations(
        orgsRes.data.data.map((org) => ({
          id: org._id,
          name: org.orgName,
          category: org.category,
          logo: org.orgName
            .split(" ")
            .map((n) => n[0])
            .join(""),
        }))
      );
      setScheduledPickups(pickupsRes.data.data);

      setLoading({
        donations: false,
        organizations: false,
        pickups: false,
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

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert quantity value to number and mealCount to number
      const requestData = {
        ...foodDonation,
        quantity: {
          value: Number(foodDonation.quantity.value),
          unit: foodDonation.quantity.unit,
        },
        mealCount: foodDonation.mealCount
          ? Number(foodDonation.mealCount)
          : null,
        estimatedShelfLife: Number(foodDonation.estimatedShelfLife),
      };

      await axios.post(`${API_URL}/donations`, requestData, getAuthHeaders());

      toast.success("Food donation submitted successfully!");
      setShowDonationModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error submitting food donation:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit food donation"
      );
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pickups`, scheduleForm, getAuthHeaders());
      toast.success("Pickup schedule created successfully!");
      setShowScheduleModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating pickup schedule:", err);
      toast.error(
        err.response?.data?.message || "Failed to create pickup schedule"
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
  const toggleDaySelection = (day) => {
    setScheduleForm((prev) => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const cancelPickup = async (pickupId) => {
    if (window.confirm("Are you sure you want to cancel this pickup?")) {
      try {
        await axios.delete(`${API_URL}/pickups/${pickupId}`, getAuthHeaders());
        toast.success("Pickup cancelled successfully");
        fetchDashboardData();
      } catch (err) {
        console.error("Error cancelling pickup:", err);
        toast.error("Failed to cancel pickup");
      }
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Pickup Schedule
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
                  Organizations
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
                  Reports
                </a>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <Link to={"/restaurant-dashboard/profile"}>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {userData?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "R"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {userData?.name || "Restaurant"}
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
                    Restaurant Dashboard
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
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-xl overflow-hidden mb-8">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Welcome back, {userData.name}!
                        </h2>
                        <p className="mt-1 text-green-100 max-w-lg">
                          Thank you for helping reduce food waste and feed those
                          in need.
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <button
                          onClick={() => setShowDonationModal(true)}
                          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Donate Food
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
                          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
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
                      onClick={() => setShowDonationModal(true)}
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Donate Food
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Donate excess food to organizations in need
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setShowScheduleModal(true)}
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Schedule Pickup
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Set up recurring food pickups
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {}}
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
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Generate Report
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            View your donation impact reports
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
                          Recent Donations
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        {donations.length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No donations yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Get started by donating your excess food.
                            </p>
                            <div className="mt-6">
                              <button
                                onClick={() => setShowDonationModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <svg
                                  className="-ml-1 mr-2 h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                New Donation
                              </button>
                            </div>
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {donations.slice(0, 5).map((donation) => (
                              <li key={donation._id}>
                                <div className="px-4 py-4 sm:px-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-medium">
                                          {donation.organization?.name?.charAt(
                                            0
                                          ) || "O"}
                                        </span>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {donation.organization?.name ||
                                            "Organization"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {donation.foodType} -{" "}
                                          {donation.foodDescription}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <div className="text-sm font-semibold text-gray-900">
                                        {donation.quantity.value}{" "}
                                        {donation.quantity.unit}
                                      </div>
                                      {donation.mealCount && (
                                        <div className="text-xs text-gray-500">
                                          {donation.mealCount} meals
                                        </div>
                                      )}
                                      <div className="text-xs text-gray-500">
                                        {new Date(
                                          donation.pickupDate
                                        ).toLocaleDateString()}
                                      </div>
                                      <span
                                        className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${
                                          donation.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : donation.status === "scheduled"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
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
                        )}
                      </div>
                      {donations.length > 0 && (
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                          <div className="text-sm">
                            <a
                              href="#"
                              className="font-medium text-green-600 hover:text-green-500"
                            >
                              View all donations
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Pickups */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Scheduled Pickups
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        {scheduledPickups.length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No scheduled pickups
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Set up recurring pickups for your excess food.
                            </p>
                            <div className="mt-6">
                              <button
                                onClick={() => setShowScheduleModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <svg
                                  className="-ml-1 mr-2 h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Schedule Pickup
                              </button>
                            </div>
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {scheduledPickups.slice(0, 5).map((pickup) => (
                              <li key={pickup._id}>
                                <div className="px-4 py-4 sm:px-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                          {pickup.organization?.name?.charAt(
                                            0
                                          ) || "O"}
                                        </span>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {pickup.organization?.name ||
                                            "Organization"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {pickup.frequency === "one-time"
                                            ? "One-time"
                                            : `Weekly (${pickup.days.join(
                                                ", "
                                              )})`}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <div className="text-sm text-gray-500">
                                        {pickup.pickupTime}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(
                                          pickup.startDate
                                        ).toLocaleDateString()}
                                        {pickup.endDate &&
                                          ` - ${new Date(
                                            pickup.endDate
                                          ).toLocaleDateString()}`}
                                      </div>
                                      <button
                                        onClick={() => cancelPickup(pickup._id)}
                                        className="mt-1 text-xs text-red-600 hover:text-red-900"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {scheduledPickups.length > 0 && (
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                          <div className="text-sm">
                            <a
                              href="#"
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              View all pickups
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Partner Organizations */}
                <div className="mt-8">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Partner Organizations
                      </h3>
                    </div>
                    <div className="bg-white overflow-hidden">
                      {organizations.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No partner organizations
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Connect with food banks and charities in your area.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                          {organizations.map((org) => (
                            <div
                              key={org.id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">
                                    {org.logo}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {org.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {org.category}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={() => {
                                    setFoodDonation({
                                      ...foodDonation,
                                      organization: org.id,
                                    });
                                    setShowDonationModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Donate
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Food Donation Modal */}
      {showDonationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Donate Food
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Fill out the form below to donate your excess food.
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={handleDonationSubmit}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Organization
                    </label>
                    <select
                      id="organization"
                      name="organization"
                      required
                      value={foodDonation.organization}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          organization: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select an organization</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="foodType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Food Type
                    </label>
                    <select
                      id="foodType"
                      name="foodType"
                      required
                      value={foodDonation.foodType}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          foodType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="prepared">Prepared Food</option>
                      <option value="perishable">Perishable</option>
                      <option value="non-perishable">Non-Perishable</option>
                      <option value="produce">Produce</option>
                      <option value="dairy">Dairy</option>
                      <option value="meat">Meat</option>
                      <option value="baked">Baked Goods</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="foodDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Food Description
                    </label>
                    <input
                      type="text"
                      name="foodDescription"
                      id="foodDescription"
                      required
                      value={foodDonation.foodDescription}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          foodDescription: e.target.value,
                        })
                      }
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="quantityValue"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantityValue"
                        id="quantityValue"
                        required
                        min="1"
                        value={foodDonation.quantity.value}
                        onChange={(e) =>
                          setFoodDonation({
                            ...foodDonation,
                            quantity: {
                              ...foodDonation.quantity,
                              value: e.target.value,
                            },
                          })
                        }
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quantityUnit"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Unit
                      </label>
                      <select
                        id="quantityUnit"
                        name="quantityUnit"
                        value={foodDonation.quantity.unit}
                        onChange={(e) =>
                          setFoodDonation({
                            ...foodDonation,
                            quantity: {
                              ...foodDonation.quantity,
                              unit: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="liters">Liters</option>
                        <option value="gallons">Gallons</option>
                        <option value="units">Units</option>
                        <option value="trays">Trays</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mealCount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estimated Meal Count (optional)
                    </label>
                    <input
                      type="number"
                      name="mealCount"
                      id="mealCount"
                      min="1"
                      value={foodDonation.mealCount}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          mealCount: e.target.value,
                        })
                      }
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="storageRequirements"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Storage Requirements
                    </label>
                    <select
                      id="storageRequirements"
                      name="storageRequirements"
                      required
                      value={foodDonation.storageRequirements}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          storageRequirements: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="refrigerated">Refrigerated</option>
                      <option value="frozen">Frozen</option>
                      <option value="room-temperature">Room Temperature</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="estimatedShelfLife"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estimated Shelf Life (hours)
                    </label>
                    <select
                      id="estimatedShelfLife"
                      name="estimatedShelfLife"
                      required
                      value={foodDonation.estimatedShelfLife}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          estimatedShelfLife: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                      <option value="72">72 hours</option>
                      <option value="168">1 week</option>
                      <option value="336">2 weeks</option>
                      <option value="720">1 month</option>
                      <option value="2160">3 months</option>
                      <option value="4320">6 months</option>
                      <option value="8760">1 year</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pickupDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Preferred Pickup Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      name="pickupDate"
                      id="pickupDate"
                      required
                      value={foodDonation.pickupDate}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          pickupDate: e.target.value,
                        })
                      }
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dietaryRestrictions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Dietary Restrictions (if any)
                    </label>
                    <input
                      type="text"
                      name="dietaryRestrictions"
                      id="dietaryRestrictions"
                      value={foodDonation.dietaryRestrictions}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          dietaryRestrictions: e.target.value,
                        })
                      }
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="specialInstructions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows="3"
                      value={foodDonation.specialInstructions}
                      onChange={(e) =>
                        setFoodDonation({
                          ...foodDonation,
                          specialInstructions: e.target.value,
                        })
                      }
                      className="mt-1 shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleDonationSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                >
                  Submit Donation
                </button>
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Pickup Modal */}
      {showScheduleModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Schedule Food Pickup
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Set up a recurring pickup schedule for your food
                      donations.
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={handleScheduleSubmit}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <label
                      htmlFor="scheduleOrganization"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Organization
                    </label>
                    <select
                      id="scheduleOrganization"
                      name="scheduleOrganization"
                      required
                      value={scheduleForm.organization}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          organization: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select an organization</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="frequency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      name="frequency"
                      required
                      value={scheduleForm.frequency}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          frequency: e.target.value,
                          days:
                            e.target.value === "one-time"
                              ? []
                              : scheduleForm.days,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="one-time">One-time</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  {scheduleForm.frequency === "weekly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Days
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDaySelection(day)}
                            className={`py-2 px-3 text-sm rounded-md ${
                              scheduleForm.days.includes(day)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="pickupTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      name="pickupTime"
                      id="pickupTime"
                      required
                      value={scheduleForm.pickupTime}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          pickupTime: e.target.value,
                        })
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        required
                        value={scheduleForm.startDate}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            startDate: e.target.value,
                          })
                        }
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        End Date (optional)
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={scheduleForm.endDate}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            endDate: e.target.value,
                          })
                        }
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={scheduleForm.notes}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          notes: e.target.value,
                        })
                      }
                      className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleScheduleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Schedule Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}