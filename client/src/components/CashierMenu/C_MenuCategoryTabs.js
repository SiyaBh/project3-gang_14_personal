import React from "react";
import "../../styles/C_MenuCategoryTabs.css";
import T from "../T";
export default function C_MenuCategoryTabs({ selected, onSelect }) {
  const categories = ["Milk Tea", "Fruit Tea", "Non-Caffeinated", "Matcha", "Ice Blended", "Seasonal"];

  return (
    <div className="tabs-container">
      {categories.map((cat) => ( //cat = category
        <button
          key={cat}
          className={`tab ${selected === cat ? "selected" : ""}`}
          onClick={() => onSelect(cat)}
        >
          <T text = {cat}/>
        </button>
      ))}
    </div>
  );
}