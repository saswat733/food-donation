import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import orgDashboardService from "../service/OrganizationDashboardApi";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function OrganizationDashboard() {
  const { userData, fetchUserData } = useAuth();
  const navigate = useNavigate();
  // Modal states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showIncomingDonationModal, setShowIncomingDonationModal] =
    useState(false);
  const [incomingDonations, setIncomingDonations] = useState([]);
  // Selected items for processing
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedIncomingDonation, setSelectedIncomingDonation] =
    useState(null);

  // Status states
  const [applicationStatus, setApplicationStatus] = useState("approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [incomingDonationStatus, setIncomingDonationStatus] =
    useState("pending");

  // Data states
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState({
    donations: true,
    donors: true,
    volunteers: true,
    inventory: true,
    requests: true,
    events: true,
    applications: true,
    incomingDonations: true,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("user",user)
  // Form states
  const [donationForm, setDonationForm] = useState({
    donor: "",
    foodType: "",
    quantity: "",
    expirationDate: "",
    storageRequirements: "",
    status: "pending",
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    availability: "flexible",
    // status: "active"
  });

  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    volunteersNeeded: "",
    status: "upcoming",
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
    status: "pending",
  });

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home page
    navigate("/");
  };
  const [donorForm, setDonorForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
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
      name: "Upcoming Events",
      value: "0",
      change: "0",
      changeType: "neutral",
    },
  ]);
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading({
        donations: true,
        donors: true,
        volunteers: true,
        inventory: true,
        requests: true,
        events: true,
        applications: true,
        incomingDonations: true,
      });

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const [
        donationsRes,
        donorsRes,
        volunteersRes,
        inventoryRes,
        requestsRes,
        eventsRes,
        statsRes,
        applicationsRes,
        incomingDonationsRes,
      ] = await Promise.all([
        fetch(`${baseUrl}/org/donations`, { headers }).then((res) =>
          res.json()
        ),
        fetch(`${baseUrl}/org/donors`, { headers }).then((res) => res.json()),
        fetch(`${baseUrl}/org/volunteers`, { headers }).then((res) =>
          res.json()
        ),
        fetch(`${baseUrl}/org/inventory`, { headers }).then((res) =>
          res.json()
        ),
        fetch(`${baseUrl}/org/requests`, { headers }).then((res) => res.json()),
        fetch(`${baseUrl}/org/events`, { headers }).then((res) => res.json()),
        fetch(`${baseUrl}/org/stats`, { headers }).then((res) => res.json()),
        fetch(`${baseUrl}/org/volunteer-applications`, { headers }).then(
          (res) => res.json()
        ),
        fetch(`${baseUrl}/org/incoming-donations`, { headers }).then((res) =>
          res.json()
        ),
      ]);

      setDonations(
        donationsRes.data.donations.map((d) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString(),
          expirationDate: new Date(d.expirationDate).toLocaleDateString(),
        }))
      );

      setDonors(donorsRes.data.donors);

      console.log("donors::", donors);
      setVolunteers(volunteersRes.data.volunteers);
      setInventory(
        inventoryRes.data.inventory.map((i) => ({
          ...i,
          expiryDate: new Date(i.expiryDate).toLocaleDateString(),
        }))
      );
      setRequests(requestsRes.data.requests);
      setEvents(
        eventsRes.data.events.map((e) => ({
          ...e,
          date: new Date(e.date).toLocaleDateString(),
        }))
      );

      console.log("stats:", statsRes);
      setStats([
        {
          name: "Total Donations",
          value: `${statsRes?.data?.stats?.totalDonations ?? 0}`,
          change: statsRes?.data?.stats?.donationChange ?? "+0%",
          changeType: statsRes?.data?.stats?.donationChange?.startsWith("+")
            ? "positive"
            : "negative",
        },
        {
          name: "Active Volunteers",
          value: `${statsRes?.data?.stats?.activeVolunteers ?? 0}`,
          change: statsRes?.data?.stats?.volunteerChange ?? "+0%",
          changeType: statsRes?.data?.stats?.volunteerChange?.startsWith("+")
            ? "positive"
            : "negative",
        },

        {
          name: "Upcoming Events",
          value: `${statsRes?.data?.stats?.upcomingEvents ?? 0}`,
          change: statsRes?.data?.stats?.eventChange ?? "+0%",
          changeType: statsRes?.data?.stats?.eventChange?.startsWith("+")
            ? "positive"
            : "negative",
        },
      ]);
      setApplications(applicationsRes.data.applications);
      setIncomingDonations(incomingDonationsRes.data.donations || []);
      setLoading({
        donations: false,
        donors: false,
        volunteers: false,
        inventory: false,
        requests: false,
        events: false,
        applications: false,
        incomingDonations: false,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
      setLoading({
        donations: false,
        donors: false,
        volunteers: false,
        inventory: false,
        requests: false,
        events: false,
        applications: false,
        incomingDonations: false,
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        await fetchUserData();
        if (isMounted) {
          await fetchDashboardData();
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error:", err);
          toast.error("Failed to load data");
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchUserData, fetchDashboardData]);

  // Application handlers
  const handleApplicationStatusUpdate = async () => {
    try {
      await orgDashboardService.updateApplicationStatus(
        selectedApplication._id,
        applicationStatus,
        rejectionReason
      );
      toast.success("Application status updated successfully");
      setShowApplicationModal(false);
      setSelectedApplication(null);
      setApplicationStatus("approved");
      setRejectionReason("");
      fetchDashboardData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  };

  const processApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  // Donation handlers
  const handleIncomingDonationStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/org/incoming-donations/${
          selectedIncomingDonation._id
        }`,
        { status: incomingDonationStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success("Donation status updated successfully");
        setShowIncomingDonationModal(false);
        setSelectedIncomingDonation(null);
        setIncomingDonationStatus("pending");

        // Refresh the incoming donations list
        const donationsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/org/incoming-donations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setIncomingDonations(donationsResponse.data.data.donations || []);
      } else {
        throw new Error(
          response.data.message || "Failed to update donation status"
        );
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update donation status"
      );
    }
  };

  const updateDonationStatus = (donation) => {
    console.log("donation:", donation);
    setSelectedIncomingDonation(donation);
    setIncomingDonationStatus(donation.status);
    setShowIncomingDonationModal(true);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !donationForm.donor ||
      !donationForm.foodType ||
      !donationForm.quantity ||
      !donationForm.expirationDate ||
      !donationForm.status
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate quantity is a positive number
    const quantity = parseFloat(donationForm.quantity);
    if (isNaN(quantity)) {
      toast.error("Quantity must be a valid number");
      return;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    // Validate expiration date is in the future
    const today = new Date();
    const expirationDate = new Date(donationForm.expirationDate);
    if (expirationDate <= today) {
      toast.error("Expiration date must be in the future");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Prepare the donation data
      const donationData = {
        donor: donationForm.donor === "anonymous" ? null : donationForm.donor,
        foodType: donationForm.foodType,
        quantity: quantity,
        expirationDate: donationForm.expirationDate,
        storageRequirements:
          donationForm.storageRequirements || "None specified",
        status: donationForm.status,
        organization: user._id,
      };

      // Make the API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/org/donations`,
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (!response) {
        throw new Error(response.data.message || "Failed to record donation");
      }

      // Show success message
      toast.success("Donation recorded successfully");

      // Reset the form
      setDonationForm({
        donor: "",
        foodType: "",
        quantity: "",
        expirationDate: "",
        storageRequirements: "",
        status: "pending",
      });

      // Close the modal
      setShowDonationModal(false);

      // Refresh the donations data
      try {
        const donationsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/org/donations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (donationsResponse.data?.data?.donations) {
          setDonations(
            donationsResponse.data.data.donations.map((d) => ({
              ...d,
              date: new Date(d.date).toLocaleDateString(),
              expirationDate: new Date(d.expirationDate).toLocaleDateString(),
            }))
          );
        }
      } catch (refreshError) {
        console.error("Error refreshing donations:", refreshError);
        toast.error("Donation recorded but failed to refresh list");
      }
    } catch (err) {
      console.error("Donation submission error:", err);

      let errorMessage = "Failed to record donation";
      if (err.response) {
        // Server responded with a status code outside 2xx
        errorMessage =
          err.response.data?.message ||
          err.response.statusText ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (err.message) {
        // Something happened in setting up the request
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!volunteerForm.name || !volunteerForm.email || !volunteerForm.phone) {
        toast.error("Name, email and phone are required");
        return;
      }

      // Process skills string into array
      const skillsArray = volunteerForm.skills
        ? volunteerForm.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill)
        : [];

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Prepare volunteer data
      const volunteerData = {
        name: volunteerForm.name,
        email: volunteerForm.email,
        phone: volunteerForm.phone,
        skills: skillsArray,
        availability: volunteerForm.availability,
        organization: user._id, // Include organization ID
        source: "manual", // Mark as manually added
      };
      console.log("volunteerData:", volunteerData);
      // Make API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/org/volunteers`,
        volunteerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response:", response);

      if (response.data) {
        toast.success("Volunteer added successfully");

        // Reset form
        setVolunteerForm({
          name: "",
          email: "",
          phone: "",
          skills: "",
          availability: "flexible",
        });

        // Close modal
        setShowVolunteerModal(false);

        // Refresh volunteers list
        const volunteersResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/org/volunteers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setVolunteers(volunteersResponse.data.data.volunteers || []);
      } else {
        throw new Error("Failed to add volunteer");
      }
    } catch (err) {
      console.error("Error adding volunteer:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to add volunteer"
      );

      // Keep the modal open on error so user can correct the input
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.createEvent({
        ...eventForm,
        volunteersNeeded: parseInt(eventForm.volunteersNeeded),
        organization: userData._id,
      });
      toast.success("Event created successfully");
      setShowEventModal(false);
      setEventForm({
        name: "",
        date: "",
        location: "",
        description: "",
        volunteersNeeded: "",
        status: "upcoming",
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (donorForm._id) {
        await orgDashboardService.updateDonor(donorForm._id, {
          ...donorForm,
          organization: userData._id,
        });
        toast.success("Donor updated successfully");
      } else {
        await orgDashboardService.createDonor({
          ...donorForm,
          organization: userData._id,
        });
        toast.success("Donor added successfully");
      }
      setShowDonorModal(false);
      setDonorForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save donor");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.updateInventory({
        ...inventoryForm,
        quantity: parseFloat(inventoryForm.quantity),
        organization: userData._id,
      });
      toast.success("Inventory updated successfully");
      setShowInventoryModal(false);
      setInventoryForm({
        foodItem: "",
        category: "",
        quantity: "",
        unit: "kg",
        expiryDate: "",
        storageLocation: "",
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating inventory:", err);
      toast.error(err.response?.data?.message || "Failed to update inventory");
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await orgDashboardService.createRequest({
        ...requestForm,
        quantity: parseFloat(requestForm.quantity),
        organization: userData._id,
      });
      toast.success("Request created successfully");
      setShowRequestModal(false);
      setRequestForm({
        itemNeeded: "",
        quantity: "",
        urgency: "medium",
        purpose: "",
        status: "pending",
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating request:", err);
      toast.error(err.response?.data?.message || "Failed to create request");
    }
  };

  // Donor management functions
  const editDonor = (donor) => {
    setDonorForm({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      notes: donor.notes || "",
    });
    setShowDonorModal(true);
  };

  const deleteDonor = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await orgDashboardService.deleteDonor(id);
        toast.success("Donor deleted successfully");
        fetchDashboardData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete donor");
      }
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      received: "bg-blue-100 text-blue-800",
      distributed: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      on_leave: "bg-purple-100 text-purple-800",
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      fulfilled: "bg-green-100 text-green-800",
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
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
                  href="organization-dashboard/donations"
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
                  href="organization-dashboard/volunteers"
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
                  href=""
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
                <div className="flex items-center space-x-4">
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
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Donations */}
                  {/* Recent Incoming Donations */}
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Recent Incoming Donations
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {incomingDonations.slice(0, 3).map((donation) => (
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
                                        {donation.foodType} (
                                        {donation.quantity?.value}{" "}
                                        {donation.quantity?.unit})
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <StatusBadge status={donation.status} />
                                    <div className="mt-2 flex justify-between">
                                      <div className="text-xs text-gray-500">
                                        Requested:{" "}
                                        {new Date(
                                          donation.requestDate
                                        ).toLocaleDateString()}
                                      </div>
                                      <button
                                        onClick={() =>
                                          updateDonationStatus(donation)
                                        }
                                        className="text-xs text-indigo-600 hover:text-indigo-900 ml-2"
                                      >
                                        Update Status
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <Link
                            to="/organization-dashboard/donations"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all incoming donations (
                            {incomingDonations.length})
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Volunteer Applications */}
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Volunteer Applications
                        </h3>
                      </div>
                      <div className="bg-white overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {applications.slice(0, 2).map((application) => (
                            <li key={application._id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium">
                                        {application.user?.name?.charAt(0) ||
                                          "A"}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {application.user?.name || "Applicant"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Skills:{" "}
                                        {application.skills?.join(", ") ||
                                          "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <StatusBadge status={application.status} />
                                    <div className="mt-2 flex justify-between">
                                      <div className="text-xs text-gray-500">
                                        Applied:{" "}
                                        {new Date(
                                          application.createdAt
                                        ).toLocaleDateString()}
                                      </div>
                                      <button
                                        onClick={() =>
                                          processApplication(application)
                                        }
                                        className="text-xs text-indigo-600 hover:text-indigo-900 ml-2"
                                      >
                                        Process
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <Link
                            to="/organization-dashboard/volunteers"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all applications ({applications.length})
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Volunteers and Requests */}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Modals */}
      {showDonationModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Record New Donation
                    </h3>
                    <div className="mt-4">
                      <form
                        onSubmit={handleDonationSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="donor"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Donor
                            </label>

                            <select
                              id="donor"
                              name="donor"
                              value={donationForm.donor}
                              onChange={(e) =>
                                setDonationForm({
                                  ...donationForm,
                                  donor: e.target.value,
                                })
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              required
                            >
                              <option value="">Select a donor</option>
                              {donors.map((donor) => (
                                <option key={donor._id} value={donor._id}>
                                  {donor.name}
                                </option>
                              ))}
                              <option value="anonymous">Anonymous Donor</option>
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
                              required
                              placeholder="e.g. Rice, Vegetables, Fruits"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quantity
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
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
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="unit" className="sr-only">
                                  Unit
                                </label>
                                <select
                                  id="unit"
                                  name="unit"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                  value={donationForm.unit || "kg"}
                                  onChange={(e) =>
                                    setDonationForm({
                                      ...donationForm,
                                      unit: e.target.value,
                                    })
                                  }
                                >
                                  <option value="kg">kg</option>
                                  <option value="g">g</option>
                                  <option value="lbs">lbs</option>
                                  <option value="units">units</option>
                                </select>
                              </div>
                            </div>
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
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={donationForm.status}
                              onChange={(e) =>
                                setDonationForm({
                                  ...donationForm,
                                  status: e.target.value,
                                })
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              required
                            >
                              <option value="pending">Pending</option>
                              <option value="received">Received</option>
                              <option value="distributed">Distributed</option>
                              <option value="expired">Expired</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="storageRequirements"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Storage Requirements
                          </label>
                          <textarea
                            name="storageRequirements"
                            id="storageRequirements"
                            rows={3}
                            value={donationForm.storageRequirements}
                            onChange={(e) =>
                              setDonationForm({
                                ...donationForm,
                                storageRequirements: e.target.value,
                              })
                            }
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="e.g. Refrigerated, Dry Storage, Frozen"
                          />
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Record Donation
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDonationModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
        </div>
      )}
      {showVolunteerModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Volunteer
                    </h3>
                    <div className="mt-4">
                      <form
                        onSubmit={handleVolunteerSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                              placeholder="John Doe"
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
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone Number
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
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="availability"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Availability
                            </label>
                            <select
                              id="availability"
                              name="availability"
                              value={volunteerForm.availability}
                              onChange={(e) =>
                                setVolunteerForm({
                                  ...volunteerForm,
                                  availability: e.target.value,
                                })
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              required
                            >
                              <option value="weekdays">Weekdays</option>
                              <option value="weekends">Weekends</option>
                              <option value="both">Both</option>
                              <option value="flexible">Flexible</option>
                            </select>
                          </div>
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
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="e.g. Cooking, Driving, First Aid"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Separate multiple skills with commas
                          </p>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Add Volunteer
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowVolunteerModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
        </div>
      )}

      {showIncomingDonationModal && selectedIncomingDonation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Modal backdrop */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Update Donation Status
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Donor: {selectedIncomingDonation.donor?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Food Type: {selectedIncomingDonation.foodType || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {selectedIncomingDonation.quantity?.value}{" "}
                    {selectedIncomingDonation.quantity?.unit}
                  </p>
                  <p className="text-sm text-gray-500">
                    Current Status:{" "}
                    <StatusBadge status={selectedIncomingDonation.status} />
                  </p>

                  <div className="text-sm text-gray-500 mt-2">
                    <p className="font-medium">Delivery Address:</p>
                    <p>
                      {selectedIncomingDonation.deliveryAddress.street || "N/A"}
                    </p>
                    <p>
                      {selectedIncomingDonation.deliveryAddress.city},{" "}
                      {selectedIncomingDonation.deliveryAddress.state}{" "}
                      {selectedIncomingDonation.deliveryAddress.postalCode}
                    </p>
                    <p>{selectedIncomingDonation.deliveryAddress.country}</p>

                    {/* Map Preview with link to Google Maps */}
                    {selectedIncomingDonation.deliveryAddress.street && (
                      <div className="mt-3">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${selectedIncomingDonation.deliveryAddress.street}, ${selectedIncomingDonation.deliveryAddress.city}, ${selectedIncomingDonation.deliveryAddress.state} ${selectedIncomingDonation.deliveryAddress.postalCode}, ${selectedIncomingDonation.deliveryAddress.country}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                              `${selectedIncomingDonation.deliveryAddress.street}, ${selectedIncomingDonation.deliveryAddress.city}, ${selectedIncomingDonation.deliveryAddress.state}`
                            )}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${encodeURIComponent(
                              `${selectedIncomingDonation.deliveryAddress.street}, ${selectedIncomingDonation.deliveryAddress.city}, ${selectedIncomingDonation.deliveryAddress.state}`
                            )}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                            alt="Map location"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          />
                          <p className="text-xs text-blue-500 mt-1 text-center">
                            Click to open in Google Maps
                          </p>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={incomingDonationStatus}
                    onChange={(e) => setIncomingDonationStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="scheduled">Scheduled for Pickup</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleIncomingDonationStatusUpdate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Update Status
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIncomingDonationModal(false);
                      setSelectedIncomingDonation(null);
                      setIncomingDonationStatus("pending");
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApplicationModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Modal backdrop */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Process Volunteer Application
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Applicant: {selectedApplication.user?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {selectedApplication.user?.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Skills: {selectedApplication.skills?.join(", ") || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Availability: {selectedApplication.availability || "N/A"}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Application Status
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="approved"
                        name="status"
                        type="radio"
                        checked={applicationStatus === "approved"}
                        onChange={() => setApplicationStatus("approved")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="approved"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Approved
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="rejected"
                        name="status"
                        type="radio"
                        checked={applicationStatus === "rejected"}
                        onChange={() => setApplicationStatus("rejected")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="rejected"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Rejected
                      </label>
                    </div>
                  </div>

                  {applicationStatus === "rejected" && (
                    <div className="mt-2">
                      <label
                        htmlFor="rejectionReason"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Rejection Reason
                      </label>
                      <textarea
                        id="rejectionReason"
                        name="rejectionReason"
                        rows="3"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                  )}
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleApplicationStatusUpdate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Update Status
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplicationModal(false);
                      setSelectedApplication(null);
                      setApplicationStatus("approved");
                      setRejectionReason("");
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDonorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Modal backdrop */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {donorForm._id ? "Update Donor" : "Add New Donor"}
                </h3>
                <form onSubmit={handleDonorSubmit}>
                  <div className="space-y-4 mt-4">
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
                        value={donorForm.name}
                        onChange={(e) =>
                          setDonorForm({ ...donorForm, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
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
                        value={donorForm.email}
                        onChange={(e) =>
                          setDonorForm({ ...donorForm, email: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
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
                        value={donorForm.phone}
                        onChange={(e) =>
                          setDonorForm({ ...donorForm, phone: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        rows="3"
                        value={donorForm.address}
                        onChange={(e) =>
                          setDonorForm({
                            ...donorForm,
                            address: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      {donorForm._id ? "Update Donor" : "Add Donor"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDonorModal(false);
                        setDonorForm({
                          name: "",
                          email: "",
                          phone: "",
                          address: "",
                          donationHistory: [],
                        });
                      }}
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
      )}
    </div>
  );
}
