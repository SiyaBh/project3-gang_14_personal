import axios from 'axios';

export const getProductUsage = async () => {
  const res = await axios.get('http://localhost:3001/api/trends');
  return res.data;
};


export const getXReport = async () => {
  const res = await axios.get('http://localhost:3001/api/trends/x-report');
  return res.data;
};

export const getZReport = async () => {
  const res = await axios.get('http://localhost:3001/api/trends/z-report');
  return res.data;
};
