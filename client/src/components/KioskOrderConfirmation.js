import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { useAccessibility } from "../context/AccessibilityContext";
import GetReceipt from "./GetReceipt"; 
import "../styles/kiosk_confirmation_popup.css";
import T from "./T";

export default function KioskOrderConfirmation() {
  const navigate = useNavigate();
  const { highContrast } = useAccessibility();

  //controls the receipt popup
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const location = useLocation();
  const customerName = location.state?.name || "";// taking the name from the kiosk menu page

  return (
    <>
      <div className={`kiosk-popup-overlay ${highContrast ? "accessible" : ""}`}>
        <div className="kiosk-popup">
          <h2><T text = "Order Placed Successfully!"/></h2>
          <h3><T text = "Thank you, "/> {customerName}!</h3>
          <p><T text = "Your order is being prepared."/></p>

          <div className="kiosk-popup-buttons">
            <button className="kiosk-btn" onClick={() => navigate("/welcome")}>
              <T text = "Back to Welcome"/>
            </button>

            <button
              className="kiosk-btn"
              onClick={() => setShowReceiptModal(true)}
            >
              <T text = "Get Receipt"/>
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className={`kiosk-popup-overlay ${highContrast ? "accessible" : ""}`}>
          <div className="kiosk-popup">
            <GetReceipt onClose={() => setShowReceiptModal(false)} />
          </div>
        </div>
      )}

    </>
  );
}
