import { useEffect, useState } from "react";

export default function DonationFormModal({
  show,
  onClose,
  onSave,
  donation,
  donors,
  loadingDonors,
}) {
  const [formData, setFormData] = useState({
    donor: "",
    foodType: "",
    quantity: "",
    expirationDate: "",
    storageRequirements: "",
    status: "pending",
  });

  useEffect(() => {
    if (donation) {
      setFormData({
        donor: donation.donor?._id || "",
        foodType: donation.foodType || "",
        quantity: donation.quantity?.toString() || "",
        expirationDate: donation.expirationDate || "",
        storageRequirements: donation.storageRequirements || "",
        status: donation.status || "pending",
      });
    } else {
      setFormData({
        donor: "",
        foodType: "",
        quantity: "",
        expirationDate: "",
        storageRequirements: "",
        status: "pending",
      });
    }
  }, [donation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {donation ? "Edit Donation" : "Record New Donation"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="donor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Donor
                  </label>
                  {loadingDonors ? (
                    <div className="mt-1">Loading donors...</div>
                  ) : (
                    <select
                      id="donor"
                      name="donor"
                      value={formData.donor}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a donor</option>
                      {donors.map((donor) => (
                        <option key={donor._id} value={donor._id}>
                          {donor.name}
                        </option>
                      ))}
                      <option value="anonymous">Anonymous Donor</option>
                    </select>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="foodType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Food Type
                  </label>
                  <input
                    type="text"
                    name="foodType"
                    id="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    id="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="storageRequirements"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Storage Requirements
                  </label>
                  <input
                    type="text"
                    name="storageRequirements"
                    id="storageRequirements"
                    value={formData.storageRequirements}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
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
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="distributed">Distributed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  {donation ? "Update Donation" : "Record Donation"}
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
