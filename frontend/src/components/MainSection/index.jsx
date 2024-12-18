import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mainSection.module.scss";
import { useTranslation } from "react-i18next";
import video from "../../assets/3486737129-preview.mp4";

function MainSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("#workshops");
  };

  return (
    <section className={styles.mainSection}>
      <video className={styles.videoBackground} autoPlay loop muted playsInline>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>{t("main.title")}</h2>
        <h3 className={styles.subheading}>{t("main.subtitle")}</h3>
        <button className={styles.exploreButton} onClick={handleExploreClick}>
          {t("main.explore")}
        </button>
      </div>
    </section>
  );
}

export default MainSection;
