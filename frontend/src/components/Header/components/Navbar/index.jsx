import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.scss";

function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (hash) => {
    // Scroll to the section with an offset
    const element = document.getElementById(hash);
    if (element) {
      const offset = -50; // Adjust this value for the desired upward scroll
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
            Home
          </button>
        </li>
        <li className={styles.item}>
          <button onClick={() => handleNavigation("about")}>
            About
          </button>
        </li>
        <li className={styles.item}>
          <button className={styles.link} onClick={() => handleNavigation("workshops")}>
            Workshops
          </button>
        </li>
        <li className={styles.item}>
          <button className={styles.link} onClick={() => handleNavigation("testimonials")}>
            Testimonials
          </button>
        </li>
        <li className={styles.item}>
          <button className={styles.link} onClick={() => navigate("/login")}>
            Log In
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
