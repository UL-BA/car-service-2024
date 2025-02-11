import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import InfoSection from "./components/InfoSection";
import ServicesSection from "./components/ServicesSection";
import CarWashes from "./components/CarWashes";
import WorkshopToggleMenu from "./components/ToggleMenu";
import TestimonialsSection from "./components/TestimonialsSection";
import LoginSignupPage from "./components/LoginSignupPage";
import ProfilePage from "./components/ProfilePage";
import WorkshopDetails from "./components/WorkshopDetails";
import { LoadScript } from "@react-google-maps/api";
import styles from "./app.module.scss";
import config from "./config";
import AdminPage from "./components/AdminPage/index";

const API_KEY = config.GOOGLE_MAPS_API_KEY;

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

function ScrollToSectionHandler() {
  const location = useLocation();

  React.useEffect(() => {
    const sectionId = location.hash.replace("#", ""); // Get section ID from hash
    if (sectionId) {
      requestAnimationFrame(() => {
        scrollToSection(sectionId);
      });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <Router>
        <div className={styles.main_container}>
          <Header />
          <ScrollToSectionHandler />
          <Routes>
            {/* Home and main sections */}
            <Route
              path="/"
              element={
                <>
                  <MainSection id="home" />
                  <InfoSection id="info" />
                  <WorkshopToggleMenu id="togglemenu" />
                  <TestimonialsSection id="testimonials" />
                </>
              }
            />

            {/* Car services and car washes */}
            <Route path="/car-services" element={<ServicesSection />} />
            <Route path="/car-washes" element={<CarWashes />} />

            {/* Workshop details */}
            <Route path="/workshop/:id" element={<WorkshopDetails />} />

            {/* Login and profile pages */}
            <Route path="/login" element={<LoginSignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin page */}
            <Route path="/admin/services" element={<AdminPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LoadScript>
  );
}

export default App;
