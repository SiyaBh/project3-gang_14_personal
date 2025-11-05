import { useEffect, useState } from "react";
import { getWeatherData } from "../api/weatherAPI";

export default function Weather() {//hello
    const[temperature, setTemperature] = useState(0.0); //temp is the state, setTemp is how it updates
    const[weath, setWeath] = useState(null);
    const[id, setId] = useState(0);
    //const[weathImage, setWeathImage] = useState(null);
    //const weatherImage = document.createElement("p");

    const fetchData = async () => {
        try {
            const data = await getWeatherData();
            setTemperature(data.main.temp);
            setWeath(data.weather[0].description);
            //setId(data.weather[0].id);
            const weatherData = await getWeatherImage(data.weather[0].id);
            setId(weatherData);
            //setWeathImage(getWeatherImage(id));
            //weatherImage.textContent = getWeatherImage(id);
        } catch(error) {
            console.error("Failed to fetch weather: ", error);
        }
    }

    useEffect (() => {
        fetchData();
        const interval = setInterval(fetchData, 3600000)

        return () => clearInterval(interval);
    }, [])

    return (
        <div style={{
            display: "flex",
            alignItems: "center",   
            justifyContent: "space-between",
            backgroundColor: "#030303",
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            width: "fit-content",
            gap: "20px"
            
        }}>
            {}
            <div>{id}</div>
            {}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "20px" }}>
            <div style={{ fontSize: "16px", opacity: 0.8 }}>College Station, USA</div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{temperature}°F | {weath}</div>
  </div>
        </div>
    )
}

function getWeatherImage(weatherId) {
    switch(true) {
        case(weatherId >= 200 && weatherId < 300):
            return "thunderstorm";
        case(weatherId >= 300 && weatherId < 400):
            return "drizzle";
        case(weatherId >= 500 && weatherId < 600):
            return "rain";
        case(weatherId >= 600 && weatherId < 700):
            return "snow";
        case(weatherId >= 700 && weatherId < 800):
            return "atmosphere";
        case(weatherId === 800):
            return "clear skies";
        case(weatherId >= 801 && weatherId < 810):
            return "clouds";
        default:
            return "";
    }

}

