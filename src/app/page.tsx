import Link from "next/link";
import styles from "./page.module.css";
import { SnowflakeIcon } from "./types";

export default function Home() {
  const resorts = [
    {
      name: "Winter Park",
      temp: "25°F",
      snowfall: '8"',
      website: "https://www.winterparkresort.com/",
    },
    {
      name: "Copper Mountain",
      temp: "23°F",
      snowfall: '6"',
      website: "https://www.coppercolorado.com/",
    },
    {
      name: "Steamboat Springs",
      temp: "28°F",
      snowfall: '10"',
      website: "https://www.steamboat.com/",
    },
    {
      name: "Arapahoe Basin",
      temp: "22°F",
      snowfall: '7"',
      website: "https://www.arapahoebasin.com/",
    },
  ];

  async function getWeather(location: string) {
    return fetch(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h1>Ikon Pass Ski Resorts in Colorado</h1>
          </div>
          <div className={styles.grid}>
            {resorts.map((resort) => (
              <div key={resort.name} className={styles.card}>
                <div className={styles.cardHeader}>
                  {resort.name}
                  <SnowflakeIcon />
                </div>
                <div className={styles.cardContent}>
                  <p>Temperature: {resort.temp}</p>
                  <p>Snowfall: {resort.snowfall}</p>
                  <Link target='_blank' href={resort.website} passHref>
                    Visit Site
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
