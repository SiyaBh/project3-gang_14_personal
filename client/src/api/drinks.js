import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/drinks';


export const getDrinks = () => axios.get(BASE_URL).then((res) => res.data); // ensures we get an array
export const addDrink = (drink) => axios.post(BASE_URL, drink);
export const updateDrink = (name, data) => {
  const payload = {
    price: parseFloat(data.price),
    product_type: data.product_type,
    season: data.season,
    available_months: data.available_months
  };
  return axios.put(`${BASE_URL}/${name}`, payload);
};
export const deleteDrink = (name) => axios.delete(`${BASE_URL}/${name}`);
