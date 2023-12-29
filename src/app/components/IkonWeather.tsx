"use client";
import Link from "next/link";
import styles from "./ikon.module.css";
import { SnowflakeIcon } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "../utlis/supabase";

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

  async function getWeather() {
    const nowInMountainTime = new Date().toLocaleString("en-US", {
      timeZone: "America/Denver",
    });
    const dateInMountainTime = new Date(nowInMountainTime);
    const year = dateInMountainTime.getFullYear();
    const month = String(dateInMountainTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateInMountainTime.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    // Check if data for today already exists
    let { data: existingData, error } = await supabase
      .from("snow")
      .select("*")
      .eq("date", today);

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (existingData && existingData.length > 0) {
      // Use existing data
      setResorts(existingData);
    } else {
      // Fetch new data and insert into database
      for (const resort of resorts) {
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${resort.lat}&lon=${resort.long}&exclude=hourly,minutely&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const data = await response.json();

        // Format the data as needed
        const newData = {
          name: resort.name,
          temp: `${data.current.temp} °F`,
          snowfall: data.daily[0].snow ? `${data.daily[0].snow} in` : "0 in",
          date: today,
        };

        // Insert data into Supabase
        const { data: snow, error } = await supabase
          .from("snow")
          .insert([newData]);
        if (error) {
          console.error("Error inserting data:", error);
        }

        resort.temp = data.current.temp + " °F";
        if (data.daily[0].snow == undefined) {
          resort.snowfall = "0 in";
        } else {
          resort.snowfall = data.daily[0].snow + " in";
        }
      }

      // Fetch and set all data for today
      const { data: updatedData } = await supabase
        .from("snow")
        .select("*")
        .eq("date", today);
    }

    setResorts([...resorts]);
  }

  useEffect(() => {
    getWeather();
  }, []);

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
