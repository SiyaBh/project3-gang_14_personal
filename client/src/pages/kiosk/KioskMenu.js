import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import K_MenuGrid from "../../components/KisokMenu/K_MenuGrid";
import { getDrinks, placeOrder } from "../../api/kiosk";
import "../../styles/kiosk_style.css";
import T from "../../components/T";
import { useTranslation } from "../../context/TranslationContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import K_CategoryGrid from "../../components/KisokMenu/K_CategorySidebar";
import { useLocation } from "react-router-dom";


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
  const location = useLocation();
  const customerName = location.state?.name || "";// taking the name from the welcome page

  const kioskCategories = [
    { name: "Milk Tea", image: "/images/taro_milk_tea.png" },
    { name: "Fruit Tea", image: "/images/taro_milk_tea.png" },
    { name: "Non-Caffeinated", image: "/images/taro_milk_tea.png" },
    { name: "Matcha", image: "/images/taro_milk_tea.png" },
    { name: "Ice Blended", image: "/images/taro_milk_tea.png" },
    { name: "Seasonal", image: "/images/taro_milk_tea.png" }
  ];

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

  useEffect(() => {
    if (search) setSearch("");
  }, [selectedCategory]);

  
  const handleAddToOrder = (item) => {
  
  console.log(" Item received in handleAddToOrder:", item);
  setOrderItems((prev) => [...prev, item]);
  };
  const handleCheckout = async () => {
    console.log(" Before navigate, orderItems:", orderItems);
    navigate("/welcome/kiosk/order",{ state: { 
      name: customerName,
      //orderItems: orderItems,
    
    } });
  };

  const handleLogoCilck = async () => {
    navigate("/welcome");
  }

  return (
    <div className={`${highContrast ? "accessible" : ""}`}>
      <div className="kiosk">
        

        <div className="kiosk-layout">
          {/* Sidebar */}
          <div className="kiosk-category-sidebar">
            <div className="kiosk-header">
              <div className = "icon-container">
              <img src = "/images/home-icon.png" alt="Home Icon" className="kiosk-home-icon" onClick={handleLogoCilck}/>
              <span className="home-text" onClick={handleLogoCilck}><T text="Home"/></span>
              </div>
              <img src = "/images/boba_by_taele.png" alt="Boba by Taele Logo" className="kiosk-logo" />
            </div>
            <div className="customer-name">
              <T text="Welcome," /> {customerName}!
            </div>
            <K_CategoryGrid
              categories={kioskCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
          <div className="kiosk-content">
            <h1><T text="Select Your Drink." /></h1>
            {/* Search Bar */}
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="kiosk-search-bar"
            />

            {/* Menu Grid */}
            <div className="kiosk-menu-grid">
              <K_MenuGrid items={filteredMenu} onAddToOrder={handleAddToOrder} />
            </div>

            {/* Footer */}
            <div className="kiosk-footer" onClick={handleCheckout}>
              <div className = "icon-container">
              <img
                id="cart-icon"
                src={highContrast ? "/images/black-cart.png" : "/images/cart-icon.png"}
                alt="Cart Icon"
                className="kiosk-cart-icon"
              />
              <span className="cart-text" ><T text="View My Order"/></span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}