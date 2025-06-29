import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const API_URL =
  import.meta.env.VITE_API_BASE_URL + "/individual" ||
  "http://localhost:3000/api/v1/individual";

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [volunteerForm, setVolunteerForm] = useState({
    organization: "",
    skills: [],
    currentSkill: "",
    availability: "",
    motivation: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/organizations`,
        getAuthHeaders()
      );
      setOrganizations(response.data.data.organizations);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch organizations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

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

  const openVolunteerModal = (org) => {
    setSelectedOrganization(org);
    setVolunteerForm({
      organization: org._id,
      skills: [],
      currentSkill: "",
      availability: "",
      motivation: "",
    });
    setShowVolunteerModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Partner Organizations
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Connect with organizations making a difference in your community
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <div
              key={org._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-lg p-3">
                    <span className="text-white text-xl font-bold">
                      {org.orgName?.charAt(0).toUpperCase() || "O"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {org.orgName}
                    </h2>
                    <p className="text-sm text-indigo-600">{org.category}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {org.missionStatement || "No description available"}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{org.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{org.phone || "Not provided"}</span>
                  </div>
                </div>

                <button
                  onClick={() => openVolunteerModal(org)}
                  className="mt-6 w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Apply to Volunteer
                </button>
              </div>
            </div>
          ))}
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
                      <p className="text-sm text-gray-500 mb-6">
                        Applying to:{" "}
                        <span className="font-medium text-indigo-600">
                          {selectedOrganization?.orgName}
                        </span>
                      </p>

                      <form onSubmit={handleVolunteerSubmit}>
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
                              !volunteerForm.availability
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
      </div>
    </div>
  );
}
