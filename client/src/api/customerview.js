import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/customerview';


export const getDrinks = () => axios.get(`${BASE_URL}/drinks`).then(res => res.data);


export const getOrders = () => axios.get(`${BASE_URL}/orders`).then(res => res.data);

// Place a new order
export const placeOrder = (order) => axios.post(`${BASE_URL}/orders`, order).then(res => res.data);
