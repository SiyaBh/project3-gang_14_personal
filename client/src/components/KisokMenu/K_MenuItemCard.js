// Displays drink image, name, and price.
// On click → triggers opening of CustomizeModal (passes item info)

import React from "react";
import "../../styles/C_MenuItemCard.css";
import T from "../T";

export default function K_MenuItemCard({ item, onSelect }) {
  const disabled = item.isAvailable === false; // false or undefined

  return (
    <div
      className={`menu-item-card ${disabled ? "disabled-card" : ""}`}
      onClick={() => {
        if (!disabled) onSelect(item);
      }}
      style={{
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <img
        src={item.image_url || "/images/taro_milk_tea.png"}
        alt={item.product_name}
        className="menu-item-image"
      />
      <h3 className="menu-item-name"> <T text = {item.product_name}/></h3>
      <p className="menu-item-price">${item.price}</p>
    </div>
  );
}