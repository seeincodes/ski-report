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
  base: string;
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
      state: "Colorado",
    },
    {
      name: "Copper Mountain",
      temp: "",
      snowfall: "",
      lat: 39.502,
      long: -106.1511,
      website:
        "https://www.coppercolorado.com/the-mountain/conditions-weather/snow-report",
      state: "Colorado",
    },
    {
      name: "Steamboat Springs",
      temp: "",
      snowfall: "",
      lat: 40.485,
      long: -106.8317,
      website: "https://www.steamboat.com/the-mountain/mountain-report",
      state: "Colorado",
    },
    {
      name: "Arapahoe Basin",
      temp: "",
      snowfall: "",
      lat: 39.6426,
      long: -105.8719,
      website: "https://www.arapahoebasin.com/snow-report/#snowReport",
      state: "Colorado",
    },
    {
      name: "Eldora",
      temp: "",
      snowfall: "",
      lat: 39.937529,
      long: -105.582795,
      website: "https://www.eldora.com/",
      state: "Colorado",
    },
    {
      name: "Sugarbush",
      temp: "",
      snowfall: "",
      lat: 44.1356,
      long: -72.9039,
      website: "https://www.sugarbush.com/mountain/conditions",
      state: "Vermont",
    },
    {
      name: "Killington",
      temp: "",
      snowfall: "",
      lat: 43.616928,
      long: -72.794663,
      website: "https://www.killington.com/",
      state: "Vermont",
    },
    {
      name: "Pico Mountain",
      temp: "",
      snowfall: "",
      lat: 43.6632,
      long: -72.843536,
      website: "https://www.picomountain.com/",
      state: "Vermont",
    },
    {
      name: "Stratton",
      temp: "",
      snowfall: "",
      lat: 43.114167,
      long: -72.906667,
      website: "https://www.stratton.com/the-mountain/mountain-report",
      state: "Vermont",
    },
  ]);

  async function fetchWeatherData(resort: any) {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${resort.lat}&lon=${resort.long}&exclude=hourly,minutely&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return await response.json();
  }

  async function fetchDataFromSupabase(date: string) {
    let { data, error } = await supabase
      .from("snow")
      .select("*")
      .eq("date", date);
    if (error) throw error;
    return data;
  }

  async function processAndUpdateResorts(resorts: any, existingData: any) {
    const updatedResorts = resorts.map((resort: any) => {
      const resortDataFromDb = existingData?.find(
        (r: any) => r.name === resort.name
      );
      return {
        ...resort,
        temp: resortDataFromDb?.temp || "N/A",
        snowfall: resortDataFromDb?.snowfall || "N/A",
      };
    });
    setResorts([...updatedResorts]);
  }

  async function getWeather() {
    const nowInMountainTime = new Date().toLocaleString("en-US", {
      timeZone: "America/Denver",
    });
    const dateInMountainTime = new Date(nowInMountainTime);
    const year = dateInMountainTime.getFullYear();
    const month = String(dateInMountainTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateInMountainTime.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    try {
      const existingData = await fetchDataFromSupabase(today);

      if (existingData && existingData.length > 0) {
        await processAndUpdateResorts(resorts, existingData);
      } else {
        for (const resort of resorts) {
          const weatherData = await fetchWeatherData(resort);
          const newData = {
            name: resort.name,
            temp: `${weatherData.current.temp} °F`,
            snowfall: weatherData.daily[0].snow
              ? `${weatherData.daily[0].snow} in`
              : "0 in",
            date: today,
          };
          const { data: snow, error } = await supabase
            .from("snow")
            .insert([newData]);
          if (error) {
            //   console.error("Error inserting data:", error);
          }
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
        <p className={styles.header}>
          Daily snowfall at Ikon pass resorts in Colorado & Vermont
        </p>
      </div>
      <div className={styles.grid}>
        {resorts.map((resort) => (
          <div key={resort.name} className={styles.card}>
            <Link target='_blank' href={resort.website} passHref>
              <div className={styles.cardHeader}>
                <h4>
                  {resort.name} | {resort.state}
                  {/* <SnowflakeIcon /> */}
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
