import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../utils/hooks/useAuth'; // Adjust import based on structure

const SignIn = () => {
  const [accountType, setAccountType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phoneNumber: '',
    organizationName: '',
    registrationNumber: '',
  });

  const [formError, setFormError] = useState(null); // Track form validation errors
  const navigate = useNavigate();
  const { loginUser, loading, error, isAuthenticated } = useAuthUser();

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    // Reset form data on account type switch
    setFormData({
      email: '',
      password: '',
      username: '',
      phoneNumber: '',
      organizationName: '',
      registrationNumber: '',
    });
    setFormError(null); // Clear form error on account switch
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Reset form error

    // Simple field validation
    if (!formData.email || !formData.password) {
      return setFormError('Email and password are required.');
    }

    try {
      await loginUser(formData, accountType);

      if (isAuthenticated) {
        // Navigate based on account type
        navigate(accountType === 'user' ? '/donation-applications' : '/all-applications');
      }
    } catch (err) {
      console.error('Login failed:', err); // Error already handled in the hook
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center min-h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/5"
          style={{
            backgroundImage: `${
              accountType === 'user'
                ? "url('https://img.freepik.com/free-photo/front-view-food-provision-donation-with-boxes_23-2148732629.jpg')"
                : "url('https://img.freepik.com/free-photo/food-donation-box-being-prepared-by-smiley-volunteers_23-2148732706.jpg')"
            }`,
          }}
        ></div>

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
                <button
                  onClick={() => handleAccountTypeChange('user')}
                  className={`flex justify-center w-full px-6 py-3 rounded-lg md:w-auto md:mx-2 ${
                    accountType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  User
                </button>

                <button
                  onClick={() => handleAccountTypeChange('ngo')}
                  className={`flex justify-center w-full px-6 py-3 mt-4 rounded-lg md:mt-0 md:w-auto md:mx-2 ${
                    accountType === 'ngo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  NGO
                </button>
              </div>
            </div>

            <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johnsnow@example.com"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                />
              </div>

              {accountType === 'user' && (
                <>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>
                </>
              )}

              {accountType === 'ngo' && (
                <>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Enter organization name"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Enter registration number"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              {(formError || error) && <p className="text-red-500 text-center">{formError || error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
