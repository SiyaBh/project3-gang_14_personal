import React, { useState } from "react";
import K_OrderPanel from "../../components/KisokMenu/K_OrderPanel";
import "../../styles/kiosk_order_style.css";
import T from "../../components/T";
import { useAccessibility } from "../../context/AccessibilityContext";
import KioskOrderConfirmation from "../../components/KioskOrderConfirmation";
import { useLocation, useNavigate } from "react-router-dom";



export default function OrdersPage({ orderItems, setOrderItems, onCheckout }) {
  const navigate = useNavigate();
  console.log("Order items in OrdersPage:", orderItems);
  const { highContrast } = useAccessibility();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCheckout = () => {
    if (!orderItems || orderItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    onCheckout();            
    setShowConfirmation(true); 
  };

return (
  <div className={`${highContrast ? "accessible" : ""}`}>
    <div className="orders-page">

      <div className="orders-left">
        <h1><T text="Your Order" /></h1>

        <button
          className="back-btn"
          onClick={() => navigate("/welcome/kiosk")}
        >
          ← <T text = "Back to Menu"/>
        </button>
      </div>

      <div className="orders-right">
        <K_OrderPanel
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          onCheckout={handleCheckout}
        />
      </div>

    </div>

    {showConfirmation && (
      <KioskOrderConfirmation />
    )}
  </div>
);
}