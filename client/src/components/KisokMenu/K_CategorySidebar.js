import React from "react";
import "../../styles/K_CategorySidebar.css";
import K_CategoryCard from "./K_CategoryCard";
import { useAccessibility } from "../../context/AccessibilityContext";
export default function KioskCategoryGrid({ categories, selected, onSelect }) {
  const { highContrast } = useAccessibility();
  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div className="kiosk-category-grid">
      {categories.map((cat) => (
        <K_CategoryCard
          key={cat.name}
          category={cat}
          isSelected={selected === cat.name}
          onClick={() => onSelect(cat.name)}
        />
      ))}
      </div>
    </div>
  );
}