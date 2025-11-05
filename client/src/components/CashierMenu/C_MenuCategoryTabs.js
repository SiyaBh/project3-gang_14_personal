import React, { useState } from "react";
import "../../styles/C_MenuCategoryTabs.css";

export default function C_MenuCategoryTabs() {
  const categories = ["Milk Teas", "Fruit Teas", "Non-Cafe", "Matcha", "Ice Blended", "Seasonal"];
  const [selected, setSelected] = useState("Milk Teas");

  return (
    <div className="tabs-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab ${selected === cat ? "selected" : ""}`}
          onClick={() => setSelected(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}