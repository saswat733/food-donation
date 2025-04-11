// src/pages/VolunteerForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VITE_API = import.meta.env.VITE_API_URL;

const VolunteerForm = () => {
    const [success, setsuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    availability: "",
    skills: "",
    motivation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_API}/api/volunteer/register`, formData);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        availability: "",
        skills: "",
        motivation: "",
      });
      toast.success("form submitted successful")
      setsuccess(true)
    } catch (error) {
      toast.error("form submission fail")
    }
  };

  return (
    <section className="bg-white py-16 px-6 sm:px-12 lg:px-24 mb-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Become a Volunteer
        </h2>
        <p className="text-gray-600 mb-10">
          Join us in the mission to reduce food waste and help those in need.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {[
          { name: "fullName", type: "text", placeholder: "Full Name" },
          { name: "email", type: "email", placeholder: "Email Address" },
          { name: "phone", type: "text", placeholder: "Phone Number" },
          { name: "city", type: "text", placeholder: "City" },
          {
            name: "availability",
            type: "text",
            placeholder: "Availability (e.g. Weekends)",
          },
          { name: "skills", type: "text", placeholder: "Any Relevant Skills" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        ))}
        <textarea
          name="motivation"
          placeholder="Why do you want to volunteer?"
          value={formData.motivation}
          onChange={handleChange}
          rows="5"
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        ></textarea>
        {success ? (
          <>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition duration-300"
            >
              Submitted
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default VolunteerForm;
