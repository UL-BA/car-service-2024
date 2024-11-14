import Navbar from './components/Navbar'
import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Navbar />
      </div>
    </header>
  )
}
