import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import KioskMenu from "./pages/kiosk/KioskMenu";
import KioskOrderPage from "./pages/kiosk/KioskOrderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Portal from "./pages/portal/Portal";

import { TranslationProvider } from "./context/TranslationContext";
import React, { useState, useEffect, useMemo } from "react";
import { getDrinks, placeOrder } from "./api/kiosk"; 

export default function App() {
  const [orderItems, setOrderItems] = useState([]);

  const handleCheckout = async () => {
    await placeOrder(orderItems);
    setOrderItems([]);
  };

  return (
     <TranslationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Portal />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/cashier"
              element={
                <ProtectedRoute role="cashier">
                  <CashierDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/manager"
              element={
                <ProtectedRoute role="manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/welcome/kiosk" 
              element={
                <KioskMenu 
                  orderItems={orderItems} 
                  setOrderItems={setOrderItems} 
                />
              } 
            />
            <Route 
              path="/welcome/kiosk/order" 
              element={
                <KioskOrderPage 
                  orderItems={orderItems} 
                  setOrderItems={setOrderItems} 
                  onCheckout={handleCheckout} 
                />
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </TranslationProvider>
  );
}
