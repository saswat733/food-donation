import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VITE_API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
    const [success, setsuccess] = useState(false)
    const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_API}/api/users/signin`, formData);
      toast.success("login successfull")
      setsuccess(true)

      console.log(res.data); // token, user, etc.
    } catch (err) {

     toast.error("login failed")
    }finally{
        return navigate("/")
    }
  }



  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
