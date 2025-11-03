// client/src/pages/manager/ManagerDashboard.js
import React, { useState } from 'react';
import DrinksList from '../../components/DrinksList';
import IngredientsManagement from '../../components/IngredientsManagement';
import EmployeeManagement from '../../components/EmployeeManagement';
// import AnalyticsAndTrends from '../../components/AnalyticsAndTrends';

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('menu');

  const tabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'employees', label: 'Employees' },
    { id: 'analytics', label: 'Analytics & Trends' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: colors.primary,
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            color: colors.secondary,
            margin: 0,
            fontSize: '32px',
            fontWeight: 'bold',
          }}>
            Manager Dashboard
          </h1>
          <p style={{
            color: colors.secondary,
            margin: '10px 0 0 0',
            opacity: 0.9,
          }}>
            Boba Tea Shop Management System
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: colors.secondary,
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? colors.primary : colors.dark,
                color: colors.secondary,
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          backgroundColor: colors.secondary,
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          { activeTab === 'menu' && <DrinksList />}
          {activeTab === 'ingredients' && <IngredientsManagement />}
          { activeTab === 'employees' && <EmployeeManagement />}
          {/* {activeTab === 'analytics' && <AnalyticsAndTrends />} */}
        </div>
      </div>
    </div>
  );
}