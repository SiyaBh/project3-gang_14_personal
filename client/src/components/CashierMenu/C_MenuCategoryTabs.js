import React from "react";
import "../../styles/C_MenuCategoryTabs.css";

export default function C_MenuCategoryTabs({ selected, onSelect }) {
  const categories = ["Milk Tea", "Fruit Tea", "Non-Caffeinated", "Matcha Tea", "Ice Blended", "Seasonal"];

  return (
    <div className="tabs-container">
      {categories.map((cat) => ( //cat = category
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