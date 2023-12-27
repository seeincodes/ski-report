import Head from "next/head";
import styles from "../styles/about.module.css";

export default function AboutComponent() {
  return (
    <>
      <Head>
        <title>About Me</title>
      </Head>

      <div className={styles.aboutContainer}>
        <section className={styles.heroSection}>
          <h1>About Me</h1>
          <p>Passionate Snowboarder & Outdoor Enthusiast</p>
        </section>

        <section className={styles.contentSection}>
          <h2>My Journey</h2>
          <p>
            Hi, I'm Xian! I created this site out of my love for snowboarding
            and the great outdoors. Despite the fact that I fall a lot while
            snowboarding, it's the thrill and joy of the sport that keeps me
            going back to the mountains. This site is a reflection of my passion
            and adventures.
          </p>
          <p>
            Whether you're a seasoned snowboarder or just starting out, I hope
            this site provides you with valuable insights and a shared
            appreciation for the beauty of winter sports and nature.
          </p>
          {/* More personal content, images, or videos */}
        </section>

        {/* Additional sections as needed */}
      </div>
    </>
  );
}
