import React from "react";
import { FaStar, FaUtensils, FaBreadSlice, FaCarrot, FaHotel, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const FoodVendorPage = () => {
  // Fake vendor data
  const featuredVendors = [
    {
      id: 1,
      name: "Royal Catering Co.",
      type: "Wedding Caterer",
      location: "Downtown",
      donations: 42,
      recentDonation: "150 banquet meals (Italian cuisine)",
      rating: 4.8,
      icon: <FaUtensils className="text-3xl text-blue-500" />,
      contact: {
        phone: "(555) 123-4567",
        email: "events@royalcatering.com"
      }
    },
    {
      id: 2,
      name: "Green Valley Farms",
      type: "Organic Produce",
      location: "North District",
      donations: 28,
      recentDonation: "200 lbs seasonal vegetables",
      rating: 4.9,
      icon: <FaCarrot className="text-3xl text-green-500" />,
      contact: {
        phone: "(555) 234-5678",
        email: "harvest@greenvalleyfarms.com"
      }
    },
    {
      id: 3,
      name: "Grand Ballroom Venue",
      type: "Event Space",
      location: "Uptown",
      donations: 35,
      recentDonation: "80 dessert platters",
      rating: 4.7,
      icon: <FaHotel className="text-3xl text-purple-500" />,
      contact: {
        phone: "(555) 345-6789",
        email: "events@grandballroom.com"
      }
    },
    {
      id: 4,
      name: "Bakehouse Delight",
      type: "Artisan Bakery",
      location: "Westside",
      donations: 56,
      recentDonation: "120 assorted pastries & breads",
      rating: 4.9,
      icon: <FaBreadSlice className="text-3xl text-amber-500" />,
      contact: {
        phone: "(555) 456-7890",
        email: "orders@bakehousedelight.com"
      }
    }
  ];

  // Recent donations data
  const recentDonations = [
    {
      id: 1,
      vendor: "Marriott Banquets",
      food: "200 buffet-style meals (Asian fusion)",
      time: "2 hours ago",
      status: "Claimed by City Food Bank",
      type: "Prepared Meals"
    },
    {
      id: 2,
      vendor: "Sunrise Resort",
      food: "150 breakfast boxes",
      time: "5 hours ago",
      status: "Available for pickup",
      type: "Packaged Food"
    },
    {
      id: 3,
      vendor: "Tech Conference Catering",
      food: "75 lunch boxes (vegetarian)",
      time: "Yesterday",
      status: "Delivered to Shelter",
      type: "Prepared Meals"
    },
    {
      id: 4,
      vendor: "University Dining Hall",
      food: "300 sandwiches & salads",
      time: "2 days ago",
      status: "Distributed to 3 NGOs",
      type: "Prepared Meals"
    }
  ];

  // Food types for filter
  const foodTypes = [
    "All Types",
    "Prepared Meals",
    "Fresh Produce",
    "Packaged Food",
    "Bakery Items",
    "Dairy Products"
  ];

  const [activeFilter, setActiveFilter] = React.useState("All Types");
  const [showVendorModal, setShowVendorModal] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState(null);

  const openVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorModal(true);
  };

  const filteredDonations = activeFilter === "All Types" 
    ? recentDonations 
    : recentDonations.filter(donation => donation.type === activeFilter);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-8 lg:px-12">
      {/* Vendor Modal */}
      {showVendorModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedVendor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedVendor.type} • {selectedVendor.location}
                  </p>
                </div>
                <button 
                  onClick={() => setShowVendorModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(selectedVendor.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
                <span className="ml-1 text-gray-600 dark:text-gray-300">
                  {selectedVendor.rating} ({selectedVendor.donations} donations)
                </span>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Recent Donation
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedVendor.recentDonation}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Contact Information
                </h4>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaPhone className="mr-2 text-blue-500" />
                  <span>{selectedVendor.contact.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  <span>{selectedVendor.contact.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span>{selectedVendor.location} Area</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Request Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
            Food Donation Portal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Donate Your Surplus Food
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect your catering business, wedding venue, or food service with organizations that can distribute your surplus food to those in need.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 text-white shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,240+</div>
              <p className="text-blue-100">Meals Donated</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85+</div>
              <p className="text-blue-100">Active Vendors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">32</div>
              <p className="text-blue-100">Partner NGOs</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12K+</div>
              <p className="text-blue-100">People Fed</p>
            </div>
          </div>
        </div>

        {/* Featured Vendors */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Featured Food Donors
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.map((vendor) => (
              <div 
                key={vendor.id} 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => openVendorModal(vendor)}
              >
                <div className="flex justify-center mb-4">
                  {vendor.icon}
                </div>
                <h4 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-1">
                  {vendor.name}
                </h4>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-3">
                  {vendor.type} • {vendor.location}
                </p>
                <div className="flex justify-center items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                    {vendor.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 text-center">
                  <span className="font-medium">{vendor.donations} donations</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recent: {vendor.recentDonation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="mb-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Donations
            </h3>
            <div className="mt-4 md:mt-0 flex overflow-x-auto pb-2">
              {foodTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1 text-sm rounded-full mr-2 whitespace-nowrap ${
                    activeFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {donation.vendor}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {donation.food}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                      {donation.type}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    donation.status.includes('Available') 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {donation.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="mr-1" />
                  <span>Posted {donation.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View all donation activity →
          </button>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How Food Donation Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Register Your Business
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Create a vendor profile with your business details and typical surplus food types.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Post Available Food
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                When you have surplus, quickly post details including quantity, type, and pickup time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Coordinate Pickup
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Our system matches you with a nearby organization who will arrange pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="mb-20 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h3 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-6">
            Ready to Donate?
          </h3>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business-name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your business or venue name"
                />
              </div>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your name"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Type *
              </label>
              <select
                id="business-type"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select your business type</option>
                <option value="catering">Catering Company</option>
                <option value="restaurant">Restaurant</option>
                <option value="venue">Event Venue</option>
                <option value="hotel">Hotel</option>
                <option value="bakery">Bakery</option>
                <option value="farm">Farm/Producer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Address *
              </label>
              <input
                type="text"
                id="address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Street address for pickup"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="food-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type of Food Available *
                </label>
                <select
                  id="food-type"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select food type</option>
                  <option value="prepared-meals">Prepared Meals</option>
                  <option value="fresh-produce">Fresh Produce</option>
                  <option value="packaged-food">Packaged Food</option>
                  <option value="bakery">Bakery Items</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Approximate Quantity *
                </label>
                <input
                  type="text"
                  id="quantity"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 50 meals, 20 lbs"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="food-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Food Details (Ingredients, Storage Requirements) *
              </label>
              <textarea
                id="food-details"
                rows="3"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the food you have available, including any allergens, special storage requirements, etc."
              ></textarea>
            </div>

            <div>
              <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Pickup Time *
              </label>
              <input
                type="datetime-local"
                id="pickup-time"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-start">
              <input
                id="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">terms and conditions</a> of food donation and confirm that the food is safe for consumption.
              </label>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-full hover:shadow-xl transition-all shadow-md hover:shadow-lg hover:from-blue-700 hover:to-green-600"
              >
                Submit Donation Offer
              </button>
            </div>
          </form>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Have Questions About Donating?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Our team is here to help you with the donation process and answer any questions about food safety, logistics, or partnerships.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-full hover:shadow-xl transition-all shadow-md hover:shadow-lg">
              Contact Our Team
            </button>
            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Download Donor Guidelines
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodVendorPage;