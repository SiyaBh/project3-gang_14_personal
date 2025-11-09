// client/src/components/DrinksManagement.js
import { useEffect, useState } from "react";
import { getDrinks, addDrink, updateDrink, deleteDrink } from "../api/drinks";
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function DrinksManagement() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = () => {
    setLoading(true);
    setError(null);
    getDrinks()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Drinks API did not return an array");
        setDrinks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load drinks");
        setLoading(false);
      });
  };

  const handleAdd = (newItem) => {
    setLoading(true);
    setError(null);
    addDrink(newItem)
      .then(() => {
        fetchDrinks();
        setShowAddForm(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to add drink');
        setLoading(false);
      });
  };

  const handleUpdate = (updatedItem) => {
    setLoading(true);
    setError(null);
    updateDrink(updatedItem.product_name, updatedItem)
      .then(() => {
        setDrinks(prev => prev.map(d => 
          d.product_name === updatedItem.product_name ? updatedItem : d
        ));
        setEditingItem(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to update drink');
        setLoading(false);
      });
  };

  const handleDelete = (product_name) => {
    if (!window.confirm('Are you sure you want to delete this drink?')) return;
    setLoading(true);
    setError(null);
    deleteDrink(product_name)
      .then(() => fetchDrinks())
      .catch((err) => {
        setError(err.message || 'Failed to delete drink');
        setLoading(false);
      });
  };

  const DrinkForm = ({ item, onSave, onCancel, isEdit }) => {
    const [formData, setFormData] = useState(item || {
      product_name: '',
      price: '',
      product_type: '',
      season: '',
      available_months: ''
    });

    return (
      <div style={{
        backgroundColor: colors.secondary,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `2px solid ${colors.primary}`,
      }}>
        <h3 style={{ color: colors.dark, marginTop: 0 }}>
          {isEdit ? 'Edit Drink' : 'Add New Drink'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            placeholder="Drink Name"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="text"
            placeholder="Type"
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="text"
            placeholder="Season"
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="text"
            placeholder="Available Months"
            value={formData.available_months}
            onChange={(e) => setFormData({ ...formData, available_months: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button
            onClick={() => onSave(formData)}
            style={{
              backgroundColor: colors.primary,
              color: colors.secondary,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <Save size={18} /> Save
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: colors.dark,
              color: colors.secondary,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <X size={18} /> Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading && drinks.length === 0) return <p style={{ color: colors.dark }}>Loading drinks...</p>;
  if (error && drinks.length === 0) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: colors.dark, margin: 0 }}>Drinks</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchDrinks}
            disabled={loading}
            style={{
              backgroundColor: colors.dark,
              color: colors.secondary,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
            style={{
              backgroundColor: colors.primary,
              color: colors.secondary,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <Plus size={20} /> Add Drink
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <DrinkForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
          isEdit={false}
        />
      )}

      {editingItem && (
        <DrinkForm
          item={editingItem}
          onSave={handleUpdate}
          onCancel={() => setEditingItem(null)}
          isEdit={true}
        />
      )}

      <div style={{
        backgroundColor: colors.secondary,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: colors.primary, color: colors.secondary }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Season</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Available Months</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink, index) => (
              <tr
                key={drink.product_id}
                style={{
                  backgroundColor: index % 2 === 0 ? colors.secondary : '#f5f5f5',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <td style={{ padding: '15px', color: colors.dark }}>{drink.product_name}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{drink.product_type}</td>
                <td style={{ padding: '15px', color: colors.dark }}>${parseFloat(drink.price).toFixed(2)}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{drink.season}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{drink.available_months}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button
                    onClick={() => { setEditingItem(drink); setShowAddForm(false); }}
                    style={{
                      backgroundColor: colors.dark,
                      color: colors.secondary,
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(drink.product_name)}
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.secondary,
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {drinks.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: colors.dark }}>
            No drinks found. Add your first drink!
          </div>
        )}
      </div>
    </div>
  );
}
