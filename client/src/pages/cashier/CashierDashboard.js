import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import C_MenuCategoryTabs from "../../components/CashierMenu/C_MenuCategoryTabs";
import C_MenuGrid from "../../components/CashierMenu/C_MenuGrid";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/CashierDashboard.css";
import { getDrinks } from '../../api/drinks';
import { DebouncedKey } from '../../components/CashierMenu/Debouncing';

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

  

  return (
    <div className="dashboard-container">
      <div className="left-section">
        <h1 className="dashboard-header">Cashier Dashboard</h1>
        <input type="search" 
        placeholder="Search drinks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{padding: "8px", width: "786px", borderRadius: "20px", marginBottom: "20px", border: "2px solid grey"}}
        ></input>

        {/* Tabs */}
        <C_MenuCategoryTabs selected={category} onSelect={setCategory} />

        {/* Grid */}
        <C_MenuGrid items = {filteredMenu} />

        {/* Logout button */}
        <div className="mt-8">
          <button onClick={handleLogout} className="logout-button">← Logout</button>
        </div>
      </div>
    </div>
  );
}
