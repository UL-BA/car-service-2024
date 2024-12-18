import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./components/Navbar";
import styles from "./header.module.scss";
import logo from "../../assets/logo.jpg";

export default function Header() {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </a>
        <Navbar />
      </div>
    </header>
  );
}
