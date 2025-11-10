import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_SERVER_URL}/api/order'`;


export const getOrders = () => axios.get(`${BASE_URL}`).then(res => res.data);

// Place a new order
export const placeOrder = (order) => axios.post(`${BASE_URL}`, order).then(res => res.data);