"use client";
import Link from "next/link";
import styles from "./ikon.module.css";
import { SnowflakeIcon } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "../utlis/supabase";

type Resort = {
  name: string;
  temp: string;
  snowfall: string;
  lat: string;
  long: string;
  website: string;
};

export default function IkonWeatherComponent() {
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
      website: "https://www.eldora.com/",
    },
  ]);

  async function fetchWeatherData(resort) {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${resort.lat}&lon=${resort.long}&exclude=hourly,minutely&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return await response.json();
  }

  async function fetchDataFromSupabase(date) {
    let { data, error } = await supabase
      .from("snow")
      .select("*")
      .eq("date", date);
    if (error) throw error;
    return data;
  }

  async function processAndUpdateResorts(resorts, existingData) {
    const updatedResorts = resorts.map((resort) => {
      const resortDataFromDb = existingData?.find(
        (r) => r.name === resort.name
      );
      return {
        ...resort,
        temp: resortDataFromDb?.temp || "N/A",
        snowfall: resortDataFromDb?.snowfall || "N/A",
      };
    });
    setResorts(updatedResorts);
  }

  async function getWeather() {
    // Code to set 'today' variable...
    try {
      const existingData = await fetchDataFromSupabase(today);
      if (existingData && existingData.length > 0) {
        await processAndUpdateResorts(resorts, existingData);
      } else {
        for (const resort of resorts) {
          const weatherData = await fetchWeatherData(resort);
          // Process and insert new data into Supabase
          // ...
        }
        setResorts([...resorts]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getWeather();
  });

  return (
    <div className={styles.container}>
      <div className={styles.textCenter}>
        <h2 className={styles.header}>
          Daily snowfall at Ikon pass resorts in Colorado
        </h2>
      </div>
      <div className={styles.grid}>
        {resorts.map((resort) => (
          <div key={resort.name} className={styles.card}>
            <Link target='_blank' href={resort.website} passHref>
              <div className={styles.cardHeader}>
                <h4>
                  {resort.name}
                  <SnowflakeIcon />
                </h4>
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
