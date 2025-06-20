import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WasteCollectionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    wasteType: "vegetable",
    quantity: "small",
    pickupDate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required";
    } else if (new Date(formData.pickupDate) < today) {
      newErrors.pickupDate = "Pickup date must be today or in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/wastFoodCollection/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Collection request submitted successfully!"
      );

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        wasteType: "vegetable",
        quantity: "small",
        pickupDate: "",
        notes: "",
      });
    } catch (error) {
      console.error("Submission error:", error);

      if (error.response) {
        // Server responded with error status
        if (error.response.data.errors) {
          // Handle validation errors from server
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            serverErrors[err.path] = err.msg;
          });
          setErrors(serverErrors);
        }
        toast.error(error.response.data.message || "Failed to submit request");
      } else if (error.request) {
        // Request was made but no response
        toast.error("No response from server. Please try again later.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-8 lg:px-12">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-green-900/30 dark:text-green-400 mb-4">
            Sustainable Solution
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Waste Food Collection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't let your food waste go to landfills. Request a collection and
            we'll turn it into nutrient-rich compost for community gardens and
            farms.
          </p>
        </div>

        <div className="relative">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-100 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

          <form
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            noValidate
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Collection Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="wasteType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Type of Food Waste
                </label>
                <select
                  id="wasteType"
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="vegetable">Vegetable/Fruit Scraps</option>
                  <option value="grain">Grain/Bread Waste</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="mixed">Mixed Food Waste</option>
                  <option value="other">Other Organic Waste</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Approximate Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="small">Small (1-5 kg)</option>
                  <option value="medium">Medium (5-20 kg)</option>
                  <option value="large">Large (20+ kg)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pickupDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Preferred Pickup Date *
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.pickupDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {errors.pickupDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pickupDate}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special instructions about the waste or pickup location"
              ></textarea>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-medium rounded-full hover:shadow-xl transition-all shadow-md ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg hover:from-green-700 hover:to-green-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
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
                    Processing...
                  </>
                ) : (
                  "Request Collection"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full"></div>
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How It Works
          </h4>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  1
                </span>
              </div>
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Request Collection
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out our simple form with details about your food waste and
                preferred pickup time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  2
                </span>
              </div>
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                We Collect
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                Our team will collect your organic waste at the scheduled time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  3
                </span>
              </div>
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Transform to Compost
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                We process the waste into high-quality compost for community
                use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WasteCollectionForm;
