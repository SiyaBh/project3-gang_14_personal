import axios from "axios";

const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

export const getWeatherData = () => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=College%20Station,US&appid=${apiKey}&units=imperial`).then((res) => res.data);