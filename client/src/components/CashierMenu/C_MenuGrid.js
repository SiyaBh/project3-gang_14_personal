import React, { useState } from "react";
import C_MenuItemCard from "./C_MenuItemCard";
import C_CustomizeModal from "./C_CustomizeModal";
import Modal from "../../Shared/Modal";
import "../../styles/C_MenuGrid.css";

export default function C_MenuGrid({ items = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      {/* Menu grid */}
      <div className="menu-grid">
        {items.map((item) => (
          <C_MenuItemCard
            key={item.id}
            item={item}
            onSelect={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Customization modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="p-6">
            <C_CustomizeModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          </div>
        )}
      </Modal>
    </>
  );
}