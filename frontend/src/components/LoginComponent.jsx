import React, { useState } from 'react';

const SignIn = () => {
  const [accountType, setAccountType] = useState('user'); // State to track the selected account type

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center min-h-screen">
        {/* Background image for larger screens */}
        <div
          className="hidden bg-cover lg:block lg:w-2/5"
          style={{
            backgroundImage: `${accountType=="user"?("url('https://img.freepik.com/free-photo/front-view-food-provision-donation-with-boxes_23-2148732629.jpg?t=st=1728143417~exp=1728147017~hmac=cc901c362dbdd0b8e05eae9fd7968bcc49b59d0dd9c8e82bf9621b7814c42475&w=1380')"):("url('https://img.freepik.com/free-photo/food-donation-box-being-prepared-by-smiley-volunteers_23-2148732706.jpg?t=st=1728143187~exp=1728146787~hmac=b0fe274ae2250d14071c9ad827b4cef446b80af658b64f97d49a55b843558998&w=1380')")}`,
          }}
        ></div>

        {/* Sign-in form container */}
        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
              Get your account now.
            </h1>

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Let’s get you all set up so you can verify your personal account and begin using our services.
            </p>

            <div className="mt-6">
              <h1 className="text-gray-500 dark:text-gray-300">Select type of account</h1>
              <div className="mt-3 md:flex md:items-center md:-mx-2">
                {/* User sign-in button */}
                <button
                  onClick={() => handleAccountTypeChange('user')}
                  className={`flex justify-center w-full px-6 py-3 rounded-lg md:w-auto md:mx-2 focus:outline-none ${
                    accountType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="mx-2">User</span>
                </button>

                {/* NGO sign-in button */}
                <button
                  onClick={() => handleAccountTypeChange('ngo')}
                  className={`flex justify-center w-full px-6 py-3 mt-4 rounded-lg md:mt-0 md:w-auto md:mx-2 focus:outline-none ${
                    accountType === 'ngo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="mx-2">NGO</span>
                </button>
              </div>
            </div>

            {/* Sign-in form */}
            <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</label>
                <input
                  type="email"
                  placeholder="johnsnow@example.com"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              {/* Additional fields for NGO sign-in */}
              {accountType === 'ngo' && (
                <>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Organization Name</label>
                    <input
                      type="text"
                      placeholder="Enter your organization name"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Registration Number</label>
                    <input
                      type="text"
                      placeholder="Enter your registration number"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                <span>Sign In</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
