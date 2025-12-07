import React, { useState, useEffect } from "react";
import { sendReceipt } from "../api/receipt";
import { useTranslation } from "../context/TranslationContext";
import "../styles/get_receipt.css";
import T from "./T";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/get_receipt.css";
import { getOrders } from "../api/order";


export default function GetReceipt({ onClose }) {
  const { translate } = useTranslation();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location state:", location.state);
  const { orderItems, name } = location.state || {};
  const [placeholder, setPlaceholder] = useState("Enter your email");
  
  const handleReceiptRequest = async () => {
    // simple phone validation
    // if (/\S+@\S+\.\S+/.test(email)) {
    //   alert("Please enter a valid email.");
    //   return;
    // }
    //await sendReceipt(phone);
    // function calculateSubtotal(items) {
    //   return items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
    // }

    // const subtotal = calculateSubtotal(orderItems);

    try {
      const orders = await getOrders();
      const orderId = orders[0].order_id;
      const subtotal = Number(orders[0].total_order_price);
      const result = await sendReceipt({
        id: orderId,
        customerEmail: email,
        customerName: name,
        items: orderItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          displayPrice: item.totalPrice.toFixed(2),
          options: item.options,
        })),
        subtotal: subtotal,
        tax: subtotal * 0.0825,
        total: subtotal + (subtotal * 0.0825),
        createdAt: new Date().toISOString()
      });
      console.log(result);

      alert("Receipt sent!");
      onClose();
      navigate("/welcome");
    } catch (err) {
      alert("Failed to send receipt. Please try again.");
    }
  };

    useEffect(() => {
    const loadPlaceholder = async () => {
      const translated = await translate("Enter your email");
      setPlaceholder(translated);
    };
    loadPlaceholder();
  }, [translate]);

  return (
    <div className="get-receipt-container">
      <h2 className="get-receipt-title"><T text = "Get Receipt"/></h2>

      <input
        type="email"
        className="get-receipt-input"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="get-receipt-buttons">
        <button className="get-receipt-btn" onClick={handleReceiptRequest}>
            <T text = "Submit"/>
        </button>

        <button className="get-receipt-cancel" onClick={onClose}>
            <T text = "Cancel"/>
        </button>
      </div>
    
    </div>
  );
}
