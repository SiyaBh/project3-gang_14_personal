import axios from 'axios';


const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URL}/api/drinks`
    : "http://localhost:3001/api/drinks";



export const getDrinks = () => axios.get(BASE_URL).then((res) => res.data); // ensures we get an array
export const addDrink = (drink) => axios.post(BASE_URL, drink);
export const updateDrink = (id, data) => {
  const safePrice =
    data.price === '' || data.price === null || data.price === undefined
      ? null
      : Number(data.price);
  const payload = {
    product_name: data.product_name,
    price: safePrice,
    product_type: data.product_type,
    season: data.season,
    available_months: data.available_months,
    image_url: data.image_url,
    description: data.description
  };
  return axios.put(`${BASE_URL}/${id}`, payload);
};
export const deleteDrink = (id) => axios.delete(`${BASE_URL}/${id}`);