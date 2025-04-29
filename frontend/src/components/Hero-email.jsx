export default function HeroEmail() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              Food Rescue
            </span>{" "}
            Mission
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Be part of the movement fighting hunger in your community. Get
            updates on donation drives, volunteer opportunities, and success
            stories straight to your inbox.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-20 blur-lg"></div>
            <form className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Trusted by organizations and partners nationwide
            </p>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {/* Modern partner badges */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                    FoodBank
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-900 dark:to-red-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-red-500">
                    FeedAll
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                    ShareMeals
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-500">
                    Nourish
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
