import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Footer from './components/footer.jsx';
import DontationPage from './pages/UserDonationPage.jsx';
import UserDonationApplication from './pages/UserDonationApplications.jsx';
import NgoDonationsPage from './pages/NgoDonationsPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import VolunteerForm from './pages/Volunteer.jsx';
import Login from './pages/LoginPage.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/sign-in' && <Header />}
      {children}
      {location.pathname !== '/sign-in' && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
    <div className="min-h-screen flex flex-col">

      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/donation-form" element={<DontationPage />} />
            <Route
              path="donation-applications"
              element={<UserDonationApplication />}
            />
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/all-applications" element={<NgoDonationsPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/volunteer" element={<VolunteerForm />} />
            <Route path="/sign-in" element={<Login />} />
          </Routes>
        </Layout>
      </Router>

    </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
