import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import orgDashboardService from "../service/OrganizationDashboardApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function OrganizationDashboard() {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { userData, fetchUserData } = useAuth();
  

  // Data states
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState({
    donations: true,
    donors: true,
    volunteers: true,
    inventory: true,
    requests: true,
    events: true,
  });

  // Form states
  const [donationForm, setDonationForm] = useState({
    donorId: "",
    foodType: "",
    quantity: "",
    expirationDate: "",
    storageRequirements: "",
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    availability: "",
  });

  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    volunteersNeeded: "",
  });

  const [inventoryForm, setInventoryForm] = useState({
    foodItem: "",
    category: "",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    storageLocation: "",
  });

  const [requestForm, setRequestForm] = useState({
    itemNeeded: "",
    quantity: "",
    urgency: "medium",
    purpose: "",
  });

  // Stats data
  const [stats, setStats] = useState([
    {
      name: "Total Donations",
      value: "0",
      change: "+0%",
      changeType: "neutral",
    },
    {
      name: "Active Volunteers",
      value: "0",
      change: "+0",
      changeType: "neutral",
    },
    {
      name: "Food Inventory",
      value: "0 kg",
      change: "0",
      changeType: "neutral",
    },
    { name: "Upcoming Events", value: "0", change: "0", changeType: "neutral" },
  ]);
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true; // Track component mount status

    const fetchData = async () => {
      try {
        await fetchUserData();
        if (isMounted) {
          await fetchDashboardData(controller.signal);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          console.error("Error:", err);
          toast.error("Failed to load data");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchUserData]);
  const fetchDashboardData = useCallback(async (signal) => {
    try {
      setLoading({
        donations: true,
        donors: true,
        volunteers: true,
        inventory: true,
        requests: true,
        events: true,
      });

      console.log("hello")

      const [
        donationsRes,
        donorsRes,
        volunteersRes,
        inventoryRes,
        requestsRes,
        eventsRes,
        statsRes,
      ] = await Promise.all([
        orgDashboardService.getDonations(signal),
        orgDashboardService.getDonors(signal),
        orgDashboardService.getVolunteers(signal),
        orgDashboardService.getInventory(signal),
        orgDashboardService.getRequests(signal),
        orgDashboardService.getEvents(signal),
        orgDashboardService.getStats(signal),
      ]);

      console.log("donations:",donationsRes)

      // Only update state if component is still mounted and request wasn't aborted
      if (!signal.aborted) {
        setDonations(
          donationsRes.data.data.donations.map((d) => ({
            ...d,
            date: new Date(d.date).toLocaleDateString(),
            expirationDate: new Date(d.expirationDate).toLocaleDateString(),
          }))
        );



        setDonors(donorsRes.data.data.donors);
        setVolunteers(volunteersRes.data.data.volunteers);
        setInventory(
          inventoryRes.data.data.inventory.map((i) => ({
            ...i,
            expiryDate: new Date(i.expiryDate).toLocaleDateString(),
          }))
        );
        setRequests(requestsRes.data.data.requests);
        setEvents(
          eventsRes.data.data.events.map((e) => ({
            ...e,
            date: new Date(e.date).toLocaleDateString(),
          }))
        );

        setStats([
          {
            name: "Total Donations",
            value: `${statsRes.data.data.totalDonations}`,
            change: statsRes.data.data.donationChange,
            changeType: statsRes.data.data.donationChange.startsWith("+")
              ? "positive"
              : "negative",
          },
          {
            name: "Active Volunteers",
            value: `${statsRes.data.data.activeVolunteers}`,
            change: statsRes.data.data.volunteerChange,
            changeType: statsRes.data.data.volunteerChange.startsWith("+")
              ? "positive"
              : "negative",
          },
          {
            name: "Food Inventory",
            value: `${statsRes.data.data.totalInventory} kg`,
            change: statsRes.data.data.inventoryChange,
            changeType: statsRes.data.data.inventoryChange.startsWith("+")
              ? "positive"
              : "negative",
          },
          {
            name: "Upcoming Events",
            value: `${statsRes.data.data.upcomingEvents}`,
            change: statsRes.data.data.eventChange,
            changeType: statsRes.data.data.eventChange.startsWith("+")
              ? "positive"
              : "negative",
          },
        ]);

        setLoading({
          donations: false,
          donors: false,
          volunteers: false,
          inventory: false,
          requests: false,
          events: false,
        });
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.log("failed")
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data");
        setLoading({
          donations: false,
          donors: false,
          volunteers: false,
          inventory: false,
          requests: false,
          events: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        // First fetch user data
        await fetchUserData();

        // Then fetch dashboard data if component is still mounted
        if (isMounted) {
          await fetchDashboardData(controller.signal);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          console.error("Error:", err);
          toast.error("Failed to load data");
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchUserData, fetchDashboardData]);

  // Update your form handlers to use the abort controller
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();

    try {
      await orgDashboardService.recordDonation(donationForm, {
        signal: controller.signal,
      });
      toast.success("Donation recorded successfully");
      setShowDonationModal(false);
      fetchDashboardData(new AbortController().signal);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error recording donation:", err);
        toast.error("Failed to record donation");
      }
    }

    return () => controller.abort();
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.addVolunteer(volunteerForm);
      toast.success("Volunteer added successfully");
      setShowVolunteerModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error adding volunteer:", err);
      toast.error("Failed to add volunteer");
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.createEvent(eventForm);
      toast.success("Event created successfully");
      setShowEventModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Failed to create event");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.updateInventory(inventoryForm);
      toast.success("Inventory updated successfully");
      setShowInventoryModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating inventory:", err);
      toast.error("Failed to update inventory");
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.createRequest(requestForm);
      toast.success("Request created successfully");
      setShowRequestModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating request:", err);
      toast.error("Failed to create request");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      active: "bg-blue-100 text-blue-800",
      urgent: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
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
                  href="organization-dashboard/donors"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Donors
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Inventory
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Requests
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
            <Link to={"/organization-dashboard/profile"}>
              <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {userData?.orgName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "O"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {userData?.orgName || "Organization"}
                    </p>
                    <p className="text-xs font-medium text-indigo-200">
                      View profile
                    </p>
                  </div>
                </div>
              </div>
            </Link>
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
                    Organization Dashboard
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
                          Welcome, {userData?.orgName || "Organization"}!
                        </h2>
                        <p className="mt-1 text-indigo-100 max-w-lg">
                          Manage your food donation operations and track your
                          impact.
                        </p>
                      </div>
                      <div className="hidden md:block space-x-2">
                        <button
                          onClick={() => setShowDonationModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Record Donation
                        </button>
                        <button
                          onClick={() => setShowRequestModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Create Request
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
                            Record Donation
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Log a new food donation received
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setShowVolunteerModal(true)}
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Add Volunteer
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Register a new volunteer
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setShowInventoryModal(true)}
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
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">
                            Update Inventory
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Add or remove food items
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
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Recent Donations
                          </h3>
                          <button
                            onClick={() => setShowDonationModal(true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + New
                          </button>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {donations.slice(0, 5).map((donation) => (
                            <li key={donation._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                      <span className="text-green-600 font-medium">
                                        {donation.donor?.name?.charAt(0) || "D"}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {donation.donor?.name ||
                                          "Anonymous Donor"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {donation.foodType} ({donation.quantity}{" "}
                                        kg)
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className="text-sm text-gray-500">
                                      Expires: {donation.expirationDate}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Received: {donation.date}
                                    </div>
                                    <StatusBadge status={donation.status} />
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

                  {/* Inventory Summary */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Inventory Summary
                          </h3>
                          <button
                            onClick={() => setShowInventoryModal(true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + Update
                          </button>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {inventory.slice(0, 4).map((item) => (
                            <li key={item._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.foodItem}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.quantity} {item.unit}
                                  </div>
                                </div>
                                <div className="mt-1 flex justify-between">
                                  <div className="text-xs text-gray-500">
                                    Expires: {item.expiryDate}
                                  </div>
                                  <StatusBadge
                                    status={item.quantity < 10 ? "low" : "good"}
                                  />
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
                            View full inventory
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Volunteers and Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  {/* Active Volunteers */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Active Volunteers
                          </h3>
                          <button
                            onClick={() => setShowVolunteerModal(true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {volunteers.slice(0, 4).map((volunteer) => (
                            <li key={volunteer._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                      {volunteer.name?.charAt(0) || "V"}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {volunteer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {volunteer.skills
                                        ?.split(",")
                                        .slice(0, 2)
                                        .join(", ")}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-between">
                                  <div className="text-xs text-gray-500">
                                    Available: {volunteer.availability}
                                  </div>
                                  <StatusBadge
                                    status={volunteer.status || "active"}
                                  />
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
                            View all volunteers
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Requests */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Pending Requests
                          </h3>
                          <button
                            onClick={() => setShowRequestModal(true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + New
                          </button>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {requests.slice(0, 4).map((request) => (
                            <li key={request._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.itemNeeded}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {request.quantity} units
                                  </div>
                                </div>
                                <div className="mt-1 flex justify-between">
                                  <div className="text-xs text-gray-500">
                                    {request.purpose?.substring(0, 30)}...
                                  </div>
                                  <StatusBadge status={request.urgency} />
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
                            View all requests
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Upcoming Events
                          </h3>
                          <button
                            onClick={() => setShowEventModal(true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            + Create
                          </button>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {events.slice(0, 4).map((event) => (
                            <li key={event._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">
                                    {event.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {event.date}
                                  </div>
                                </div>
                                <div className="mt-1 flex justify-between">
                                  <div className="text-xs text-gray-500">
                                    {event.location}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Volunteers: {event.volunteersNeeded}
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
                            View all events
                          </a>
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

      {/* Modals */}
      {/* Donation Modal */}
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
                    Record New Donation
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleDonationSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="donorId"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Donor
                          </label>
                          <select
                            id="donorId"
                            name="donorId"
                            value={donationForm.donorId}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                donorId: e.target.value,
                              })
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select a donor</option>
                            {donors.map((donor) => (
                              <option key={donor._id} value={donor._id}>
                                {donor.name}
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
                          <input
                            type="text"
                            name="foodType"
                            id="foodType"
                            value={donationForm.foodType}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                foodType: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity (kg)
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            value={donationForm.quantity}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                quantity: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="expirationDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            name="expirationDate"
                            id="expirationDate"
                            value={donationForm.expirationDate}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                expirationDate: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="storageRequirements"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Storage Requirements
                          </label>
                          <input
                            type="text"
                            name="storageRequirements"
                            id="storageRequirements"
                            value={donationForm.storageRequirements}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                storageRequirements: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Record Donation
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDonationModal(false)}
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

      {/* Volunteer Modal */}
      {showVolunteerModal && (
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
                    Add New Volunteer
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleVolunteerSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={volunteerForm.name}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                name: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={volunteerForm.email}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                email: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={volunteerForm.phone}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                phone: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="skills"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Skills (comma separated)
                          </label>
                          <input
                            type="text"
                            name="skills"
                            id="skills"
                            value={volunteerForm.skills}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                skills: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="availability"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Availability
                          </label>
                          <input
                            type="text"
                            name="availability"
                            id="availability"
                            value={volunteerForm.availability}
                            onChange={(e) =>
                              setVolunteerForm({
                                ...volunteerForm,
                                availability: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Add Volunteer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowVolunteerModal(false)}
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

      {/* Event Modal */}
      {showEventModal && (
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
                    Create New Event
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleEventSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="eventName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Event Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="eventName"
                            value={eventForm.name}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                name: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="eventDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            id="eventDate"
                            value={eventForm.date}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                date: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={eventForm.location}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                location: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={eventForm.description}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                description: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div>
                          <label
                            htmlFor="volunteersNeeded"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Volunteers Needed
                          </label>
                          <input
                            type="number"
                            name="volunteersNeeded"
                            id="volunteersNeeded"
                            value={eventForm.volunteersNeeded}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                volunteersNeeded: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Create Event
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEventModal(false)}
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

      {/* Inventory Modal */}
      {showInventoryModal && (
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
                    Update Inventory
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleInventorySubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="foodItem"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Food Item
                          </label>
                          <input
                            type="text"
                            name="foodItem"
                            id="foodItem"
                            value={inventoryForm.foodItem}
                            onChange={(e) =>
                              setInventoryForm({
                                ...inventoryForm,
                                foodItem: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            value={inventoryForm.category}
                            onChange={(e) =>
                              setInventoryForm({
                                ...inventoryForm,
                                category: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              value={inventoryForm.quantity}
                              onChange={(e) =>
                                setInventoryForm({
                                  ...inventoryForm,
                                  quantity: e.target.value,
                                })
                              }
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="unit"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Unit
                            </label>
                            <select
                              id="unit"
                              name="unit"
                              value={inventoryForm.unit}
                              onChange={(e) =>
                                setInventoryForm({
                                  ...inventoryForm,
                                  unit: e.target.value,
                                })
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="kg">kg</option>
                              <option value="g">g</option>
                              <option value="lbs">lbs</option>
                              <option value="units">units</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            name="expiryDate"
                            id="expiryDate"
                            value={inventoryForm.expiryDate}
                            onChange={(e) =>
                              setInventoryForm({
                                ...inventoryForm,
                                expiryDate: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="storageLocation"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Storage Location
                          </label>
                          <input
                            type="text"
                            name="storageLocation"
                            id="storageLocation"
                            value={inventoryForm.storageLocation}
                            onChange={(e) =>
                              setInventoryForm({
                                ...inventoryForm,
                                storageLocation: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Update Inventory
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInventoryModal(false)}
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

      {/* Request Modal */}
      {showRequestModal && (
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
                    Create New Request
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleRequestSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="itemNeeded"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Item Needed
                          </label>
                          <input
                            type="text"
                            name="itemNeeded"
                            id="itemNeeded"
                            value={requestForm.itemNeeded}
                            onChange={(e) =>
                              setRequestForm({
                                ...requestForm,
                                itemNeeded: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            value={requestForm.quantity}
                            onChange={(e) =>
                              setRequestForm({
                                ...requestForm,
                                quantity: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="urgency"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Urgency
                          </label>
                          <select
                            id="urgency"
                            name="urgency"
                            value={requestForm.urgency}
                            onChange={(e) =>
                              setRequestForm({
                                ...requestForm,
                                urgency: e.target.value,
                              })
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="purpose"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Purpose
                          </label>
                          <textarea
                            name="purpose"
                            id="purpose"
                            rows="3"
                            value={requestForm.purpose}
                            onChange={(e) =>
                              setRequestForm({
                                ...requestForm,
                                purpose: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Create Request
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRequestModal(false)}
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