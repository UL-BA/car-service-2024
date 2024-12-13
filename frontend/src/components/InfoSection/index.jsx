import React from 'react';
import styles from './infoSection.module.scss';
import { useTranslation } from 'react-i18next';

const Info = () => {
  const { t } = useTranslation();

  return (
    <div id="about" className={styles.gridContainer}>
      <nav className={styles.slideDown}>
        <span id={styles.logo}>{t("infoSection.logo")}</span>
      </nav>
      <div className={styles.search} />
      <div className={styles.bannerText}>
        <h1>
          {t("infoSection.bannerHeadline")}
        </h1>
      </div>
      <div className={styles.blurredContainer}>
        <div className={styles.blurredBanner}>
          <h2>
            {t("infoSection.qualityStatement")}
          </h2>
          <p className={styles.orangeText}>{t("infoSection.purposeTitle")}</p>
          <p>
            {t("infoSection.purposeText")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
