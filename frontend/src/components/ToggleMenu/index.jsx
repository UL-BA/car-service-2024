import { Link } from 'react-router-dom';
import styles from './togglemenu.module.scss';

const WorkshopToggleMenu = () => {
  return (
    <div className={styles.menuContainer}>
      <Link to="/car-services" className={styles.menuButton}>
        <div className={styles.buttonContent}>
          <div className={styles.buttonTitle}>
            Looking for where to FIX your car?
          </div>
          <div className={styles.buttonSubtitle}>
            Find trusted repair services
          </div>
        </div>
      </Link>
      
      <Link to="/car-washes" className={`${styles.menuButton} ${styles.washButton}`}>
        <div className={styles.buttonContent}>
          <div className={styles.buttonTitle}>
            Looking for where to WASH your car?
          </div>
          <div className={styles.buttonSubtitle}>
            Discover car wash locations
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WorkshopToggleMenu;
