// Displays when a menu item is clicked.
    // Contains dropdowns or buttons for:
    // Size (S, M, L)
    // Sugar Level (0%, 25%, 50%, 75%, 100%)
    // Ice Level (None, Less, Regular)
    // Toppings (checkbox list)
    // Includes “Add to Order” button → calls context to add item with options.

import { useContext, useState } from "react";

export default function C_Customize({ item, onClose }) {
  //const { addToOrder } = useContext(OrderContext);
  const [options, setOptions] = useState({
    size: "Medium",
    sugar: "100%",
    ice: "Regular",
    toppings: [],
  });

  const handleAdd = () => {
    addToOrder({ ...item, options });
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4">{item.name}</h2>

      {/* Example options */}
      <label>Size:</label>
      <select
        value={options.size}
        onChange={(e) => setOptions({ ...options, size: e.target.value })}
      >
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>

      <label>Sugar:</label>
      <select
        value={options.sugar}
        onChange={(e) => setOptions({ ...options, sugar: e.target.value })}
      >
        <option>0%</option>
        <option>50%</option>
        <option>100%</option>
      </select>

      <div className="mt-4 flex justify-between">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleAdd} className="bg-red-500 text-white rounded-lg px-4 py-2">
          Add to Order
        </button>
      </div>
    </div>
  );
}