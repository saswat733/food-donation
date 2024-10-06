import { Link } from "react-router-dom";

export default function Header() {
    return (
        <>
            <h1>
                <nav className="bg-white shadow dark:bg-gray-800">
                    <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
                        <Link to="/" className="text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-green-500 mx-1.5 sm:mx-6">
                            Home
                        </Link>

                        <Link to="/donate-food" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-green-500 mx-1.5 sm:mx-6">
                            Donate Food
                        </Link>

                        <Link to="/how-it-works" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-green-500 mx-1.5 sm:mx-6">
                            How It Works
                        </Link>

                        <Link to="/about-us" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-green-500 mx-1.5 sm:mx-6">
                            About Us
                        </Link>

                        <Link to="/contact" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-green-500 mx-1.5 sm:mx-6">
                            Contact
                        </Link>

                        <Link to="/volunteer" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-green-500 mx-1.5 sm:mx-6">
                            Volunteer
                        </Link>
                    </div>
                </nav>
            </h1>
        </>
    );
}
