import React from "react";
import "../../styles/K_OrderPanel.css";
import T from "../T";

export default function K_OrderPanel({ orderItems = [], onCheckout, setOrderItems }) {

  let total = 0;
  for (let i = 0; i < orderItems.length; i++) {
    total += orderItems[i].totalPrice * orderItems[i].quantity;
  }

  const increaseQuantity = (index) => {
    const updated = orderItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setOrderItems(updated);
  };

  const decreaseQuantity = (index) => {
    const updated = orderItems
      .map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setOrderItems(updated);
  };

  return (
    <div className="order-panel kiosk-theme">

      <div className="order-items">
        {orderItems.length === 0 && (
          <p className="empty-text"><T text="No items added yet" /></p>
        )}

        {orderItems.length > 0 &&
          orderItems.map((item, i) => {

            const toppings = item.options.toppings.join(", ");
            const misc = item.options.misc.join(", ");

            let optionsText = `${item.options.temperature} • ${item.options.sugar} sugar • ${item.options.ice} ice`;
            if (toppings) optionsText += ` • ${toppings}`;
            if (misc) optionsText += ` • ${misc}`;

            return (
              <div className="order-item" key={i}>
                <div className="item-left">
                  <p className="item-name"><T text={item.name} /></p>
                  <p className="item-options"><T text={optionsText} /></p>
                </div>

                <div className="item-right">
                  <p className="item-price">${(item.totalPrice * item.quantity).toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(i)}
                    >
                      –
                    </button>

                    <span className="quantity">{item.quantity}</span>

                    <button
                      className="quantity-btn"
                      onClick={() => increaseQuantity(i)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="order-footer kiosk-footer">
        <div className="total">
          <T text="Total" />: ${total.toFixed(2)}
        </div>

        <button className="checkout-btn" onClick={onCheckout}>
          <T text="Checkout" />
        </button>
      </div>
    </div>
  );
}
