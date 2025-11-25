import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import C_MenuCategoryTabs from "../../components/CashierMenu/C_MenuCategoryTabs";
import C_MenuGrid from "../../components/CashierMenu/C_MenuGrid";
import { getDrinks, placeOrder } from "../../api/kiosk";
import "../../styles/kiosk_style.css";
import T from "../../components/T";
import { useTranslation } from "../../context/TranslationContext";
import { useAccessibility } from "../../context/AccessibilityContext";



function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function KioskMenu({ orderItems, setOrderItems }) {
  const { highContrast } = useAccessibility();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 300);
  const currentMonth = new Date().getMonth() + 1;

    const { translate } = useTranslation();
    const [placeholder, setPlaceholder] = useState("Search drinks...");

    useEffect(() => {
      const loadPlaceholder = async () => {
        const translated = await translate("Search drinks...");
        setPlaceholder(translated);
        };
        loadPlaceholder();
      }, [translate]);

  // Fetch drinks
  useEffect(() => {
    const fetchData = async () => {
      const drinks = await getDrinks();
      setMenuItems(drinks);
    };
    fetchData();
  }, []);

  const filteredMenu = useMemo(() => {
    const searchInput = debouncedSearch;

    // Searching overrides categories
    if (searchInput) {
      return menuItems.filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const currentMonth = new Date().getMonth() + 1;

    // SEASONAL TAB
    if (selectedCategory === "Seasonal") {
      return menuItems
        .filter((item) => item.season === "Seasonal")
        .map((item) => {
          const months = item.available_months
            .split(",")
            .map((m) => parseInt(m));
          return {
            ...item,
            isAvailable: months.includes(currentMonth),
          };
        });
    }

    // REGULAR CATEGORY TABS
    return menuItems.filter((item) => {
      if (item.season === selectedCategory) return true;
      if (item.season === "Year-Round")
        return item.product_type === selectedCategory;
      return false;
    });
  }, [menuItems, selectedCategory, debouncedSearch]);

  
  const handleAddToOrder = (item) => {
  
  console.log(" Item received in handleAddToOrder:", item);
  setOrderItems((prev) => [...prev, item]);
  };
  const handleCheckout = async () => {
    console.log(" Before navigate, orderItems:", orderItems);
    navigate("/kiosk/order");
  };

  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div className="kiosk">

      <h1><T text = "Select Your Drink"/></h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="kiosk-search-bar"
      />

      {/* Category Tabs */}
      <C_MenuCategoryTabs
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Drinks Grid */}
      <C_MenuGrid items={filteredMenu} onAddToOrder={handleAddToOrder} />

      {/* Checkout Button */}
      <button onClick={handleCheckout} className="order_button">
        <T text = "View Your Order"/>
      </button>

      </div>
    </div>
  );
}