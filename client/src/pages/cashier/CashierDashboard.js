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
    const currentMonth = new Date().getMonth() + 1;
    if(searchInput) {
      return allDrinks.filter(
        (item) => item.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SEASONAL TAB
    if (category === "Seasonal") {
      return allDrinks
        .filter((item) => item.season === "Seasonal")
        .map((item) => {
          const months = item.available_months.split(",").map((m) => parseInt(m));
          return {
            ...item,
            isAvailable: months.includes(currentMonth),
          };
        });
    }

    // NORMAL CATEGORY TABS
    return allDrinks.filter((item) => {
      if (item.season === category) return true;
      if (item.season === "Year-Round") return item.product_type === category;
      return false;
    });
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

  // Clears current order and updates database
  const handleCheckout = async () => {
    console.log("Checkout items:", orderItems);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderItems),
        credentials: "include"
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log("Order created:", data);
      setOrderItems([]);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };


  


  return (
    <div className="dashboard-container cashier-dashboard">
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