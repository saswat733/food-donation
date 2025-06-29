import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./components/footer.jsx";
import DontationPage from "./pages/UserDonationPage.jsx";
import UserDonationApplication from "./pages/UserDonationApplications.jsx";
import NgoDonationsPage from "./pages/NgoDonationsPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import VolunteerForm from "./pages/Volunteer.jsx";
import Login from "./pages/LoginPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import OrganizationDashboard from "./pages/OrganizationDashboard.jsx";
import UserDashboard from "./pages/IndividualDashboard.jsx";
import OrganizationProfile from "./components/organization/OrganizationProfilePage.jsx";
import DonorsPage from "./components/organization/OrganizationDonors.jsx";
import DonatePage from "./pages/Donations.jsx";
import WasteCollectionForm from "./pages/WasteCollectionForm.jsx";
import FoodDonationPage from "./pages/Donations.jsx";
import FoodVendorPage from "./pages/FoodVendor.jsx";
import DonationsPage from "./components/organization/OrganizationDonationPage.jsx";
import VolunteersPage from "./components/organization/Volunteers.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import RestaurantProfile from "./pages/RestaurantProfile.jsx";
import OrganizationPage from "./components/individual/OrganizationPage.jsx";
import ProfilePage from "./components/individual/ProfilePage.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user ,loading} = useAuth();

  if(loading) return false;

  // Check if we should hide header/footer
  const shouldHideHeaderFooter = () => {
    // Always hide on these paths regardless of auth status
    const alwaysHiddenPaths = ["/register","/login"];
    if (alwaysHiddenPaths.includes(location.pathname)) {
      return true;
    }

    // Hide on dashboard paths when user is logged in
    const dashboardPaths = [
      "/organization-dashboard",
      "/individual-dashboard",
      "/organization-dashboard/", 
      "/individual-dashboard/",
      "/restaurant-dashboard", 
      "/restaurant-dashboard/",
    ];

    const isDashboardPath = dashboardPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    // console.log("isDashboardPath", isDashboardPath);
    // console.log("user", user);

    return user && isDashboardPath;
  };

  const hideHeaderFooter = shouldHideHeaderFooter();

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Router>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/donation-form" element={<DontationPage />} />
                <Route
                  path="/donation-applications"
                  element={<UserDonationApplication />}
                />
                <Route path="*" element={<h1>Not Found</h1>} />
                <Route
                  path="/all-applications"
                  element={<NgoDonationsPage />}
                />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/donate" element={<FoodDonationPage />} />
                <Route
                  path="/waste-collection-form"
                  element={<WasteCollectionForm />}
                />
                <Route path="/food-vendor-form" element={<FoodVendorPage />} />
                <Route path="/volunteer" element={<VolunteerForm />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/organization-dashboard"
                  element={<OrganizationDashboard />}
                />
                <Route
                  path="/organization-dashboard/profile"
                  element={<OrganizationProfile />}
                />
                <Route
                  path="organization-dashboard/donors"
                  element={<DonorsPage />}
                />
                <Route
                  path="organization-dashboard/donations"
                  element={<DonationsPage />}
                />
                <Route
                  path="organization-dashboard/volunteers"
                  element={<VolunteersPage />}
                />
                <Route
                  path="/individual-dashboard"
                  element={<UserDashboard />}
                />
                <Route
                  path="/individual-dashboard/organizations"
                  element={<OrganizationPage />}
                />
                <Route
                  path="/individual-dashboard/profile"
                  element={<ProfilePage />}
                />

                <Route
                  path="/restaurant-dashboard"
                  element={<RestaurantDashboard />}
                />
                <Route
                  path="/restaurant-dashboard/profile"
                  element={<RestaurantProfile />}
                />

              </Routes>
            </Layout>
          </AuthProvider>
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
