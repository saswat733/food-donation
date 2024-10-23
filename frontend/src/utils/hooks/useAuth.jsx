import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginRequest, loginSuccess } from "../slice/UserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VITE_API= import.meta.env.VITE_API_URL;

export const useAuthUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added navigate for redirection after login/registration

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Login Function
  const loginUser = async (formData, accountType) => {
    setLoading(true);
    dispatch(loginRequest());
    setError(null);

    try {
      const endpoint =
        accountType === "user" ? "/users/register" : "/ngos/register";

      const response = await axios.post(
        `${VITE_API}/api${endpoint}`,
        formData
      );


      const { token, user } = response.data;
      localStorage.setItem("authToken", token); // Save token for future requests
      dispatch(loginSuccess({ token, userInfo: user }));

      // Redirect user to the donation form or homepage
      const redirectPath = accountType === "user" ? "/donation-applications" : "/";
      navigate(redirectPath);
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  // Registration Function
  const registerUser = async (formData, accountType) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        accountType === "user" ? "/users/register" : "/ngos/register";

      const response = await axios.post(
        `${VITE_API}/api/${endpoint}`,
        formData
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token); // Save token after registration

      dispatch(loginSuccess({ token, userInfo: user }));

      // Redirect user to the appropriate page after registration
      const redirectPath = accountType === "user" ? "/donation-applications" : "/";
      navigate(redirectPath);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during registration.";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    registerUser,
    isAuthenticated,
    user,
    loading,
    error,
  };
};
