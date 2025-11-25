import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import C_MenuCategoryTabs from "../../components/CashierMenu/C_MenuCategoryTabs";
import C_MenuGrid from "../../components/CashierMenu/C_MenuGrid";
import { getDrinks, placeOrder } from "../../api/kiosk";
import "../../styles/kiosk_style.css";
import T from "../../components/T";
import { useTranslation } from "../../context/TranslationContext";
import { useAccessibility } from "../../context/AccessibilityContext";

// Debounce hook
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
  const { translate } = useTranslation();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("Search drinks...");

  const debouncedSearch = useDebounce(search, 300);
  const currentMonth = new Date().getMonth() + 1;

  // Translate placeholder
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
      setLoading(true);
      setError(null);
      const drinks = await getDrinks();
      if (!Array.isArray(drinks)) {
        setError("Failed to load drinks");
        setMenuItems([]);
      } else {
        setMenuItems(drinks);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtered menu based on search and category
  const filteredMenu = useMemo(() => {
    if (!Array.isArray(menuItems)) return [];

    const searchInput = debouncedSearch.trim().toLowerCase();

    // Search overrides categories
    if (searchInput) {
      return menuItems.filter((item) =>
        item.product_name?.toLowerCase().includes(searchInput)
      );
    }

    // Seasonal tab
    if (selectedCategory === "Seasonal") {
      return menuItems
        .filter((item) => item.season === "Seasonal")
        .map((item) => {
          const months = item.available_months?.split(",").map(Number) || [];
          return {
            ...item,
            isAvailable: months.includes(currentMonth),
          };
        });
    }

    // Regular category tabs
    return menuItems.filter((item) => {
      if (item.season === selectedCategory) return true;
      if (item.season === "Year-Round")
        return item.product_type === selectedCategory;
      return false;
    });
  }, [menuItems, selectedCategory, debouncedSearch, currentMonth]);

  // Add item to order
  const handleAddToOrder = (item) => {
    if (!item) return;
    setOrderItems((prev) => [...prev, item]);
  };

  const handleCheckout = () => {
    navigate("/kiosk/order");
  };

  // UI Colors (for consistency / high contrast)
  const colors = {
    primary: "#BF1834",
    secondary: "#FFFFFF",
    dark: "#221713",
  };

  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div className="kiosk">
        <h1>
          <T text="Select Your Drink" />
        </h1>

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
        {loading ? (
          <p style={{ color: colors.dark }}>Loading drinks...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : filteredMenu.length === 0 ? (
          <p style={{ color: colors.dark }}>No drinks available.</p>
        ) : (
          <C_MenuGrid items={filteredMenu} onAddToOrder={handleAddToOrder} />
        )}

        {/* Checkout Button */}
        <button onClick={handleCheckout} className="order_button">
          <T text="View Your Order" />
        </button>
      </div>
    </div>
  );
}
