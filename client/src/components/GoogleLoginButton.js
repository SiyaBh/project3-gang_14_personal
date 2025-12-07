import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    const handleSuccess = async (response) => {
        try {
            console.log("Attempting login to:", `${API_URL}/auth/google`);

            const res = await axios.post(`${API_URL}/auth/google`, {
                credential: response.credential
            });

            const userData = {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role.toLowerCase(),
                picture: res.data.picture
            };

            login(userData);

            if (userData.role === "manager") navigate("/manager");
            else if (userData.role === "cashier") navigate("/cashier");

        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            alert("Unauthorized Employee");
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login Failed")}
        />
    );
}
