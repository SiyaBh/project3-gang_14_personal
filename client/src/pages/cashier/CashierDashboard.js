import React, { useState } from "react";
import C_MenuCategoryTabs from "../../components/CashierMenu/C_MenuCategoryTabs";
import C_MenuGrid from "../../components/CashierMenu/C_MenuGrid";
import { menuItems } from "../../data/menuItems";
import "../../styles/CashierDashboard.css";

export default function CashierDashboard() {
  const [category, setCategory] = useState("Milk Teas");
  const [search, setSearch] = useState("");

  const filteredMenu = menuItems.filter(
    (item) =>
      item.category === category &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="left-section">
        <h1 className="dashboard-header">Cashier Dashboard</h1>

        {/* Tabs */}
        <C_MenuCategoryTabs selected={category} onSelect={setCategory} />

        {/* Grid */}
        <C_MenuGrid items = {filteredMenu} />

        {/* Logout button */}
        <div className="mt-8">
          <button className="logout-button">← Logout</button>
        </div>
      </div>
    </div>
  );
}
