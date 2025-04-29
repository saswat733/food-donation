import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/individual"; // Update with your backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default {
  // Dashboard stats
  getDashboardStats() {
    return axios.get(`${API_URL}/stats`, getAuthHeaders());
  },

  // Organizations
  getOrganizations() {
    return axios.get(`${API_URL}/organizations`, getAuthHeaders());
  },

  // Volunteer applications
  submitVolunteerApplication(data) {
    return axios.post(`${API_URL}/volunteer`, data, getAuthHeaders());
  },

  getDonationRequests () {
  return axios.get(`${API_URL}/donations-requests`,getAuthHeaders());
},

  // Service offers
  submitServiceOffer(data) {
    return axios.post(`${API_URL}/service`, data, getAuthHeaders());
  },

  // Donations
  requestDonation(data) {
    console.log("Requesting donation with data:", data);
    return axios.post(`${API_URL}/donation`, data, getAuthHeaders());
  },

  getDonations() {
    return axios.get(`${API_URL}/donations`, getAuthHeaders());
  },

  getDonors() {
    return axios.get(`${API_URL}/donors`, getAuthHeaders());
  },
};
