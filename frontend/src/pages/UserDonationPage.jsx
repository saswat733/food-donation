import React, { useState } from 'react';
import { useAuthUser } from '../utils/hooks/useAuth'; // Adjust the import based on your file structure
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const VITE_API = import.meta.env.VITE_API_URL || "https://food-donation-7xzo.onrender.com";



const DonationPage = () => {
  const { user } = useAuthUser(); // Get the user info from the hook
  const [formData, setFormData] = useState({
    donorName: '',
    contactNumber: '',
    email: '',
    foodType: 'vegetarian',
    quantity: '',
    freshness: 'fresh',
    pickupLocation: '',
    instructions: '',
  });
  const [error, setError] = useState(null);
  const navigate=useNavigate()
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to make a donation.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // Adjust this line based on how your token is stored

      const response = await axios.post(`${VITE_API}/api/donations/donations`, {
        ...formData,
        donorId: user.id, // Assuming user has an ID you can use
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in headers
        },
      });

      // Handle success (you might want to redirect or show a success message)
      console.log('Donation submitted successfully:', response.data);
      
      // Reset form
      setFormData({
        donorName: '',
        contactNumber: '',
        email: '',
        foodType: 'vegetarian',
        quantity: '',
        freshness: 'fresh',
        pickupLocation: '',
        instructions: '',
      });
      setError(null); // Clear any previous error messages
      if(response){
        navigate('/donation-applications')
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      setError('Failed to submit donation. Please try again later.');
    }
  };

  return (
    <>
      <section className="max-w-4xl my-5 p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          Food Donation Details
        </h2>

        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="donorName">
                Donor Name
              </label>
              <input
                id="donorName"
                name="donorName"
                type="text"
                placeholder="Enter your name"
                value={formData.donorName}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="contactNumber">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="Enter your contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="foodType">
                Type of Food
              </label>
              <select
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="bakedGoods">Baked Goods</option>
                <option value="packaged">Packaged Food</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="quantity">
                Quantity (in Kg)
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter the quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="freshness">
                Freshness Level
              </label>
              <select
                id="freshness"
                name="freshness"
                value={formData.freshness}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              >
                <option value="fresh">Fresh (Prepared Today)</option>
                <option value="1day">1 Day Old</option>
                <option value="2days">2 Days Old</option>
                <option value="packaged">Packaged Food (Unopened)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 dark:text-gray-200" htmlFor="pickupLocation">
                Pickup Location
              </label>
              <input
                id="pickupLocation"
                name="pickupLocation"
                type="text"
                placeholder="Enter the pickup location"
                value={formData.pickupLocation}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-gray-700 dark:text-gray-200" htmlFor="instructions">
                Additional Instructions (if any)
              </label>
              <textarea
                id="instructions"
                name="instructions"
                placeholder="Enter any specific instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default DonationPage;
