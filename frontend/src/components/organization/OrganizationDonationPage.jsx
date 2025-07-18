import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import DonationTable from "./components/DonationTable";
import DonationFormModal from "./components/DonationModal";

export default function DonationsPage() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState({
    donations: true,
    donors: true,
  });
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Status options for the dropdown
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" },
  ];

  useEffect(() => {
    fetchDonations();
    fetchDonors();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading((prev) => ({ ...prev, donations: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/org/incoming-donations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDonations(
        response.data.data.donations.map((donation) => ({
          ...donation,
          quantity: donation.quantity?.value || donation.quantity, // Handle both object and primitive quantity
          date: new Date(donation.date).toLocaleDateString(),
          expirationDate: new Date(
            donation.expirationDate
          ).toLocaleDateString(),
          status: donation.status || "pending", // Ensure status is always set
        }))
      );
    } catch (err) {
      console.error("Error fetching donations:", err);
      toast.error(err.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading((prev) => ({ ...prev, donations: false }));
    }
  };

  const fetchDonors = async () => {
    try {
      setLoading((prev) => ({ ...prev, donors: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/org/donors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setDonors(response.data.data.donors);
    } catch (err) {
      console.error("Error fetching donors:", err);
      toast.error("Failed to load donors for donation form");
    } finally {
      setLoading((prev) => ({ ...prev, donors: false }));
    }
  };

  const handleSaveDonation = async (donationData) => {
    try {
      const token = localStorage.getItem("token");

      // Prepare the donation data
      const payload = {
        ...donationData,
        quantity: parseFloat(donationData.quantity),
        organization: userData._id,
        status: donationData.status || "pending",
      };

      if (currentDonation) {
        // Update existing donation
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/org/donations/${
            currentDonation._id
          }`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Donation updated successfully");
      } else {
        // Create new donation
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/org/donations`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Donation recorded successfully");
      }

      setShowDonationModal(false);
      setCurrentDonation(null);
      fetchDonations(); // Refresh the list
    } catch (err) {
      console.error("Error saving donation:", err);

      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else if (err.response.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Failed to save donation. Please try again.");
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(err.message || "An unexpected error occurred");
      }
    }
  };

  const handleEditDonation = (donation) => {
    setCurrentDonation(donation);
    setShowDonationModal(true);
  };

  const handleDeleteDonation = async (donationId) => {
    if (
      window.confirm("Are you sure you want to delete this donation record?")
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/org/donations/${donationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Donation deleted successfully");
        fetchDonations();
      } catch (err) {
        console.error("Error deleting donation:", err);
        toast.error(err.response?.data?.message || "Failed to delete donation");
      }
    }
  };

  const handleStatusChange = (donation) => {
    setCurrentDonation(donation);
    setSelectedStatus(donation.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/org/incoming-donations/${
          currentDonation._id
        }`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Donation status updated successfully");
      setShowStatusModal(false);
      fetchDonations(); // Refresh the donations list
    } catch (err) {
      console.error("Error updating donation status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Donations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's food donations and their status
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setCurrentDonation(null);
              setShowDonationModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Record donation
          </button>
        </div>
      </div>

      <DonationTable
        donations={donations}
        loading={loading.donations}
        onEdit={handleEditDonation}
        onDelete={handleDeleteDonation}
        onStatusChange={handleStatusChange}
      />

      <DonationFormModal
        show={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSave={handleSaveDonation}
        donation={currentDonation}
        donors={donors}
        loadingDonors={loading.donors}
      />

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Donation Status
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                onClick={handleStatusUpdate}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
