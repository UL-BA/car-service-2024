import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import InfoSection from "./components/InfoSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
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
    const sectionId = location.pathname.replace("/", "");

    if (sectionId) {
      requestAnimationFrame(() => {
        scrollToSection(sectionId);
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <div className={styles.main_container}>
        <Header />
        <ScrollToSectionHandler />

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