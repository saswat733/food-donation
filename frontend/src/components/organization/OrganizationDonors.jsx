import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import orgDashboardService from "../../service/OrganizationDashboardApi";
import { toast } from "react-toastify";
import DonorTable from "./components/DonorTable";
import DonorFormModal from "./components/DonorFormModal";
// import DonorTable from "../../components/org/DonorTable";
// import DonorFormModal from "../../components/org/DonorFormModal";

export default function DonorsPage() {
  const { userData } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [currentDonor, setCurrentDonor] = useState(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await orgDashboardService.getDonors();
      setDonors(response.data.data.donors);
    } catch (err) {
      console.error("Error fetching donors:", err);
      toast.error("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDonor = async (donorData) => {
    try {
      if (currentDonor) {
        // Update existing donor
        await orgDashboardService.updateDonor(currentDonor._id, donorData);
        toast.success("Donor updated successfully");
      } else {
        // Create new donor
        await orgDashboardService.createDonor(donorData);
        toast.success("Donor created successfully");
      }
      setShowDonorModal(false);
      setCurrentDonor(null);
      fetchDonors();
    } catch (err) {
      console.error("Error saving donor:", err);
      toast.error(err.response?.data?.message || "Failed to save donor");
    }
  };

  const handleEditDonor = (donor) => {
    setCurrentDonor(donor);
    setShowDonorModal(true);
  };

  const handleDeleteDonor = async (donorId) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await orgDashboardService.deleteDonor(donorId);
        toast.success("Donor deleted successfully");
        fetchDonors();
      } catch (err) {
        console.error("Error deleting donor:", err);
        toast.error("Failed to delete donor");
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Donors</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's donors and their information
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setCurrentDonor(null);
              setShowDonorModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add donor
          </button>
        </div>
      </div>

      <DonorTable
        donors={donors}
        loading={loading}
        onEdit={handleEditDonor}
        onDelete={handleDeleteDonor}
      />

      <DonorFormModal
        show={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        onSave={handleSaveDonor}
        donor={currentDonor}
      />
    </div>
  );
}
