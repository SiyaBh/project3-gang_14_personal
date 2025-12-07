import { useNavigate } from "react-router-dom";
import "../../styles/portal.css";

export default function Portal() {
  const navigate = useNavigate();

  return (
    <>
    <div className="portal-container">
        <button className="portal-button" onClick={() => navigate("/login")}>Manager Dashboard</button>
        <button className="portal-button"  onClick={() => navigate("/login")}>Cashier Dashboard</button>
        <button className="portal-button" onClick={() => navigate("/welcome")}>Customer Kiosk</button>
    </div>

    </>
  );
  
}

