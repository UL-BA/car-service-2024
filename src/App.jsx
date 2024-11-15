import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import InfoSection from "./components/InfoSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import styles from "./app.module.scss";

// Helper function to scroll to a specific section smoothly
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// Component to handle scrolling based on the URL path
function ScrollToSectionHandler() {
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  React.useEffect(() => {
    const sectionId = location.pathname.replace("/", "");

    if (isFirstLoad) {
      // On first load or reload, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsFirstLoad(false);
    } else if (sectionId) {
      // On navigation, scroll to the specified section
      requestAnimationFrame(() => {
        scrollToSection(sectionId);
      });
    }
  }, [location, isFirstLoad]);

  return null;
}

// Main App Component
function App() {
  return (
    <Router>
      <div className={styles.main_container}>
        <Header />
        <ScrollToSectionHandler />

        {/* Define sections with corresponding IDs */}
        <MainSection id="home" />
        <InfoSection id="info" />
        <ServicesSection id="workshops" />
        <TestimonialsSection id="testimonials" />

        <Footer />
      </div>
    </Router>
  );
}

export default App;