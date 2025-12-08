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
  const customerName = location.state?.name || "";
  //const { orderItems, name } = location.state || {};
  const [placeholder, setPlaceholder] = useState("Enter your email");

function formatOptionsFrontend(drink) {
  const parts = [];
  parts.push(drink.hot_cold ? "Hot" : "Cold");
  if (drink.sweetness !== null && drink.sweetness !== undefined) {
    parts.push(`${drink.sweetness}% Sugar`);
  }
  if (drink.ice_level !== null && drink.ice_level !== undefined) {
    let iceLabel;

    switch (drink.ice_level) {
      case 0:
        iceLabel = "No Ice";
        break;
      case 50:
        iceLabel = "Less Ice";
        break;
      case 100:
        iceLabel = "Regular Ice";
        break;
      case 125:
        iceLabel = "More Ice";
        break;
      default:
        iceLabel = `${drink.ice_level}% Ice`;
    }

    parts.push(iceLabel);
  }

  if (drink.toppings) {
    parts.push(drink.toppings);
  }

  if (drink.miscellaneous) {
    parts.push(drink.miscellaneous);
  }

  return parts.join(" • ");
}



  
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
      const latestOrder = orders[0];
      const orderId = latestOrder.order_id;
      const subtotal = Number(latestOrder.total_order_price);
      //const items = buildItemsFromOrderItems(orderItems);
      const items = latestOrder.drinks.map((drink) => {
        const qty = drink.quantity;
        const unitPrice = Number(drink.price ?? 0);
        const lineTotal = unitPrice * qty;

        return {
          name: drink.product_name,
          quantity: qty,
          displayPrice: lineTotal.toFixed(2),
          options: formatOptionsFrontend(drink),
        };
      });
      const result = await sendReceipt({
        id: orderId,
        customerEmail: email,
        customerName: customerName,
        items: items,
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