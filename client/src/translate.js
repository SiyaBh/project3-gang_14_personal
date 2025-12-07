import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/translate`
  : 'http://localhost:3001/api/translate';

export const translateText = async (text, target) => {
  try {
    const response = await axios.post(BASE_URL, {text, target});

    return response.data; 
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};