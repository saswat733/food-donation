import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DonationTable({
  donations,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusOptions = ["pending", "received", "distributed", "expired"];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading donations...</div>;
  }

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Donor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Food Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Expiration
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No donations found
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr key={donation._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.donor?.name || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.foodType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.quantity} {donation.unit || "kg"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {donation.expirationDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 cursor-pointer ${getStatusColor(
                            donation.status
                          )}`}
                          onClick={() => onStatusChange(donation)}
                        >
                          {donation.status || "pending"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => onEdit(donation)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(donation._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
