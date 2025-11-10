import axios from 'axios';

export const getProductUsage = async () => {
  const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/trends`);
  return res.data;
};


export const getXReport = async () => {
  const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/trends/x-report`);
  return res.data;
};

export const getZReport = async () => {
  const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/trends/z-report`);
  return res.data;
};
