import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
    return (
      <>
        <header className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <nav className="relative max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                  Feeders
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/donate"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Donate
                </Link>
                <Link
                  to="/waste-collection-form"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Food-Reuse
                </Link>
                <Link
                  to="/food-vendor-form"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Food-vendor
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  How It Works
                </Link>
                <Link
                  to="/about-us"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Contact
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium hover:shadow-lg transition-all"
                >
                  Donate Now
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  type="button"
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="toggle menu"
                >
                  {!isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl mx-4 p-6 transition-all duration-300">
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/donate"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Donate
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                    onClick={toggleMenu}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                    onClick={toggleMenu}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>

                  <Link
                    to="/register"
                    className="mt-4 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium text-center hover:shadow-lg transition-all"
                    onClick={toggleMenu}
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>
      </>
    );
}
