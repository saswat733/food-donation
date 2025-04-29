import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400 mb-4">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We believe in a world where no food goes to waste and no one goes to
            bed hungry. Our platform bridges the gap between food donors and
            NGOs, making food redistribution easier and faster.
          </p>
        </div>

        <div className="relative">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

          <div className="relative grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To create a seamless platform that empowers individuals,
                restaurants, and event organizers to donate excess food, thereby
                reducing food waste and feeding the hungry.
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                What We Do
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We connect food donors with nearby NGOs who collect and
                distribute the donated food. Our system ensures efficient,
                real-time coordination and maximum impact.
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Join Us in Our Mission
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Whether you're a donor, a volunteer, or an NGO, you can be part of
            this journey to make the world a better place—one meal at a time.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-full hover:shadow-xl transition-all shadow-md hover:shadow-lg">
            Get Involved Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
