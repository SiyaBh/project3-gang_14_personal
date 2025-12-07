import React from "react";
import "../../styles/K_CategoryCard.css";
import T from "../T";
import { useAccessibility } from "../../context/AccessibilityContext";
export default function KioskCategoryCard({ category, isSelected, onClick }) {
  const { highContrast } = useAccessibility();
  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div
      className={`kiosk-category-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      >
        <div className="kiosk-category-name"><T text = {category.name}/></div>
      </div>
    </div>

  );
}