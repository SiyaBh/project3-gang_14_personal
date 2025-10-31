import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// TODO - need to connect to login API functionality 

export default function Login () {
    const {login} = useContext(AuthContext);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!role) return alert("Please select a role to login.");

        // TODO replace with backend Google OAuth login
        login({name: "Test User", role});

        if (role == "manager") navigate("/manager");
        else if (role == "cashier") navigate("/cashier");
    };

    return (
        <div>
            <h2>
                Employee Login
            </h2>
            <select 
                value = {role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
            </select>

            <button 
                onClick={handleLogin}
            >
                Log In
            </button>
            <p>
                TODO - Replace with Google OAuth
            </p>
        </div>
    );
}
