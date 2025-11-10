// client/src/api/ingredients.js
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_SERVER_URL}/api/ingredients`;

export const getIngredients = () => axios.get(BASE_URL).then((res) => res.data);
export const addIngredient = (ingredient) => axios.post(BASE_URL, ingredient);
export const updateIngredient = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteIngredient = (id) => axios.delete(`${BASE_URL}/${id}`);