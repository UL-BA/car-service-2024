import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mainSection.module.scss";
import { useTranslation } from 'react-i18next';

function MainSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("#workshops");
  };

  return (
    <section className={styles.mainSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>{t("main.title")}</h2>
        <h3 className={styles.subheading}>
          {t("main.subtitle")}
        </h3>
        <button className={styles.exploreButton} onClick={handleExploreClick}>
          {t("main.explore")}
        </button>
      </div>
    </section>
  );
}

export default MainSection;
