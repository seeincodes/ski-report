"use client";
import styles from "./page.module.css";
import Header from "./components/HeaderComponent";
import IkonWeatherComponent from "./components/IkonWeatherComponent";
import Footer from "./components/FooterComponent";

export default function Home() {
  return (
    <div className={styles.main}>
      <Header />
      <IkonWeatherComponent />
      <Footer />
    </div>
  );
}
