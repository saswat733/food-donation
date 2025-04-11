import React from "react";
import { CheckCircle, HandHeart, MapPin, Send } from "lucide-react";

const steps = [
  {
    icon: <HandHeart className="w-8 h-8 text-primary" />,
    title: "Register as a Donor",
    description:
      "Sign up on our platform to become a food donor. Individuals, restaurants, and event organizers are welcome.",
  },
  {
    icon: <Send className="w-8 h-8 text-primary" />,
    title: "Submit Donation",
    description:
      "Fill in a simple form detailing the type, quantity, and pickup time of the food you wish to donate.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "NGO Match",
    description:
      "Nearby NGOs are notified automatically and assigned for food collection based on your location.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Pickup & Distribute",
    description:
      "NGOs pick up the food and distribute it to those in need—ensuring nothing goes to waste.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">How It Works</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Making food donation simple, efficient, and impactful.
        </p>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center"
            >
              <div className="mb-4 bg-primary/10 rounded-full p-3">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
