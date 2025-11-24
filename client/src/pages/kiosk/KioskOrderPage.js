import React from "react";
import C_OrderPanel from "../../components/CashierMenu/C_OrderPanel";
import "../../styles/kiosk_order_style.css";
import T from "../../components/T";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function OrdersPage({ orderItems, setOrderItems, onCheckout }) {
  console.log("Order items in OrdersPage:", orderItems);
  const { highContrast } = useAccessibility();

  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div className="orders-page">
        <h1><T text="Your Order"/></h1>

        <div className="order-panel">
          <C_OrderPanel
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </div>
  );
}
