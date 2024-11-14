import styles from './navbar.module.scss'

function Navbar() {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <a className={styles.link} href="#">
            Home
          </a>
        </li>
        <li className={styles.item}>
          <a className={styles.link} href="#">
            About
          </a>
        </li>
        <li className={styles.item}>
          <a className={styles.link} href="#">
            Workshows
          </a>
        </li>
        <li className={styles.item}>
          <a className={styles.link} href="#">
            Testimonials
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navbar