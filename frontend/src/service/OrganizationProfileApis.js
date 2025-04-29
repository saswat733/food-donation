import axios from "axios";

const API_URL =
  import.meta.env.REACT_APP_API_BASE_URL  + "/organization/profile";


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class OrganizationProfileService {
  getProfile() {
    return axios.get(API_URL, { headers: getAuthHeader() });
  }

  updateProfile(profileData) {
    return axios.put(API_URL, profileData, { headers: getAuthHeader() });
  }

  uploadLogo(logoFile) {
    const formData = new FormData();
    formData.append("logo", logoFile);
    return axios.post(`${API_URL}/logo`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new OrganizationProfileService();
