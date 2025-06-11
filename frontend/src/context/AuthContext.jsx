import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Add this line for user data
  const navigate = useNavigate();

  
  // Initialize axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });



  // Add response interceptor to handle 401 errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("reach:",token)

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
        // console.log("organization", data.data.user)
        setUserData(data.user); // Store the complete user data
        return data.user;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user data:", err);
      // localStorage.removeItem("token");
      setUser(null);
      setUserData(null);
      return null;
    }
  };

  // Check auth state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUserData();

        // Redirect logic remains the same
        if (
          user &&
          ["/login", "/register"].includes(window.location.pathname)
        ) {
          navigate(`/${user.role}-dashboard`);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Login function - modified to use fetchUserData
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      const user = await fetchUserData();
      return { ...data, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Register function - modified to use fetchUserData
  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      const user = await fetchUserData();
      return { ...data, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  // Get axios instance with auth headers
  const authApi = () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return api;
  };

  const value = {
    user,
    userData, // Include userData in the context value
    loading,
    login,
    register,
    logout,
    hasRole,
    authApi,
    fetchUserData, // Expose fetchUserData function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
