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

  const handleStartKiosk = () =>{
    if(!customerName.trim()){
      alert("Please enter your name to continue");
      return;
    }
    navigate("/kiosk",{
      state : {name : customerName}
    });
  };

  return (
    <div className={`welcome-container ${highContrast ? "accessible" : ""}`}>

    <div className="header">
      <h1 className="header-title"><T text="Welcome to Boba By Taele!" /></h1>
      <img src="/images/boba_by_taele.png" alt="Boba By Taele Logo" className="logo" style={{ width: "150px", height: "125px", borderRadius: "50%" }}/>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <LangaugeMenu />
        <button className="accessibility-toggle" onClick={toggleHighContrast}>
          {highContrast ? <T text="Normal Mode" /> : <T text="High Contrast Mode" />}
        </button>
        <button onClick={() => navigate("/login")} className="header-button">
          <T text="Employee Login" />
        </button>
      </div>
    </div>

    <div className="welcome-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", marginTop: "50px" }}>
      <img src="/images/dog_tea.webp" alt="dog with tea" className="welcome-image" style={{ width: "400px", height: "400px" }} /> 
      
      <div className="weather-container">
        <Weather />
      </div>

      <img src="/images/share_tea_welcome1.webp" alt="2 share tea drinks" className="welcome-image" style={{ width: "400px", height: "400px" }}/>
    </div>
    
    <div className="enter_the_self_checkout_kiosk" style={{ textAlign: "center", marginTop: "30px" }}>
      <h2><T text="Start Self Checkout" /></h2>
      <input
        type="text"
        placeholder={placeholder}
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="name-input"
      />
      <button className="start-kiosk" onClick={handleStartKiosk}>
        <T text="Start Self Checkout" />
      </button>
    </div>
  </div>
  );
}
