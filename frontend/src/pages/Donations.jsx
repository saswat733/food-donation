import React, { useState } from "react";
import { Truck, Utensils, Calendar, User, MapPin, Info } from "lucide-react";

const FoodDonationPage = () => {
  const [formData, setFormData] = useState({
    donorType: "individual",
    name: "",
    email: "",
    phone: "",
    organization: "",
    foodType: "prepared",
    foodDescription: "",
    quantity: "small",
    packaging: "containers",
    preparationTime: "",
    expiryDate: "",
    address: "",
    pickupDate: "",
    pickupTime: "",
    specialInstructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      donorType: "individual",
      name: "",
      email: "",
      phone: "",
      organization: "",
      foodType: "prepared",
      foodDescription: "",
      quantity: "small",
      packaging: "containers",
      preparationTime: "",
      expiryDate: "",
      address: "",
      pickupDate: "",
      pickupTime: "",
      specialInstructions: "",
    });
    setIsSuccess(false);
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-green-900/30 dark:text-green-400 mb-4">
            Reduce Waste, Feed People
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Donate Food
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your surplus food can make a difference. Fill out this form to
            schedule a pickup of your edible food donations.
          </p>
        </div>

        <div className="relative">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-100 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank You for Your Donation!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We've received your food donation request. Our team will
                  contact you shortly to confirm pickup details.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white font-medium rounded-full hover:shadow-lg transition-all"
                >
                  Submit Another Donation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Donor Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        You are donating as:
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="donorType"
                            value="individual"
                            checked={formData.donorType === "individual"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Individual
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="donorType"
                            value="business"
                            checked={formData.donorType === "business"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Business/Organization
                          </span>
                        </label>
                      </div>
                    </div>

                    {formData.donorType === "business" && (
                      <div>
                        <label
                          htmlFor="organization"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Organization Name
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Contact Person
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Food Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type of Food
                      </label>
                      <div className="space-y-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="foodType"
                            value="prepared"
                            checked={formData.foodType === "prepared"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Prepared/Cooked
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="foodType"
                            value="perishable"
                            checked={formData.foodType === "perishable"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Perishable (Fruits, Vegetables, Dairy)
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="foodType"
                            value="nonPerishable"
                            checked={formData.foodType === "nonPerishable"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Non-Perishable (Canned, Packaged)
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="foodDescription"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Food Description
                      </label>
                      <textarea
                        id="foodDescription"
                        name="foodDescription"
                        value={formData.foodDescription}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="E.g., 20 vegetarian meals, 5kg rice, etc."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Approximate Quantity
                      </label>
                      <select
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="small">
                          Small (1-5 meals or 1-5kg)
                        </option>
                        <option value="medium">
                          Medium (5-20 meals or 5-20kg)
                        </option>
                        <option value="large">
                          Large (20+ meals or 20+kg)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="packaging"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Packaging Type
                      </label>
                      <select
                        id="packaging"
                        name="packaging"
                        value={formData.packaging}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="containers">Food Containers</option>
                        <option value="packaged">Individually Packaged</option>
                        <option value="bulk">Bulk Packaging</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="preparationTime"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        When was the food prepared?
                      </label>
                      <input
                        type="datetime-local"
                        id="preparationTime"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required={formData.foodType === "prepared"}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Expiry/Best Before Date
                      </label>
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required={formData.foodType !== "prepared"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Pickup Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Pickup Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="pickupDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Preferred Pickup Date
                      </label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pickupTime"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Preferred Pickup Time
                      </label>
                      <select
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select a time</option>
                        <option value="morning">Morning (8am-12pm)</option>
                        <option value="afternoon">Afternoon (12pm-4pm)</option>
                        <option value="evening">Evening (4pm-8pm)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="specialInstructions"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Special Instructions
                      </label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Access codes, parking info, etc."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Food Safety Guidelines
                  </h4>
                  <ul className="text-green-700 dark:text-green-300 text-sm list-disc pl-5 space-y-1">
                    <li>Food must be fresh and safe for consumption</li>
                    <li>Prepared food should be less than 2 hours old</li>
                    <li>Properly packaged to prevent contamination</li>
                    <li>No expired or spoiled food items</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                    isSubmitting
                      ? "bg-green-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-400 text-white hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      Submitting...
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      Submit Food Donation
                      <Truck className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What Foods Can You Donate?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 text-green-600 dark:text-green-400">
                Accepted Foods
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1">
                <li>Fresh fruits and vegetables</li>
                <li>Dairy products (unopened)</li>
                <li>Bread and bakery items</li>
                <li>Prepared meals (properly stored)</li>
                <li>Canned and packaged goods</li>
                <li>Dry goods (rice, pasta, beans)</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 text-red-600 dark:text-red-400">
                Not Accepted
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1">
                <li>Expired or spoiled food</li>
                <li>Opened or partially used items</li>
                <li>Food that has been sitting out</li>
                <li>Homemade canned goods</li>
                <li>Alcoholic beverages</li>
                <li>Non-food items</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDonationPage;
