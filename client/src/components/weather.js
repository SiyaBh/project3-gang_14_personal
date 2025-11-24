import { useEffect, useState } from "react";
import { getWeatherData } from "../api/weatherAPI";
import T from "./T";

export default function Weather() {
    const[temperature, setTemperature] = useState(0.0);
    const[weath, setWeath] = useState(null);
    const[id, setId] = useState(0);

    const fetchData = async () => {
        try {
            const data = await getWeatherData();
            setTemperature(data.main.temp);
            setWeath(data.weather[0].description);
            setId(data.weather[0].id)
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
            <img
                src={getWeatherImage(id)}
                alt={weath}
                style={{ width: "50px", height: "50px" }}
            />
            {}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "20px" }}>
            <div style={{ fontSize: "16px", opacity: 0.8 }}><T text = "College Station, USA"/></div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{temperature}°F | <T text = {weath}/></div>
  </div>
        </div>
    )
}

function getWeatherImage(weatherId) {
    switch(true) {
        case(weatherId >= 200 && weatherId < 300):
            return "../../images/thunderstorm.png";
        case(weatherId >= 300 && weatherId < 400):
            return "../../images/drizzle.png";
        case(weatherId >= 500 && weatherId < 600):
            return "../../images/rain.png";
        case(weatherId >= 600 && weatherId < 700):
            return "../../images/snow.png";
        case(weatherId >= 700 && weatherId < 800):
            return "../../images/mist.png";
        case(weatherId === 800):
            return "../../images/sun.png";
        case(weatherId === 801 || weatherId === 802):
            return "../../images/partly-cloudy.png";
        case(weatherId === 803 || weatherId === 804):
            return "../../images/cloudy.png";
        default:
            return "";
    }

}

