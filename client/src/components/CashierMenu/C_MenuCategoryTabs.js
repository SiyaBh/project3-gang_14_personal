import React from "react";
import "../../styles/C_MenuCategoryTabs.css";

export default function C_MenuCategoryTabs({ selected, onSelect }) {
  const categories = ["Milk Teas", "Fruit Teas", "Non-Cafe", "Matcha", "Ice Blended", "Seasonal"];

  return (
    <div className="tabs-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab ${selected === cat ? "selected" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}