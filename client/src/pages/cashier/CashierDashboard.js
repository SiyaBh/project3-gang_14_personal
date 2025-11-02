// client/src/pages/cashier/CashierDashboard.js
import React from 'react';
import DrinksList from '../../components/DrinksList';

function CashierDashboard() {
  return (
    <div>
      <h1>Cashier Dashboard</h1>
      <p>Here are all available drinks:</p>
      <DrinksList />
    </div>
  );
}

export default CashierDashboard;
