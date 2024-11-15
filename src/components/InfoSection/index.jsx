import React from 'react';
import styles from './infoSection.module.scss';

const Info = () => {
  return (
    <div id="about" className={styles.gridContainer}>
      <nav className={styles.slideDown}>
        <span id={styles.logo}>Be Road Ready.</span>
      </nav>
      <div className={styles.search} />
      <div className={styles.bannerText}>
        <h1>
          For everything <br />
          Your car needs.
        </h1>
      </div>
      <div className={styles.blurredContainer}>
        <div className={styles.blurredBanner}>
          <h2>
            choose quality. <br /> choose us.
          </h2>
          <p className={styles.orangeText}>Our Purpose</p>
          <p>
            With the quality, technology, and expertise that you and your car
            deserve. With transparent billing and fast, reliable service you
            can trust for miles to come.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
