import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/order`
  : 'http://localhost:3001/api/order';


export const getOrders = () => axios.get(`${BASE_URL}`).then(res => res.data);

// Place a new order
export const placeOrder = (order) => axios.post(`${BASE_URL}`, order).then(res => res.data);