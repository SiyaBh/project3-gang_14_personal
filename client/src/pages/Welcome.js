import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Weather from "../components/weather";
import "../styles/welcome.css";
import LangaugeMenu from "../components/LanguageMenu";
import T from "../components/T";
import { useTranslation } from "../context/TranslationContext";
import { useAccessibility } from "../context/AccessibilityContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { translate } = useTranslation();
  const [customerName, setCustomerName] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter your name");
  const { highContrast, toggleHighContrast } = useAccessibility();

  useEffect(() => {
    if (user) {
      if (user.role === "manager") navigate("/manager");
      else if (user.role === "cashier") navigate("/cashier");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadPlaceholder = async () => {
      const translated = await translate("Enter your name");
      setPlaceholder(translated);
    };
    loadPlaceholder();
  }, [translate]);

  const handleStartKiosk = () => {
    if (!customerName.trim()) {
      alert("Please enter your name to continue");
      return;
    }
    navigate("/welcome/kiosk", {
      state: { name: customerName },
    });
  };

  return (
    <div className={`welcome-container ${highContrast ? "accessible" : ""}`}>

      {/* HEADER */}
      <div className="header">
        <h1 className="header-title"><T text="Welcome to Boba By Taele!" /></h1>
        <img
          src="/images/boba_by_taele.png"
          alt="Boba By Taele Logo"
          className="logo"
          style={{ width: "150px", height: "125px", borderRadius: "50%" }}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className= "language-menu">
          <LangaugeMenu />
          </div>
          <button className="accessibility-toggle" onClick={toggleHighContrast}>
            {highContrast ? <T text="Normal Mode" /> : <T text="High Contrast Mode" />}
          </button>
          {/* <button onClick={() => navigate("/login")} className="accessibility-toggle">
            <T text="Employee Login" />
          </button> */}
        </div>
      </div>


      <div
        className="welcome-row"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {/* LEFT IMAGE */}
        <img
          src="/images/dog_tea.webp"
          alt="dog with tea"
          className="welcome-image"
          style={{ width: "400px", height: "400px" }}
        />
        <div
          className="enter_the_self_checkout_kiosk"
          style={{
            textAlign: "center",
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <div className="weather-container" style={{ marginTop: "40px" }}>
            <Weather />
          </div>

          <h2><T text="Start Self Checkout" /></h2>
          <input
            type="text"
            placeholder={placeholder}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="name-input"
          />
        </div>

        <img
          src="/images/share_tea_welcome1.webp"
          alt="2 share tea drinks"
          className="welcome-image"
          style={{ width: "400px", height: "400px" }}
        />
      </div>

        <button className="start-kiosk" onClick={handleStartKiosk}>
          <T text="Order Here" />
        </button>

      <footer className={`footer ${highContrast ? "accessible" : ""}`}>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Boba By Taele</h3>
            <p>Freshly Made. Always delicious.</p>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📞 (888) 123-4567</p>
            <p>📧 info@bobabytaele.com</p>
            <p>📍 123 Tapioca Lane, College Station, TX</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>📸 Instagram: @boba_by_taele</p>
            <p>👍 Facebook: Boba By Taele</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Boba By Taele. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
