import React from 'react';
import styles from './togglemenu.module.scss';

const WorkshopToggleMenu = () => {
  return (
    <div className={styles.menuContainer}>
      <a 
        href="/car-services" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.menuButton}
      >
        <div className={styles.buttonContent}>
          <div className={styles.buttonTitle}>
            Looking for where to FIX your car?
          </div>
          <div className={styles.buttonSubtitle}>
            Find trusted repair services
          </div>
        </div>
      </a>
      
      <a
        href="/car-washes"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.menuButton} ${styles.washButton}`}
      >
        <div className={styles.buttonContent}>
          <div className={styles.buttonTitle}>
            Looking for where to WASH your car?
          </div>
          <div className={styles.buttonSubtitle}>
            Discover car wash locations
          </div>
        </div>
      </a>
    </div>
  );
};

export default WorkshopToggleMenu;