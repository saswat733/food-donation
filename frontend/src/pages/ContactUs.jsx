import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";


const VITE_API = import.meta.env.VITE_API_URL;

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [success, setsuccess] = useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData)
  try {
    const response = await axios.post(
      `${VITE_API}/api/contact/contactform`,
      formData
    );
    console.log(response.data);
    toast.success("form submitted successfully")
    setsuccess(true)
    setFormData({ name: "", email: "", message: "" });
  } catch (error) {
    toast.error("form submit failed")
    console.error(error);
  }
};

  return (
    <section className="bg-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-10">
          Have questions or want to connect with us? Fill out the form and we’ll
          get back to you as soon as possible.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Send Message
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default ContactUs;
