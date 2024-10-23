import { useEffect, useState } from "react";
import axios from "axios";


const VITE_API = import.meta.env.VITE_API_URL || "https://food-donation-7xzo.onrender.com";


const NgoDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      if (!token) {
        setError("You are not logged in. Please log in to view donations.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${VITE_API}/api/donations/all-donations`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to headers for authentication
          },
        });
        
        setDonations(response.data); // Set the donations in state
      } catch (error) {
        setError("Failed to fetch donations. Please try again later.");
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchDonations(); // Fetch donations on component mount
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p className="text-red-500">{error}</p>; // Show error message

  return (
    <section className="max-w-4xl my-5 p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
        All Donations
      </h2>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">No donations found.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {donations.map((donation) => (
            <li key={donation._id} className="p-4 bg-gray-100 rounded-md dark:bg-gray-700">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                {donation.foodType} - {donation.quantity} Kg
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Freshness: {donation.freshness}</p>
              <p className="text-gray-600 dark:text-gray-300">Pickup Location: {donation.pickupLocation}</p>
              <p className="text-gray-600 dark:text-gray-300">Instructions: {donation.instructions || "None"}</p>
              <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">
                Created on: {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default NgoDonationsPage;
