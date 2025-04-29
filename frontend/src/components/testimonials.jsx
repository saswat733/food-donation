export default function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Hear From Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                Community
              </span>
            </h2>
            <div className="flex mt-6">
              <span className="inline-block w-16 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></span>
              <span className="inline-block w-4 h-2 mx-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></span>
              <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-16 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-300"></div>
            <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                "Donating food through this platform has been an incredibly
                fulfilling experience. Knowing my contributions are helping
                those in need brings me joy."
              </p>
              <div className="flex items-center mt-8">
                <img
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80"
                  alt="Anna Smith"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Anna Smith
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Community Volunteer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
            <div className="relative h-full p-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl shadow-lg">
              <div className="text-yellow-300 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-white leading-relaxed">
                "I love being a part of this initiative! It's amazing to see how
                our efforts collectively make a huge difference in our
                community."
              </p>
              <div className="flex items-center mt-8">
                <img
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-200/50"
                  src="https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&auto=format&fit=crop&w=764&q=80"
                  alt="Michael Johnson"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-white">Michael Johnson</h4>
                  <p className="text-sm text-blue-100">Food Donor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-300"></div>
            <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                "The process was easy, and I felt supported every step of the
                way. I'll definitely continue to donate through this platform."
              </p>
              <div className="flex items-center mt-8">
                <img
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
                  src="https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
                  alt="Sarah Lee"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Sarah Lee
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Local Business Owner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
