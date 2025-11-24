// client/src/api/kiosk.js
import axios from "axios";

const BASE_DRINKS_URL = "http://localhost:3001/api/kiosk/drinks";
const BASE_ORDER_URL = "http://localhost:3001/api/kiosk/order";

export const getDrinks = async () => {
  try {
    const res = await axios.get(BASE_DRINKS_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching drinks:", err);
    return [];
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
