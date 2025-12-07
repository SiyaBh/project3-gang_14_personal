import axios from 'axios';


const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URL}/api/drinks`
    : "http://localhost:3001/api/drinks";


export const getDrinks = () => axios.get(BASE_URL).then((res) => res.data);

export const addDrink = (drink) => axios.post(BASE_URL, drink).then(res => res.data);

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
  return axios.put(`${BASE_URL}/${safeName}`, payload).then(res => res.data);
};

export const deleteDrink = (name) => {
  const safeName = encodeURIComponent(name);
  return axios.delete(`${BASE_URL}/${safeName}`).then(res => res.data);
};
