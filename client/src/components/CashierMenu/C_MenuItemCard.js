// Displays drink image, name, and price.
// On click → triggers opening of CustomizeModal (passes item info)

import React from "react";
import "../../styles/C_MenuItemCard.css";

export default function C_MenuItemCard({ item, onSelect }) {
  return (
    <div className="menu-item-card" onClick={() => onSelect(item)}>
      <img
        src={item.img || "/images/placeholder-drink.png"}
        alt={item.name}
        className="menu-item-image"
      />
      <h3 className="menu-item-name">{item.name}</h3>
      <p className="menu-item-price">${item.price.toFixed(2)}</p>
    </div>
  );
}