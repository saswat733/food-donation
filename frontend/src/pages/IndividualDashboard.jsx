import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import dashboardService from "../service/IndividualDashboardApi";
import { toast } from "react-toastify";


// import { Organization } from "../../../backend/models/userModels";
export default function UserDashboard() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDonationRequestModal, setShowDonationRequestModal] = useState(false);
  const { userData, fetchUserData } = useAuth();
  // const [stats, setStats] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationReq, setDonationReq] = useState([])
  const [donors, setDonors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    // stats: true,
    donations: true,
    donors: true,
    organizations: true,
  });

  const [donationRequest, setDonationRequest] = useState({
    donor: "",
    foodType: "",
    foodDescription: "",
    quantity: "",
    unit: "kg", // default unit
    storageRequirements: "",
    preferredDeliveryDate: "",
    purpose: "",
    specialInstructions: "",
    deliveryAddress: "",
  });


  // Form states
  const [volunteerForm, setVolunteerForm] = useState({
    organization: "",
    skills: "",
    availability: "",
    motivation: "",
  });

  const [serviceForm, setServiceForm] = useState({
    serviceType: "",
    description: "",
    availability: "",
    location: "",
  });

 

  // Mock data
  // const donations = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     amount: 500,
  //     date: "2023-05-15",
  //     status: "Completed",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     amount: 300,
  //     date: "2023-05-10",
  //     status: "Completed",
  //   },
  //   {
  //     id: 3,
  //     name: "Acme Corp",
  //     email: "acme@example.com",
  //     amount: 1000,
  //     date: "2023-05-01",
  //     status: "Pending",
  //   },
  // ];

  // const donors = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     interests: "Education, Poverty",
  //     lastDonation: 500,
  //     avatar: "JD",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     interests: "Healthcare",
  //     lastDonation: 300,
  //     avatar: "JS",
  //   },
  //   {
  //     id: 3,
  //     name: "Acme Corp",
  //     email: "acme@example.com",
  //     interests: "All causes",
  //     lastDonation: 1000,
  //     avatar: "AC",
  //   },
  // ];

  // const organizations = [
  //   { id: 1, name: "Helping Hands", category: "Community Service", logo: "HH" },
  //   { id: 2, name: "Green Earth", category: "Environment", logo: "GE" },
  //   { id: 3, name: "Future Leaders", category: "Education", logo: "FL" },
  // ];

  const stats = [
    { name: 'Total Donations', value: '$1,800', change: '+12%', changeType: 'positive' },
    { name: 'Active Volunteers', value: '24', change: '+4', changeType: 'positive' },
    { name: 'Service Requests', value: '8', change: '-2', changeType: 'negative' },
    { name: 'Upcoming Events', value: '3', change: '0', changeType: 'neutral' },
  ];

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, [fetchUserData]);


    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [donationsRes, donorsRes, orgsRes,requestsRes] = await Promise.all([
          // dashboardService.getDashboardStats(),
          dashboardService.getDonations(),
          dashboardService.getDonors(),
          dashboardService.getOrganizations(),
          dashboardService.getDonationRequests(),
        ]);


        // console.log("orga:",orgsRes.data.data.organizations); 

        // setStats([
        //   {
        //     name: "Total Donations",
        //     value: `$${statsRes.data.data.totalDonations}`,
        //     change: "+12%",
        //     changeType: "positive",
        //   },
        //   {
        //     name: "Active Volunteers",
        //     value: statsRes.data.data.activeVolunteers,
        //     change: "+4",
        //     changeType: "positive",
        //   },
        //   {
        //     name: "Service Requests",
        //     value: statsRes.data.data.serviceRequests,
        //     change: "-2",
        //     changeType: "negative",
        //   },
        //   {
        //     name: "Upcoming Events",
        //     value: statsRes.data.data.upcomingEvents,
        //     change: "0",
        //     changeType: "neutral",
        //   },
        // ]);

        setDonations(donationsRes.data.data.donations);
        setDonors(donorsRes.data.data.donors);
        setDonationReq(requestsRes.data.data.requests);
        // console.log("donations:",donationsRes)
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

        // console.log("Organizations:",organizations)

        setLoading({
          // stats: false,
          donations: false,
          donors: false,
          organizations: false,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Handle error (show error message)
      }
    };


  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dashboardService.submitVolunteerApplication({
        organization: volunteerForm.organization,
        skills: volunteerForm.skills,
        availability: volunteerForm.availability,
        motivation: volunteerForm.motivation,
      });
      console.log("Volunteer application submitted:", response);
      toast.success("volunteer application submitted")
      setShowVolunteerModal(false);
    } catch (err) {
      console.error("Error submitting volunteer application:", err);
      // Handle error (show error message)
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dashboardService.submitServiceOffer({
        serviceType: serviceForm.serviceType,
        description: serviceForm.description,
        availability: serviceForm.availability,
        location: serviceForm.location,
      });
      console.log("Service offer submitted:", response);
      // Handle success
      toast.success("Service offer submitted")
      setShowServiceModal(false);

    } catch (err) {
      console.error("Error submitting service offer:", err);
      // Handle error
    }
  };
  const handleDonationRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dashboardService.requestFoodDonation({
        donor: donationRequest.donor,
        foodType: donationRequest.foodType,
        foodDescription: donationRequest.foodDescription,
        quantity: {
          value: donationRequest.quantity,
          unit: donationRequest.unit,
        },
        storageRequirements: donationRequest.storageRequirements,
        preferredDeliveryDate: donationRequest.preferredDeliveryDate,
        purpose: donationRequest.purpose,
        specialInstructions: donationRequest.specialInstructions || undefined,
        deliveryAddress: donationRequest.deliveryAddress || undefined,
      });

      toast.success("Food donation request submitted successfully!");
      setShowDonationRequestModal(false);
      // Refresh data if needed
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
                      aria-hidden="true"
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
                          Welcome back, {userData?.name || "User"}!
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
                          Recent Donations
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {donations.map((donation) => (
                            <li key={donation.id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <span className="text-indigo-600 font-medium">
                                        {"s"}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {donation.donor.email}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {donation.purpose}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className="text-sm font-semibold text-gray-900">
                                      ${donation.amount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {donation.date}
                                    </div>
                                    <span
                                      className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${
                                        donation.status === "Completed"
                                          ? "bg-green-100 text-green-800"
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
                          {organizations.map((org) => (
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
                                        ...volunteerForm,
                                        organization: org.id,
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
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Browse all organizations
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

      {/* Volunteer Application Modal */}
      {showVolunteerModal && (
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
                      Volunteer Application
                    </h3>
                    <form onSubmit={handleVolunteerSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="organization"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Organization
                        </label>
                        <select
                          id="organization"
                          value={volunteerForm.organization}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              organization: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

                      <div className="mb-4">
                        <label
                          htmlFor="skills"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Skills
                        </label>
                        <textarea
                          id="skills"
                          rows={3}
                          value={volunteerForm.skills}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              skills: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="List your relevant skills"
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
                          value={volunteerForm.availability}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              availability: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Days and times you're available"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="motivation"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Motivation
                        </label>
                        <textarea
                          id="motivation"
                          rows={3}
                          value={volunteerForm.motivation}
                          onChange={(e) =>
                            setVolunteerForm({
                              ...volunteerForm,
                              motivation: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Why do you want to volunteer with this organization?"
                          required
                        />
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Submit Application
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
      {/* Donation Request Modal */}
      {showDonationRequestModal && (
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
                      Request Food Donation
                    </h3>
                    <form onSubmit={handleDonationRequestSubmit}>
                      {/* Donor Selection */}
                      <div className="mb-4">
                        <label
                          htmlFor="donor"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Donor (Organization)
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
                          Type of Food
                        </label>
                        <input
                          type="text"
                          id="foodType"
                          value={donationRequest.foodType}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              foodType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g., Rice, Pasta, Fresh Vegetables"
                          required
                        />
                      </div>

                      {/* Food Description */}
                      <div className="mb-4">
                        <label
                          htmlFor="foodDescription"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Food Description
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
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quantity
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="number"
                              id="quantity"
                              min="1"
                              value={donationRequest.quantity}
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  quantity: e.target.value,
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
                              value={donationRequest.unit}
                              onChange={(e) =>
                                setDonationRequest({
                                  ...donationRequest,
                                  unit: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            >
                              <option value="">Unit</option>
                              <option value="kg">Kilograms</option>
                              <option value="lbs">Pounds</option>
                              <option value="units">Units</option>
                              <option value="liters">Liters</option>
                              <option value="packets">Packets</option>
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
                          Storage Requirements
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
                          <option value="">Select storage needs</option>
                          <option value="refrigerated">Refrigerated</option>
                          <option value="frozen">Frozen</option>
                          <option value="dry storage">Dry Storage</option>
                          <option value="room temperature">
                            Room Temperature
                          </option>
                        </select>
                      </div>

                      {/* Preferred Delivery Date */}
                      <div className="mb-4">
                        <label
                          htmlFor="preferredDeliveryDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preferred Delivery Date
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
                          Purpose
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

                      {/* Delivery Address */}
                      <div className="mb-4">
                        <label
                          htmlFor="deliveryAddress"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Delivery Address (Optional)
                        </label>
                        <textarea
                          id="deliveryAddress"
                          rows={2}
                          value={donationRequest.deliveryAddress}
                          onChange={(e) =>
                            setDonationRequest({
                              ...donationRequest,
                              deliveryAddress: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="If different from your organization's address"
                        />
                      </div>

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
