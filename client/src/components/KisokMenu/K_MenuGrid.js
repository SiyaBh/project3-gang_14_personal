import React, { useState } from "react";
import K_MenuItemCard from "./K_MenuItemCard";
import K_CustomizeModal from "./K_CustomizeModal";
import Modal from "../../Shared/Modal";
import "../../styles/C_MenuGrid.css";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function K_MenuGrid({ items = [], onAddToOrder }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { highContrast } = useAccessibility();

  return (
    <>
      {/* Menu grid */}
      <div className="menu-grid">
        {Array.isArray(items) &&
          items.map((item) => (
            <K_MenuItemCard
              key={item.id}
              item={item}
              onSelect={() => setSelectedItem(item)}
            />
          ))}
      </div>

      {/* Customization modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className={`${highContrast ? "accessible" : ""}`}>
            <div className="p-6">
              <K_CustomizeModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onAddToOrder={onAddToOrder}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
