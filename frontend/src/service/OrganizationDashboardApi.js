import axios from "axios";


const API_BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


const orgDashboardService = {
  // Get all donations for the organization
  getDonations: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/donations`,
        getAuthHeader());
      return response;
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  },

  // Record a new donation
  recordDonation: async (donationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/org/donations`,
        donationData,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error recording donation:", error);
      throw error;
    }
  },

  // Get all donors
  getDonors: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/donors`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching donors:", error);
      throw error;
    }
  },

  // Get all volunteers
  getVolunteers: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/volunteers`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      throw error;
    }
  },

  // Add a new volunteer
  addVolunteer: async (volunteerData) => {
    try {
        console.log(volunteerData)
      const response = await axios.post(
        `${API_BASE_URL}/org/volunteers`,
        volunteerData,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error adding volunteer:", error);
      throw error;
    }
  },

  // Get inventory items
  getInventory: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/inventory`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  // Update inventory
  updateInventory: async (inventoryData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/org/inventory`,
        inventoryData,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error updating inventory:", error);
      throw error;
    }
  },

  // Get all requests
  getRequests: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/requests`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  // Create a new request
  createRequest: async (requestData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/org/requests`,
        requestData,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },

  // Get all events
  getEvents: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/events`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/org/events`,
        eventData,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/org/stats`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};

export default orgDashboardService;
