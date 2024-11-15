import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mainSection.module.scss";

function MainSection() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/workshops");
  };

  return (
    <section className={styles.mainSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>Choose The Best Care</h2>
        <h3 className={styles.subheading}>
          Find a workshop for your car today!
        </h3>
        <button className={styles.exploreButton} onClick={handleExploreClick}>
          Explore Workshops
        </button>
      </div>
    </section>
  );
}

export default MainSection;
