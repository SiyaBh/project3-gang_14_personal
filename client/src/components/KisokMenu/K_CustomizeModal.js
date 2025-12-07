import React, { useState, useMemo } from "react";
import "../../styles/K_CustomizeModal.css";
import T from "../T";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function K_CustomizeModal({ item, onClose, onAddToOrder }) {
  const { highContrast } = useAccessibility();
  // state for all current options
  const [options, setOptions] = useState({
    sugar: "100%",
    ice: "Regular",
    toppings: [],
    misc: [],
    temperature: "Cold",
  });

  const sugarLevels = ["0%", "30%", "50%", "80%", "100%", "120%"];
  const iceLevels = ["None", "Less", "Regular", "More"];
  const toppingOptions = [
    { name: "Regular Pearl", price: 0.75, img: "/images/topping-images/boba.png" },
    { name: "Lychee Jelly", price: 0.75, img: "/images/topping-images/lychee-jelly.png"},
    { name: "Pudding", price: 0.75, img: "/images/topping-images/pudding.png"},
    { name: "Herb Jelly", price: 0.75, img: "/images/topping-images/herb-jelly.png"},
    { name: "Ice Cream", price: 0.75, img: "/images/topping-images/ice-cream.png" },
    { name: "Mini Pearls", price: 0.75, img: "/images/topping-images/boba.png"},
    { name: "Aiyu Jelly", price: 0.75, img: "/images/topping-images/honey-jelly.png" },
    { name: "Creama", price: 0.75, img: "/images/topping-images/creama.png"},
    { name: "Crystal Boba", price: 0.75, img: "/images/topping-images/crystal-boba.png" },
    { name: "Mango Popping ", price: 0.75, img: "/images/topping-images/mango-boba.png" },
    { name: "Strawberry Popping", price: 0.75, img: "/images/topping-images/strawberry-boba.png" },
    { name: "Cofeee Jelly", price: 0.75, img: "/images/topping-images/coffee-jelly.png" },
    { name: "Honey Jelly", price: 0.75, img: "/images/topping-images/honey-jelly.png" },
    { name: "Peach Popping", price: 0.75, img: "/images/topping-images/mango-boba.png" },
    { name: "Fresh Milk", price: 0.75, img: "/images/topping-images/milk.png"}
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
    options: { ...options },   // sugar, ice, toppings, misc, temperature
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
      <button className="modal-close-btn" onClick={onClose}>×</button>
      <div className="modal-header-column">
        {/* Title + Price */}
        <div className="modal-title-section">
          <h2 className="modal-title">
            <T text={item.product_name} />
          </h2>
          <p className="modal-price">
            $ {item.price}
          </p>
        </div>

        {/* Large Centered Image */}
        <div className="modal-image-wrapper">
          <div className="image-circle">
            <img
              src={item.image_url || "/images/taro_milk_tea.png"}
              alt={item.product_name}
              className="modal-image-large"
            />
          </div>
        </div>

        {/* Description */}
        <p className="modal-description">
          <T text={item.description} />
        </p>

      </div>

    {/* --- SUGAR LEVELS --- */}
    <h3 className="option-section-title"><T text ="Sugar Level"></T></h3>
    <div className="level-grid">
      {sugarLevels.map((level) => (
        <div
          key={level}
          className={`level-circle ${options.sugar === level ? "selected" : ""}`}
          onClick={() => handleSelect("sugar", level)}
        >
           <T text = {level}/>
        </div>
      ))}
    </div>

    {/* --- ICE LEVELS --- */}
    <h3 className="option-section-title"><T text ="Ice Level"></T></h3>
    <div className="level-grid">
      {iceLevels.map((level) => (
        <div
          key={level}
          className={`level-circle ${options.ice === level ? "selected" : ""}`}
          onClick={() => handleSelect("ice", level)}
        >
           <T text = {level}/>
        </div>
      ))}
    </div>

    {/* Toppings (multi-select) */}
    <div className="option-section">
      <h3 className="option-section-title"><T text = "Toppings"/></h3>
      <div className="option-grid">
        {toppingOptions.map((top) => (
          <div
            key={top.name}
            className={`option-card ${options.toppings.includes(top.name) ? "selected" : ""}`}
            onClick={() => handleSelect("toppings", top.name, true)}
          >
            <img src={top.img} alt={top.name} className="option-card-img" />
            <div className="option-card-label"><T text={top.name} /></div>
            <div className="option-card-price">+${top.price}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Misc Options (multi-select) */}
    <div className="option-section">
      <h3 className="option-section-title"><T text = "Misc Options"/></h3>
      <div className="option-grid">
        {miscOptions.map((opt) => (
          <div
            key={opt.name}
            className={`option-card ${options.misc.includes(opt.name) ? "selected" : ""}`}
            onClick={() => handleSelect("misc", opt.name, true)}
          >
            <div className="option-card-label"><T text={opt.name} /></div>
            <div className="option-card-price">+${opt.price}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Temperature */}
    <h3 className="option-section-title"><T text ="Temperature"></T></h3>
    <div className="level-grid">
      {temperatureOptions.map((temp) => (
        <div
          key={temp}
          className={`level-circle ${options.temperature === temp ? "selected" : ""}`}
          onClick={() => handleSelect("temperature", temp)}
        >
          <T text = {temp}/>
        </div>
      ))}
    </div>

    <div className="modal-footer">
      <div className="k-total-price">
        <strong>Total: ${totalPrice}</strong>
      </div>

      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>
          <T text="Cancel" />
        </button>
        <button className="add-button" onClick={handleAdd}>
          <T text="Add to Order" />
        </button>
      </div>
    </div>

  </div>
</div>
  
);
}
