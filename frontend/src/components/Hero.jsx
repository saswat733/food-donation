import { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Help{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                  Fight Hunger
                </span>{" "}
                By Donating Food
              </h1>

              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Every day, good food goes to waste while people go hungry. Our
                platform connects food donors with local charities to bridge
                this gap. Your donation can help feed hundreds in your
                community.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold text-center hover:shadow-xl transition-all"
                >
                  Start Donating
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Learn How It Works
                </Link>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <img
                      key={item}
                      src={`https://randomuser.me/api/portraits/women/${
                        item + 40
                      }.jpg`}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                      alt="Donor"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Joined by <span className="font-semibold">1,200+</span>{" "}
                    donors
                  </p>
                  <p className="text-xs">Saving food daily</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-20 -right-10 w-64 h-64 bg-yellow-100 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <img
                  className="w-full h-auto"
                  src="../../src/assets/home.png"
                  alt="Volunteers packing food donations"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-medium">
                    Real-time donations being matched with local food banks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
