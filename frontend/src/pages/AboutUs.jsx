import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 mb-10">
          We believe in a world where no food goes to waste and no one goes to
          bed hungry. Our platform bridges the gap between food donors and NGOs,
          making food redistribution easier and faster.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Our Mission
          </h3>
          <p className="text-gray-600">
            To create a seamless platform that empowers individuals,
            restaurants, and event organizers to donate excess food, thereby
            reducing food waste and feeding the hungry.
          </p>
        </div>
        <div className="bg-gray-100 p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            What We Do
          </h3>
          <p className="text-gray-600">
            We connect food donors with nearby NGOs who collect and distribute
            the donated food. Our system ensures efficient, real-time
            coordination and maximum impact.
          </p>
        </div>
      </div>
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h4 className="text-xl font-semibold text-gray-700 mb-2">
          Join Us in Our Mission
        </h4>
        <p className="text-gray-600">
          Whether you're a donor, a volunteer, or an NGO, you can be part of
          this journey to make the world a better place—one meal at a time.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
