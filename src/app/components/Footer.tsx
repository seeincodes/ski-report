import styles from "./Footer.module.css"; // Assuming you use CSS Modules

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Juniper</p>
      <p>
        <a href='mailto:seeinplays@gmail.com'>Contact us</a>
      </p>
    </footer>
  );
}

export default Footer;
