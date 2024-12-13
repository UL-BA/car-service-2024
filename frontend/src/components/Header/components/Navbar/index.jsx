import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.scss";
import { useAuth } from '../../../../contexts/AuthContext';
import { FaUser } from 'react-icons/fa';
import LanguageSwitcher from '../../../LanguageSwitcher/index.jsx';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (hash) => {
    const element = document.getElementById(hash);
    if (element) {
      const offset = -50;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <button onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            {t('navigation.home')}
          </button>
        </li>
        <li className={styles.item}>
          <button onClick={() => handleNavigation("about")}>
            {t('navigation.about')}
          </button>
        </li>
        <li className={styles.item}>
          <button className={styles.link} onClick={() => handleNavigation("workshops")}>
            {t('navigation.workshops')}
          </button>
        </li>
        <li className={styles.item}>
          <button className={styles.link} onClick={() => handleNavigation("testimonials")}>
            {t('navigation.testimonials')}
          </button>
        </li>
        <li className={styles.item}>
          {user ? (
            <button 
              className={styles.profileButton}
              onClick={() => navigate('/profile')}
            >
              <FaUser />
            </button>
          ) : (
            <button onClick={() => navigate('/login')}>
              {t('navigation.login')}
            </button>
          )}
        </li>
        <li className={styles.item}>
          <LanguageSwitcher />
         </li>
      </ul>
    </div>
  );
}

export default Navbar;