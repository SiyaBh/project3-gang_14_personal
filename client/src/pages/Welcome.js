import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Weather from "../components/weather";

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.role === "manager") navigate("/manager");
      else if (user.role === "cashier") navigate("/cashier");
    }
  }, [user, navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: colors.primary,
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{
            color: colors.secondary,
            margin: 0,
            fontSize: '32px',
            fontWeight: 'bold',
          }}>
            Welcome to ShareTea Boba!
          </h1>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: colors.secondary,
              color: colors.primary,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s',
            }}
          >
            Employee Login
          </button>
        </div>

      </div>
      <div style={{
        display: "flex",
        justifyContent: "center"
      }}>
        <Weather />
      </div>
    </div>
  );
}
