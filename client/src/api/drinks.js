import axios from 'axios';
const BASE_URL = 'http://localhost:3001/api/drinks';


export const getDrinks = () => axios.get(BASE_URL).then((res) => res.data); // ensures we get an array
export const addDrink = (drink) => axios.post(BASE_URL, drink);
export const updateDrink = (name, data) => {
  const safeName = encodeURIComponent(name);
  const safePrice =
    data.price === '' || data.price === null || data.price === undefined
      ? null
      : Number(data.price);
  const payload = {
    price: safePrice,
    product_type: data.product_type,
    season: data.season,
    available_months: data.available_months,
    image_url: data.image_url,
  };
  return axios.put(`${BASE_URL}/${safeName}`, payload);
};
export const deleteDrink = (name) => {
  const safeName = encodeURIComponent(name);
  axios.delete(`${BASE_URL}/${safeName}`);
}
