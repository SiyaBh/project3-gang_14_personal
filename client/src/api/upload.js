
import axios from "axios";

// Base API URL (Render in production, localhost in development)
const BASE_API = process.env.REACT_APP_API_URL || "http://localhost:3001";

// ========== IMAGE UPLOAD ==========
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${BASE_API}/api/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.imageUrl;
};
