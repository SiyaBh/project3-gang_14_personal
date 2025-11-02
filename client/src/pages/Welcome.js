import { useNavigate } from "react-router-dom";

export default function Welcome () {
    const navigate = useNavigate();

    return  (
        <div>
            <h1>
                Welcome to ShareTea Boba!
            </h1>
            <button onClick={() => navigate("/login")}>
                Employee Login
            </button>
        </div>
    )
}