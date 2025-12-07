import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        try {
            const res = await axios.post("http://localhost:3001/auth/google", {
            credential: response.credential
            });

            const userData = {
            name: res.data.name,
            email: res.data.email,
            role: res.data.role.toLowerCase(), // normalize role to lowercase
            picture: res.data.picture
            };

            login(userData);

            if (userData.role === "manager") navigate("/manager");
            else if (userData.role === "cashier") navigate("/cashier");

        } catch (err) {
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
