import Navbar from "./components/Navbar";
import styles from "./header.module.scss";
import logo from "../../assets/logo-removebg-preview.png";


export default function Header() {
 return (
   <header className={styles.header}>
     <div className={styles.container}>
       <div id="home" className={styles.logo}>
         <img src={logo} alt="Logo" className={styles.logoImage} />
       </div>
       <Navbar />
     </div>
   </header>
 );
}
