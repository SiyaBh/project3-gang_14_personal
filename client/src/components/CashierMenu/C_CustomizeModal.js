import React, { useState, useMemo } from "react";
import "../../styles/C_CustomizeModal.css";
import T from "../T";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function C_CustomizeModal({ item, onClose, onAddToOrder }) {
  const { highContrast } = useAccessibility();
  // state for all current options
  const [options, setOptions] = useState({
    sugar: "100%",
    ice: "Regular",
    toppings: [],
    cupSizes: "Small",
    misc: [],
    temperature: "Cold",
  });

  const sugarLevels = ["0%", "30%", "50%", "80%", "100%", "120%"];
  const iceLevels = ["None", "Less", "Regular", "More"];
  const toppingOptions = [
    { name: "Regular Pearl", price: 0.75 },
    { name: "Lychee Jelly", price: 0.75 },
    { name: "Pudding", price: 0.75 },
    { name: "Herb Jelly", price: 0.75 },
    { name: "Ice Cream", price: 0.75 },
    { name: "Mini Pearls", price: 0.75 },
    { name: "Aiyu Jelly", price: 0.75 },
    { name: "Creama", price: 0.75 },
    { name: "Crystal Boba", price: 0.75 },
    { name: "Mango Popping ", price: 0.75 },
    { name: "Strawberry Popping", price: 0.75 },
    { name: "Cofeee Jelly", price: 0.75 },
    { name: "Honey Jelly", price: 0.75 },
    { name: "Peach Popping", price: 0.75 },
    { name: "Fresh Milk", price: 0.75 }
  ];
  const cupSizes = [
  { name: "Small", price: 0 },
  { name: "Medium", price: 1 },
  { name: "Large", price: 2 }
  ];
  const miscOptions = [
  { name: "Double Toppings", price: 0.75 },
  { name: "Triple Toppings", price: 0.75 },
  { name: "Double Creama", price: 0.75 },
  { name: "Split", price: 0.75 },
  { name: "No Toppings", price: 0.00 },
  { name: "Sub Pearls", price: 0.00}
  ];
  const temperatureOptions = ["Cold", "Hot"];

  // function handles selection and deseelection of toppings
  // when you click on a topping, if it's not already in the toppings array

  const handleSelect =  (key, value, isMulti = false) => {
    setOptions((prev) => {
      if (isMulti) {
        // If it's a multi-select (like toppings), toggle the value in the array
        // ex: key = toppings, value = "Regular Pearl"
        // checks to see if the selected option is already in the state array
        const isSelected = prev[key].includes(value);

        // Use this variable to store the updated array of selected options
        let updatedKeyArray;

        if (isSelected) {
          // If it's already selected, REMOVE it
          // The filter function goes through every element (v) in prev[key]
          // and keeps only the ones that are NOT equal to the current value
          updatedKeyArray = prev[key].filter((v) => v !== value);
        } else {
          // If the option was not selected, we ADD it to the array
          // The spread operator (...) creates a copy of the previous array
          // Then we append the new value at the end
          updatedKeyArray = [...prev[key], value];
        }
        // Return a new version of the entire options object
        // We spread all the previous keys (...prev)
        // and update only the one we modified (the one at "key")
        return {
          ...prev,
          [key]: updatedKeyArray,
        };  
        // For single select, we just replace the old value with the new one
        // Create a new options object, copy everything from the old one, 
        // and update just the field named by key to the new value.
      } else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };

    // Compute total price dynamically
    const totalPrice = useMemo(() => {
      let total = Number(item.price) || 0; // base drink price

      // Add price for each selected topping
      for (let i = 0; i < options.toppings.length; i++) {
        const toppingName = options.toppings[i];
        let found = null;

        // Find topping in the options list
        for (let j = 0; j < toppingOptions.length; j++) {
          if(toppingOptions[j].name === toppingName) {
            found = toppingOptions[j];
            break;
          }
        }
        for (let i = 0; i < cupSizes.length; i++) {
          if (cupSizes[i].name === options.cupSize) {
            total += cupSizes[i].price;
            break;
          }
        }
        // If found, add its price to total
        if (found !== null) {
          total += found.price;
        }
      }

      // Add prices for selected misc options
      for (let i = 0; i < options.misc.length; i++) {
        const miscName = options.misc[i];
        let found = null;

        // Find the misc option object in miscOptions array
        for (let j = 0; j < miscOptions.length; j++) {
          if (miscOptions[j].name === miscName) {
            found = miscOptions[j];
            break;
          }
        }

        // If found, add its price to total
        if (found !== null) {
          total += found.price;
        }
      }
      // Return total as a string with 2 decimals
      return total.toFixed(2);
    }, [options, item.price, toppingOptions, miscOptions]);

// Add customized item to order
const handleAdd = () => {
  // Create a copy of the item with options, total price, and quantity
  const customizedItem = {
    name: item.product_name,           // drink name
    category: item.product_type,   // drink type/category 
    options: { ...options },   // sugar, ice, toppings, misc, temperature and cup size
    totalPrice: Number(totalPrice), // total including extras
    quantity: 1,               // default
  };

  // Sends item to CashierDashboard
  onAddToOrder(customizedItem);

  // Close the modal
  onClose();
};

return (
  <div className={`customize-modal-overlay ${highContrast ? "accessible" : ""}`}>
    <div className="customize-modal">
    <h2 className="modal-title"><T text = {item.product_name}/></h2>
    <p className="base-price"> <T text = "Base Price: "/>${item.price}</p>

    {/* Sugar Level */}
    <div className="option-section">
      <label className="option-label"><T text = "Sugar Level"/></label>
      <div className="option-buttons">
        {sugarLevels.map((level) => (
          <button
            key={level}
            className={`option-btn ${options.sugar === level ? "selected" : ""}`}
            onClick={() => handleSelect("sugar", level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>

    {/* Ice Level */}
    <div className="option-section">
      <label className="option-label"><T text = "Ice Level"/></label>
      <div className="option-buttons">
        {iceLevels.map((level) => (
          <button
            key={level}
            className={`option-btn ${options.ice === level ? "selected" : ""}`}
            onClick={() => handleSelect("ice", level)}
          >
            <T text = {level}/>
          </button>
        ))}
      </div>
    </div>

    {/* Toppings (multi-select) */}
    <div className="option-section">
      <label className="option-label"><T text = "Toppings"/></label>
      <div className="option-buttons">
        {toppingOptions.map((top) => (
          <button
            key={top.name}
            className={`option-btn ${options.toppings.includes(top.name) ? "selected" : ""}`}
            onClick={() => handleSelect("toppings", top.name, true)}
          >
            <T text = {top.name}/> (+${top.price})
          </button>
        ))}
      </div>
    </div>
    <div className="option-selection">
      <label className="option-label"><T text="Cup Sizes"/></label>
      <div className="option-buttons size-buttons">
        {cupSizes.map((size) => (
          <button
            key={size.name}
            className={`size-circle ${options.cupSizes === size.name ? "selected" : ""}`}
            onClick={() => handleSelect("cupSize", size.name)}
          >
            <T text={size.name} /> {size.price > 0 ? `(+\$${size.price})` : ""}
          </button>))}
      </div>
    </div>
    {/* Misc Options (multi-select) */}
    <div className="option-section">
      <label className="option-label"><T text = "Misc Options"/></label>
      <div className="option-buttons">
        {miscOptions.map((opt) => (
          <button
            key={opt.name}
            className={`option-btn ${options.misc.includes(opt.name) ? "selected" : ""}`}
            onClick={() => handleSelect("misc", opt.name, true)}
          >
            <T text = {opt.name}/> (+${opt.price})
          </button>
        ))}
      </div>
    </div>

    {/* Temperature */}
    <div className="option-section">
      <label className="option-label"><T text = "Temperature"/></label>
      <div className="option-buttons">
        {temperatureOptions.map((temp) => (
          <button
            key={temp}
            className={`option-btn ${options.temperature === temp ? "selected" : ""}`}
            onClick={() => handleSelect("temperature", temp)}
          >
            <T text = {temp}/>
          </button>
        ))}
      </div>
    </div>

    {/* Total Price */}
    <div className="total-price">
      <strong>Total: ${totalPrice}</strong>
    </div>

    {/* Action Buttons */}
    <div className="modal-actions">
      <button className="cancel-btn" onClick={onClose}><T text = "Cancel"/></button>
      <button className="add-btn" onClick={handleAdd}><T text = "Add to Order"/></button>
    </div>
  </div>
</div>
  
);
}
