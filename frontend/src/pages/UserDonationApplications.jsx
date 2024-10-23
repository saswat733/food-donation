import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation


const VITE_API = import.meta.env.VITE_API_URL || "https://food-donation-7xzo.onrender.com";


const UserDonationApplication = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userInfo); // Get user info from Redux
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchDonations = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      console.log(token)
      if (!token) {
        setError("You are not logged in. Please log in to view your donations.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${VITE_API}/api/donations/donations`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
          },
        });

        // Filter donations to only show those by the logged-in user
        const userDonations = response.data.filter(
          (donation) => donation.userId === user?._id
        );
        setDonations(userDonations);
      } catch (error) {
        setError("Failed to fetch donations. Please try again later.");
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user?._id]);

  const handleAddDonation = () => {
    // Navigate to the donation creation page
    navigate("/donation-form"); // Adjust this route to your add donation page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="max-w-4xl my-5 p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
        Your Previous Donations
      </h2>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            No donation applications found.
          </p>
          <button
            onClick={handleAddDonation}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            + Add Donation
          </button>
        </div>
      ) : (
        <div>

        <ul className="mt-4 space-y-4">
          {donations.map((donation) => (
            <li
              key={donation._id}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                {donation.foodType} - {donation.quantity} Kg
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Freshness: {donation.freshness}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Pickup Location: {donation.pickupLocation}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Instructions: {donation.instructions || "None"}
              </p>
              <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">
                Created on: {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center mt-4">
          <button
            onClick={handleAddDonation}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            + Add Donation
          </button>
        </div>
        </div>
      )}
    </section>
  );
};

export default UserDonationApplication;
