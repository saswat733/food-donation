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
  const [currentDonation, setCurrentDonation] = useState(null);

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

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/org/donations/${donationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Donation status updated successfully");
      fetchDonations();
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
        onStatusChange={handleStatusUpdate}
      />

      <DonationFormModal
        show={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSave={handleSaveDonation}
        donation={currentDonation}
        donors={donors}
        loadingDonors={loading.donors}
      />
    </div>
  );
}
