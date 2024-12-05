import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import InfoSection from "./components/InfoSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import LoginSignupPage from "./components/LoginSignupPage";
import styles from "./app.module.scss";

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
              <ServicesSection id="workshops" />
              <TestimonialsSection id="testimonials" />
            </>
          }
        />

        {/* Login/Signup Page */}
        <Route path="/login" element={<LoginSignupPage />} />
      </Routes>

      <Footer />
    </div>
  </Router>
  );
}

export default App;