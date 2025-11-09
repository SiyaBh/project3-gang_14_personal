import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import C_MenuCategoryTabs from "../../components/CashierMenu/C_MenuCategoryTabs";
import C_MenuGrid from "../../components/CashierMenu/C_MenuGrid";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/CashierDashboard.css";
import { getDrinks } from '../../api/drinks';
import { DebouncedKey } from '../../components/CashierMenu/Debouncing';
import C_OrderPanel from "../../components/CashierMenu/C_OrderPanel";

export default function CashierDashboard() {
  const [category, setCategory] = useState("Milk Tea"); 
  const [allDrinks, setAllDrinks] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = DebouncedKey(search, 300);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const filteredMenu = useMemo( () => {
    const searchInput = debouncedSearch;
    if(searchInput) {
      return allDrinks.filter(
        (item) => item.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return allDrinks.filter( //menuItems is the "array"
      (item) => item.product_type === category
    );
  }, [allDrinks, category, debouncedSearch]);

  const fetchData = async () => { 
      try {
          const data = await getDrinks();
          setAllDrinks(data);
      } catch(error) {
          console.error("Failed to fetch drinks: ", error);
      }
  }

  useEffect (() => {
    fetchData();
  }, [])

  useEffect(() => {
    if (search) setSearch("");
  }, [category]);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Order state and handlers

  // State to store all items added to the current order
  const [orderItems, setOrderItems] = useState([]);

  // Adds a new customized drink to the current order
  const handleAddToOrder = (customizedItem) => {
    // Update the orderItems state by creating a new array
    // Copy all previous items and append the new item
    setOrderItems((prev) => {
      const newOrder = [...prev, customizedItem];
      return newOrder;
    });
  };

  // Clears current order or could be extended to send order to backend
  const handleCheckout = () => {
    console.log("Checkout items:", orderItems);
    // TODO: Send orderItems to backend for processing
    setOrderItems([]); // Clear order after checkout
  };


  

  return (
    <div className="dashboard-container">
      {/* Left section: Menu */}
      <div className="left-section">
        <h1 className="dashboard-header">Cashier Dashboard</h1>
        <input
          type="search"
          placeholder="Search drinks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "786px",
            borderRadius: "20px",
            marginBottom: "20px",
            border: "2px solid grey",
            fontFamily: "'Poppins', sans-serif", 
          }}
        />
        <C_MenuCategoryTabs selected={category} onSelect={setCategory} />
        <C_MenuGrid items={filteredMenu} onAddToOrder={handleAddToOrder} />
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">← Logout</button>
        </div>
      </div>

      {/* Right section: Order Panel */}
      <div className="right-section">
        <C_OrderPanel orderItems={orderItems} onCheckout={handleCheckout} setOrderItems={setOrderItems} />
      </div>
    </div>
  );
}
