import React from "react";
import { CheckCircle, HandHeart, MapPin, Send } from "lucide-react";

const steps = [
  {
    icon: <HandHeart className="w-6 h-6" />,
    title: "Register as a Donor",
    description:
      "Sign up on our platform to become a food donor. Individuals, restaurants, and event organizers are welcome.",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: "Submit Donation",
    description:
      "Fill in a simple form detailing the type, quantity, and pickup time of the food you wish to donate.",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "NGO Match",
    description:
      "Nearby NGOs are notified automatically and assigned for food collection based on your location.",
    gradient: "from-green-600 to-green-400",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Pickup & Distribute",
    description:
      "NGOs pick up the food and distribute it to those in need—ensuring nothing goes to waste.",
    gradient: "from-amber-600 to-amber-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400 mb-4">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Making food donation simple, efficient, and impactful with our
            streamlined process.
          </p>
        </div>

        <div className="relative">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                ></div>
                <div
                  className={`mb-6 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${step.gradient} text-white`}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>

                <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-full hover:shadow-xl transition-all shadow-md hover:shadow-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
