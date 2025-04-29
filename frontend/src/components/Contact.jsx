import React from 'react';

const Contact = () => {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 rounded-full">
                        Get in touch
                    </span>

                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Our Team</span>
                    </h1>

                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        We're here to help and answer any questions you might have about food donations.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
                    {/* Email Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                        <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Email</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Our friendly team is here to help.</p>
                            <a 
                                href="mailto:hello@foodshare.com" 
                                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                hello@foodshare.com
                            </a>
                        </div>
                    </div>

                    {/* Office Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                        <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Office</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Come say hello at our office HQ.</p>
                            <address className="mt-4 not-italic text-gray-600 dark:text-gray-400">
                                123 Food Share Ave<br />
                                San Francisco, CA 94107
                            </address>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                        <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Phone</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Mon-Fri from 8am to 5pm.</p>
                            <a 
                                href="tel:+15550000000" 
                                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                +1 (555) 000-0000
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form (Optional) */}
                <div className="mt-20 max-w-2xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-20 blur-lg"></div>
                        <form className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Your name"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                className="mt-6 w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold hover:shadow-lg transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;