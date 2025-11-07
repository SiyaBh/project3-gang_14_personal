import React, { useState } from "react";
import "../../styles/C_CustomizeModal.css";

export default function C_CustomizeModal({ item, onClose }) {
  const [options, setOptions] = useState({
    size: "Medium",
    sugar: "100%",
    ice: "Regular",
  });

  const handleAdd = () => {
    // Example: addToOrder({ ...item, options, quantity: 1 });
    onClose();
  };

  return (
    <div className="customize-modal">
      <h2 className="customize-title">{item.product_name}</h2>

      <label className="customize-label">Size</label>
      <select
        className="customize-select"
        value={options.size}
        onChange={(e) => setOptions({ ...options, size: e.target.value })}
      >
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>

      <label className="customize-label">Sugar Level</label>
      <select
        className="customize-select"
        value={options.sugar}
        onChange={(e) => setOptions({ ...options, sugar: e.target.value })}
      >
        <option>0%</option>
        <option>50%</option>
        <option>100%</option>
      </select>

      <label className="customize-label">Ice Level</label>
      <select
        className="customize-select"
        value={options.ice}
        onChange={(e) => setOptions({ ...options, ice: e.target.value })}
      >
        <option>None</option>
        <option>Less</option>
        <option>Regular</option>
      </select>

      <div className="customize-buttons">
        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
        <button onClick={handleAdd} className="add-btn">
          Add to Order
        </button>
      </div>
    </div>
  );
}
