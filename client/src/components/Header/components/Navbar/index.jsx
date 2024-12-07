import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";

function Navbar() {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link className={styles.link} to="/">
            Home
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to="/about">
            About
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to="/workshops">
            Workshops
          </Link>
        </li>
        <li className={styles.item}>
          <Link className={styles.link} to="/testimonials">
            Testimonials
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
