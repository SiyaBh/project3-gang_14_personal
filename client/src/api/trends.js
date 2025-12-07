import axios from 'axios';
const BASE_API = process.env.REACT_APP_API_URL || "http://localhost:3001";


export const getProductUsage = async () => {
  const res = await axios.get(`${BASE_API}/api/trends`);
  return res.data;
};

export const getXReport = async () => {
  const res = await axios.get(`${BASE_API}/api/trends/x-report`);
  return res.data;
};

export const getZReport = async () => {
  const res = await axios.get(`${BASE_API}/api/trends/z-report`);
  return res.data;
};
