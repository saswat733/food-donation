import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DonationFormModal({
  show,
  onClose,
  onSave,
  donation,
  donors,
}) {

  console.log("donation page::",donation)
  const [formData, setFormData] = useState({
    donor: "",
    foodType: "perishable",
    quantity: 1,
    expirationDate: new Date(),
    storageRequirements: "",
    status: "pending",
  });

  useEffect(() => {
    if (donation) {
      setFormData({
        donor: donation.donor?._id || donation.donor,
        foodType: donation.foodType,
        quantity: donation.quantity,
        expirationDate: new Date(donation.expirationDate),
        storageRequirements: donation.storageRequirements,
        status: donation.status,
      });
    } else {
      setFormData({
        donor: "",
        foodType: "perishable",
        quantity: 1,
        expirationDate: new Date(),
        storageRequirements: "",
        status: "pending",
      });
    }
  }, [donation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationData = {
      ...formData,
      expirationDate: formData.expirationDate.toISOString().split("T")[0],
    };
    onSave(donationData);
  };

  if (!show) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {donation ? "Edit Donation" : "Add New Donation"}
            </h3>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mb-4">
                <label
                  htmlFor="donor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Donor
                </label>
                <select
                  id="donor"
                  name="donor"
                  value={formData.donor}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="">Select a donor</option>
                  {donors.map((donor) => (
                    <option key={donor._id} value={donor._id}>
                      {donor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="foodType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Food Type
                </label>
                <select
                  id="foodType"
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="perishable">Perishable</option>
                  <option value="non-perishable">Non-Perishable</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration Date
                </label>
                <DatePicker
                  selected={formData.expirationDate}
                  onChange={(date) =>
                    setFormData({ ...formData, expirationDate: date })
                  }
                  minDate={new Date()}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="storageRequirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Storage Requirements
                </label>
                <input
                  type="text"
                  id="storageRequirements"
                  name="storageRequirements"
                  value={formData.storageRequirements}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
