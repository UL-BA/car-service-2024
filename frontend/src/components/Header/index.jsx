import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import styles from "./header.module.scss";
import logo from "../../assets/logo-removebg-preview.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div id="home" className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
        <Navbar />
      </div>
    </header>
  );
}
