const FoodDonationSection = () => {
    return (
      <div className="bg-gray-900">
       
  
        <div className="container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-semibold tracking-wide text-white lg:text-4xl">
                Find food donations in your area
              </h1>
              <p className="mt-4 text-gray-300">
                We connect people with food needs to donors and organizations ready to help.
              </p>
              <div className="grid gap-6 mt-8 sm:grid-cols-2">
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Local food banks</span>
                </div>
  
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Community support</span>
                </div>
  
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Quick registration</span>
                </div>
  
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Secure donations</span>
                </div>
  
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Timely notifications</span>
                </div>
  
                <div className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="mx-3">Easy tracking</span>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
            <img
              className="object-cover w-full h-full max-w-2xl rounded-md"
              src="../../src/assets/home2.png"
              alt="Food donation"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default FoodDonationSection;
  