"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { SnowflakeIcon } from "./types";
import { useEffect, useState } from "react";

export default function Home() {
  const [isWeatherLoaded, setIsWeatherLoaded] = useState(false);

  const [resorts, setResorts] = useState([
    {
      name: "Winter Park",
      temp: "",
      snowfall: "",
      lat: 39.8868,
      long: -105.7625,
      website: "https://www.winterparkresort.com/the-mountain/mountain-report",
    },
    {
      name: "Copper Mountain",
      temp: "",
      snowfall: "",
      lat: 39.502,
      long: -106.1511,
      website:
        "https://www.coppercolorado.com/the-mountain/conditions-weather/snow-report",
    },
    {
      name: "Steamboat Springs",
      temp: "",
      snowfall: "",
      lat: 40.485,
      long: -106.8317,
      website: "https://www.steamboat.com/the-mountain/mountain-report",
    },
    {
      name: "Arapahoe Basin",
      temp: "",
      snowfall: "",
      lat: 39.6426,
      long: -105.8719,
      website: "https://www.arapahoebasin.com/snow-report/#snowReport",
    },
    {
      name: "Eldora",
      temp: "",
      snowfall: "",
      lat: 39.937529,
      long: -105.582795,
      website: "https://www.arapahoebasin.com/snow-report/#snowReport",
    },
  ]);

  async function getWeather() {
    if (isWeatherLoaded) return;

    for (let resort of resorts) {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${resort.lat}&lon=${resort.long}&exclude=hourly,minutely&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      // const response = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.long}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      // );
      const data = await response.json();
      // Update the temperature and snowfall in the resort object
      console.log("Weather Data", data);
      resort.temp = data.current.temp + " °F";
      resort.snowfall = data.daily[0].snow + " in";
    }

    // Update the state with the new resorts data
    setResorts([...resorts]);
    console.log("Resorts", resorts);
    setIsWeatherLoaded(true);
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textCenter}>
        <h1>Snow Report</h1>
        <h2>Daily snowfall at Ikon pass resorts in Colorado</h2>
      </div>
      <div className={styles.grid}>
        {resorts.map((resort) => (
          <div key={resort.name} className={styles.card}>
            <Link target='_blank' href={resort.website} passHref>
              <div className={styles.cardHeader}>
                {resort.name}
                <SnowflakeIcon />
              </div>
              <div className={styles.cardContent}>
                <p>Temp: {resort.temp}</p>
                <p>Snowfall: {resort.snowfall}</p>
                <p>Visit their site</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
