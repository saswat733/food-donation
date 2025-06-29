import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import orgDashboardService from "../../service/OrganizationDashboardApi";

export default function VolunteersPage() {
  const { userData } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [status, setStatus] = useState("active");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("approved");
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/org/volunteers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Separate applications and volunteers
      const apps = response.data.data.records.filter(
        (item) => item.type === "application"
      );
      const vols = response.data.data.records.filter(
        (item) => item.type === "volunteer"
      );

      setApplications(apps);
      setVolunteers(vols);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/org/volunteer-applications/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  const handleApplicationStatusUpdate = async () => {
    try {

      console.log("selectedApplication:", selectedApplication);
      await orgDashboardService.updateApplicationStatus(
        selectedApplication.id,
        applicationStatus,
        rejectionReason
      );
      toast.success("Application status updated successfully");
      setShowApplicationModal(false);
      setSelectedApplication(null);
      setApplicationStatus("approved");
      setRejectionReason("");
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/org/volunteers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async () => {
    try {
      await updateVolunteerStatus(currentVolunteer._id, status);
      toast.success("Volunteer status updated successfully");
      setShowStatusModal(false);
      setCurrentVolunteer(null);
      fetchData();
    } catch (err) {
      console.error("Error updating volunteer status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const processApplication = (application) => {
    console.log("processing application:", application);
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleUpdateStatus = (volunteer) => {
    console.log("volunteer:",volunteer);
    setCurrentVolunteer(volunteer);
    setStatus(volunteer.status);
    setShowStatusModal(true);
  };

  const handleDelete = async (volunteerId) => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      try {
        await deleteVolunteer(volunteerId);
        toast.success("Volunteer deleted successfully");
        fetchData();
      } catch (err) {
        console.error("Error deleting volunteer:", err);
        toast.error("Failed to delete volunteer");
      }
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      on_leave: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Applications Table */}
      <div>
        <div className="sm:flex sm:items-center mb-4">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Volunteer Applications
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Review applications from individuals wanting to volunteer
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Skills
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {applications?.map((application) => (
                        <tr key={application._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {application?.user?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {application?.user?.email}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {application.skills?.join(", ") || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <StatusBadge
                              status={application.status || "pending"}
                            />
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => processApplication(application)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Process
                            </button>
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && !loading && (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-4 text-center text-sm text-gray-500"
                          >
                            No applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div>
        <div className="sm:flex sm:items-center mb-4">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Current Volunteers
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your organization's active volunteers
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Skills
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {volunteers?.map((volunteer) => (
                        <tr key={volunteer._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {volunteer?.user?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {volunteer?.user?.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {volunteer?.user?.phone || "N/A"}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {volunteer.skills?.join(", ") || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <StatusBadge status={volunteer.status} />
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleUpdateStatus(volunteer)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => handleDelete(volunteer._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {volunteers.length === 0 && !loading && (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-4 text-center text-sm text-gray-500"
                          >
                            No volunteers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedApplication && (
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

      {/* Status Update Modal */}
      {showStatusModal && currentVolunteer && (
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Update Volunteer Status
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Volunteer: {currentVolunteer?.user?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Current Status:{" "}
                    <StatusBadge status={currentVolunteer.status} />
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    New Status
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="active"
                        name="status"
                        type="radio"
                        checked={status === "active"}
                        onChange={() => setStatus("active")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="active"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="inactive"
                        name="status"
                        type="radio"
                        checked={status === "inactive"}
                        onChange={() => setStatus("inactive")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="inactive"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Inactive
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="on_leave"
                        name="status"
                        type="radio"
                        checked={status === "on_leave"}
                        onChange={() => setStatus("on_leave")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="on_leave"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        On Leave
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Update Status
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusModal(false);
                      setCurrentVolunteer(null);
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
    </div>
  );
}
