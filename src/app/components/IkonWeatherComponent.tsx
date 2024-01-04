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
  baseDepth: string;
  trails: string;
  lat: string;
  long: string;
  website: string;
  state: string;
  pass: string;
};

export default function IkonWeatherComponent() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedState, setSelectedState] = useState("");

  async function fetchResorts() {
    let { data: resortsData, error } = await supabase
      .from("resorts")
      .select("*");
    if (error) throw error;
    // console.log("Resorts from fetch", resortsData);
    updateResorts(resortsData);
  }

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

  async function updateReport(resorts: any, existingData: any) {
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

  async function updateResorts(resorts: any) {
    const updatedResorts = resorts.map((resort: any) => {
      return {
        ...resorts,
        name: resort?.name || "N/A",
        state: resort?.state || "N/A",
        website: resort?.website || "N/A",
        lat: resort?.lat || "N/A",
        long: resort?.long || "N/A",
        pass: resort?.pass || "N/A",
      };
    });
    console.log("Resorts before from update in database", resorts);
    setResorts([...updatedResorts]);
    console.log("Resorts from update in database", resorts);
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
      const resortsFromDB = await fetchResorts();

      if (existingData && existingData.length > 0) {
        await updateReport(resorts, existingData);
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
        <p className={styles.header}>Daily snowfall at Ikon pass resorts</p>
      </div>
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value=''>Select a State</option>
        <option value='Colorado'>Colorado</option>
        <option value='Vermont'>Vermont</option>
      </select>

      <div className={styles.grid}>
        {resorts
          // .filter(
          //   (resort) => resort.state === selectedState || selectedState === ""
          // )
          .map((resort) => (
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
