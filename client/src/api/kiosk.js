// client/src/api/kiosk.js
import axios from "axios";

const BASE_DRINKS_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URL}/api/drinks`
    : "http://localhost:3001/api/drinks";

const BASE_ORDER_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URL}/api/order`
    : "http://localhost:3001/api/order";


export const getDrinks = async () => {
  try {
    const res = await axios.get(BASE_DRINKS_URL);
    // Make sure we always return an array
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("Warning: drinks API did not return an array", res.data);
      return [];
    }
  } catch (err) {
    console.error("Error fetching drinks:", err.message || err);
    return []; // fallback to empty array
  }
};


export const placeOrder = async (orderItems) => {
  try {
    const res = await axios.post(BASE_ORDER_URL, orderItems, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error placing order:", err);
    throw err;
  }
};
