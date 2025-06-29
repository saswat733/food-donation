import axios from 'axios';



const API_URL = import.meta.env.VITE_API_BASE_URL;
// Set up default headers for authentication
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const orgDashboardService = {
  // Donations
  getDonations: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/donations`, { signal });
      console.log("Response from getDonations:", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  recordDonation: async (donationData) => {
    try {
      const response = await axios.post(`${API_URL}/org/donations`, donationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Incoming Donations
  getIncomingDonations: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/incoming-donations`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateIncomingDonationStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/org/incoming-donations/${id}`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Volunteer Applications
  getVolunteerApplications: async (status, signal) => {
    try {
      const params = status ? { status } : {};
      const response = await axios.get(`${API_URL}/org/volunteer-applications`, {
        params,
        signal
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateApplicationStatus: async (id, status, rejectionReason) => {
    try {
      console.log("Updating application status:", { id, status, rejectionReason });
      const response = await axios.patch(`${API_URL}/org/volunteer-applications/${id}`, {
        status,
        rejectionReason
      });
      console.log("Response from updateApplicationStatus:", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getApplicationMetrics: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/volunteer-applications/metrics`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Donors
  getDonors: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/donors`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createDonor: async (donorData) => {
    try {
      const response = await axios.post(`${API_URL}/org/donors`, donorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getDonor: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/org/donors/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateDonor: async (id, donorData) => {
    try {
      const response = await axios.put(`${API_URL}/org/donors/${id}`, donorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteDonor: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/org/donors/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Volunteers
  getVolunteers: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/volunteers`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  addVolunteer: async (volunteerData) => {
    try {
      const response = await axios.post(`${API_URL}/org/volunteers`, volunteerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Inventory
  getInventory: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/inventory`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateInventory: async (inventoryData) => {
    try {
      const response = await axios.post(`${API_URL}/org/inventory`, inventoryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Requests
  getRequests: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/requests`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createRequest: async (requestData) => {
    try {
      const response = await axios.post(`${API_URL}/org/requests`, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Events
  getEvents: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/events`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/org/events`, eventData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Stats
  getStats: async (signal) => {
    try {
      const response = await axios.get(`${API_URL}/org/stats`, { signal });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default orgDashboardService;