export default function DonationTable({
  donations,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusOptions = ["pending", "received", "distributed", "expired"];

  if (loading) {
    return <div className="mt-8">Loading donations...</div>;
  }

  return (
    <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Donor
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Food Type
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Expires
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {donation.donor?.name || "Anonymous"}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {donation.foodType}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {donation.quantity} kg
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {donation.expirationDate}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <select
                  value={donation.status}
                  onChange={(e) => onStatusChange(donation._id, e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-1 pl-2 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {donation.date}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => onEdit(donation)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(donation._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
