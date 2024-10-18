import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import SignInPage from './pages/LoginPage.jsx';
import Footer from './components/footer.jsx';
import DontationPage from './pages/UserDonationPage.jsx';
import UserDonationApplication from './pages/UserDonationApplications.jsx';
import NgoDonationsPage from './pages/NgoDonationsPage.jsx';

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
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/donation-form' element={<DontationPage/>}/>
          <Route path='donation-applications' element={<UserDonationApplication/>}/>
          <Route path='*' element={<h1>Not Found</h1>} />
          <Route path='/all-applications' element={<NgoDonationsPage/>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
