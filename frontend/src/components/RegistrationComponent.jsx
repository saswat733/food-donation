import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("individual");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    // Individual specific
    address: "",
    // Organization specific
    orgName: "",
    registrationNumber: "",
    missionStatement: "",
    // Restaurant specific
    restaurantName: "",
    cuisineType: "",
    licenseNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      address: "",
      orgName: "",
      registrationNumber: "",
      missionStatement: "",
      restaurantName: "",
      cuisineType: "",
      licenseNumber: "",
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      // Role-specific validation
      if (role === "individual" && !formData.name) {
        throw new Error("Name is required");
      }
      if (
        role === "organization" &&
        (!formData.orgName || !formData.registrationNumber)
      ) {
        throw new Error(
          "Organization name and registration number are required"
        );
      }
      if (
        role === "restaurant" &&
        (!formData.restaurantName || !formData.licenseNumber)
      ) {
        throw new Error("Restaurant name and license number are required");
      }

      // Prepare request data based on role
      const requestData = {
        role,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ...(role === "individual" && {
          name: formData.name,
          address: formData.address,
        }),
        ...(role === "organization" && {
          orgName: formData.orgName,
          registrationNumber: formData.registrationNumber,
          missionStatement: formData.missionStatement,
        }),
        ...(role === "restaurant" && {
          restaurantName: formData.restaurantName,
          cuisineType: formData.cuisineType,
          licenseNumber: formData.licenseNumber,
          name: formData.name, // contact person name
        }),
      };

      // Make API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        console.log("Registration successful:", response.data.data.user);
        // Show success message
        toast.success(`Registration successful as ${role}`);

        // Redirect to appropriate dashboard
        navigate(`/${role}-dashboard`);
      } else {
        throw new Error("Registration failed - no token received");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(`Registration failed: ${errorMessage}`);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              FoodShare
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with your community through food sharing
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <RoleCard
            title="Individual"
            description="Donate or receive food"
            icon="👤"
            active={role === "individual"}
            onClick={() => handleRoleChange("individual")}
          />
          <RoleCard
            title="Organization"
            description="Food banks, charities"
            icon="🏛️"
            active={role === "organization"}
            onClick={() => handleRoleChange("organization")}
          />
          <RoleCard
            title="Restaurant"
            description="Businesses with surplus"
            icon="🍽️"
            active={role === "restaurant"}
            onClick={() => handleRoleChange("restaurant")}
          />
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white capitalize">
              Register as {role}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role-Specific Fields */}
            {role === "individual" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your street address"
                  />
                </div>
              </div>
            )}

            {role === "organization" && (
              <div className="space-y-6">
                <FormField
                  label="Organization Name"
                  name="orgName"
                  type="text"
                  value={formData.orgName}
                  onChange={handleChange}
                  placeholder="Helping Hands Foundation"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Registration Number"
                    name="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="123456789"
                    required
                  />
                  <FormField
                    label="Contact Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <FormField
                  label="Mission Statement"
                  name="missionStatement"
                  type="textarea"
                  value={formData.missionStatement}
                  onChange={handleChange}
                  placeholder="Brief description of your organization's mission"
                />
              </div>
            )}

            {role === "restaurant" && (
              <div className="space-y-6">
                <FormField
                  label="Restaurant Name"
                  name="restaurantName"
                  type="text"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Tasty Bites"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Cuisine Type"
                    name="cuisineType"
                    type="text"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    placeholder="Italian, Mexican, etc."
                  />
                  <FormField
                    label="License Number"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="F12345678"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Contact Person"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Manager's name"
                  />
                  <FormField
                    label="Contact Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Role Card Component
const RoleCard = ({ title, description, icon, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border rounded-xl cursor-pointer transition-all ${
      active
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
    }`}
  >
    <div className="flex items-center">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h3
          className={`font-medium ${
            active
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </div>
);

// Reusable Form Field Component
const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        rows="3"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      />
    )}
  </div>
);

export default Register;
