import Link from "next/link";
import styles from "./header.module.css"; // Assuming you use CSS Modules

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.font}>Juniper Snow Report</h1>
      {/* <nav>
        <Link href='/'>Home</Link> {""}
        <Link href='/about'>About</Link>{" "}
        <a href='mailto:seeinplays@gmail.com'>Contact</a>
      </nav> */}
    </header>
  );
}

export default Header;
