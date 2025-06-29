import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL + "/restaurant" ||
  "http://localhost:3000/api/v1/restaurant";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const restaurantService = {
  // Fetch all donations made by the restaurant
  getDonations: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/donations`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  },

  // Fetch all partner organizations
  getOrganizations: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/organizations`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },

  // Fetch restaurant's food inventory
  getInventory: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/inventory`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  // Submit a new food donation
  createDonation: async (donationData) => {
    try {
      const response = await axios.post(
        `${API_URL}/donation`,
        donationData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  },

  // Create a new donation schedule
  createSchedule: async (scheduleData) => {
    try {
      const response = await axios.post(
        `${API_URL}/schedule`,
        scheduleData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  },

  // Get all scheduled donations
  getSchedules: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/schedules`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  },

  // Update a scheduled donation
  updateSchedule: async (scheduleId, updateData) => {
    try {
      const response = await axios.put(
        `${API_URL}/schedule/${scheduleId}`,
        updateData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  },

  // Cancel a scheduled donation
  cancelSchedule: async (scheduleId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/schedule/${scheduleId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling schedule:", error);
      throw error;
    }
  },

  // Update inventory item
  updateInventoryItem: async (itemId, itemData) => {
    try {
      const response = await axios.put(
        `${API_URL}/inventory/${itemId}`,
        itemData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating inventory item:", error);
      throw error;
    }
  },

  // Add new inventory item
  addInventoryItem: async (itemData) => {
    try {
      const response = await axios.post(
        `${API_URL}/inventory`,
        itemData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error adding inventory item:", error);
      throw error;
    }
  },

  // Remove inventory item
  removeInventoryItem: async (itemId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/inventory/${itemId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error removing inventory item:", error);
      throw error;
    }
  },

  // Get restaurant profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Update restaurant profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Get donation statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};

export default restaurantService;
