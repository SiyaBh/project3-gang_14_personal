import axios from 'axios';

export const getProductUsage = async () => {
  const res = await axios.get('http://localhost:3001/api/trends');
  return res.data;
};