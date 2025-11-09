import React from "react";
import "../../styles/C_OrderPanel.css";


export default function C_OrderPanel({ orderItems = [], onCheckout, setOrderItems}) {
    // Calculate total price
    let total = 0; // Initialize total to 0
    for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i]; // Current item in the order
        total += item.totalPrice * item.quantity; // Add price * quantity to total
    }

    // Function to increase quantity of an item
    const increaseQuantity = (index) => {
        // Copy previous order items
        const updatedItems = [];
        for (let i = 0; i < orderItems.length; i++) {
        updatedItems.push({ ...orderItems[i] });
        }

        // Increase quantity for the specified index
        updatedItems[index].quantity += 1;

        // Update state
        setOrderItems(updatedItems);
    };

    // Function to decrease quantity of an item
    const decreaseQuantity = (index) => {
        const updatedItems = [];
        for (let i = 0; i < orderItems.length; i++) {
        updatedItems.push({ ...orderItems[i] });
        }

        // Only decrease if quantity > 1
        if (updatedItems[index].quantity > 1) {
        updatedItems[index].quantity -= 1;
        } else {
        // Remove item if quantity reaches 0
         updatedItems.splice(index, 1);
        }

        setOrderItems(updatedItems);
    };

    return (
    <div className="order-panel">
      {/* Panel title */}
      <h2 className="order-title">Current Order</h2>

      {/* Container for all order items */}
      <div className="order-items">
        {/* Check if there are any items */}
        {orderItems.length === 0 && 
          <p className="empty-text">No items added yet</p>
        }

        {/* Loop through order items and render each */}
        {orderItems.length > 0 && 
          (() => {
            let elements = []; // Array to hold JSX elements
            for (let i = 0; i < orderItems.length; i++) {
              const item = orderItems[i]; // Current order item

              // Build string of toppings if any
              let toppingsText = "";
              for (let j = 0; j < item.options.toppings.length; j++) {
                if (j > 0) {
                  toppingsText += ", ";
                }
                toppingsText += item.options.toppings[j];
              }

              // Build string of misc options if any
              let miscText = "";
              for (let j = 0; j < item.options.misc.length; j++) {
                if (j > 0) {
                  miscText += ", ";
                }
                miscText += item.options.misc[j];
              }

              // Combine options string
              let optionsText = item.options.temperature + " • " + item.options.sugar + " sugar • " + item.options.ice + " ice";
              if (toppingsText.length > 0) {
                optionsText += " • " + toppingsText;
              }
              if (miscText.length > 0) {
                optionsText += " • " + miscText;
              }

              // Create JSX element for this item
              elements.push(
                <div key={i} className="order-item">
                <div className="item-left">
                    <p className="item-name">{item.name}</p>
                    <p className="item-options">{optionsText}</p>
                </div>
                <div className="item-right">
                    {/* Price at top */}
                    <p className="item-price">${(item.totalPrice * item.quantity).toFixed(2)}</p>

                    {/* Quantity controls at bottom-right */}
                    <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => decreaseQuantity(i)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => increaseQuantity(i)}>+</button>
                    </div>
                </div>
              </div>
            );
          }
          return elements;
          })()
        }
      </div>

      {/* Footer with total price and checkout button */}
      <div className="order-footer">
        <div className="total">
          <span>Total: </span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}