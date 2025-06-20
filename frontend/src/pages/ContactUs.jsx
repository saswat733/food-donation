import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import * as yup from "yup";

// const VITE_API = import.meta.env.VITE_API_URL;

// Validation schema
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name is too short")
    .max(50, "Name is too long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message is too short")
    .max(500, "Message is too long"),
});

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = async () => {
    try {
      await contactSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitCount((prev) => prev + 1);

    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/contact/contactform`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
        setSubmitCount(0);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Submission error:", error);

      let errorMessage = "Failed to send message. Please try again.";
      if (error.response) {
        // Server responded with a status code outside 2xx
        if (error.response.status === 429) {
          errorMessage = "Too many requests. Please wait before trying again.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is empty
  const isFormEmpty = !formData.name && !formData.email && !formData.message;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400 mb-4">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions or want to connect with us? Fill out the form and
            we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

          <form
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6"
            noValidate
          >
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } rounded-xl p-3 focus:outline-none focus:ring-2 ${
                  errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } rounded-xl p-3 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full border ${
                  errors.message
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } rounded-xl p-3 focus:outline-none focus:ring-2 ${
                  errors.message ? "focus:ring-red-500" : "focus:ring-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                disabled={isSubmitting}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isFormEmpty}
              className={`w-full py-3 px-6 rounded-full font-medium flex items-center justify-center space-x-2 transition-all ${
                isSubmitting
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : isFormEmpty
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-lg hover:from-blue-700 hover:to-green-600"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span>Sending...</span>
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
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
