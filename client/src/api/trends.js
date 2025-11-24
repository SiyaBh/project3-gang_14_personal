import axios from 'axios';

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
