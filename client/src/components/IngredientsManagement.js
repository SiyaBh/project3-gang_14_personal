// client/src/components/IngredientsManagement.js
import { useEffect, useState } from "react";
import { getIngredients, addIngredient, updateIngredient, deleteIngredient } from "../api/ingredients";
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function IngredientsManagement() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    setLoading(true);
    setError(null);
    getIngredients()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Ingredients API did not return an array");
        }
        setIngredients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        setError(err.message || "Failed to load ingredients");
        setLoading(false);
      });
  };

  const handleAdd = (newItem) => {
    setLoading(true);
    setError(null);
    addIngredient(newItem)
      .then(() => {
        fetchIngredients();
        setShowAddForm(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to add ingredient');
        setLoading(false);
      });
  };

  const handleUpdate = (updatedItem) => {
    setLoading(true);
    setError(null);
    updateIngredient(updatedItem.ingredient_id, updatedItem)
      .then(() => {
        fetchIngredients();
        setEditingItem(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to update ingredient');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    setLoading(true);
    setError(null);
    deleteIngredient(id)
      .then(() => {
        fetchIngredients();
      })
      .catch((err) => {
        setError(err.message || 'Failed to delete ingredient');
        setLoading(false);
      });
  };

  const IngredientForm = ({ item, onSave, onCancel, isEdit }) => {
    const [formData, setFormData] = useState(item || {
      ingredient_name: '',
      stock: '',
      price: ''
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
          {isEdit ? 'Edit Ingredient' : 'Add New Ingredient'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            placeholder="Ingredient Name"
            value={formData.ingredient_name}
            onChange={(e) => setFormData({ ...formData, ingredient_name: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              fontWeight: '600',
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

  if (loading && ingredients.length === 0) {
    return <p style={{ color: colors.dark }}>Loading ingredients...</p>;
  }

  if (error && ingredients.length === 0) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: colors.dark, margin: 0 }}>Ingredients</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchIngredients}
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
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingItem(null);
            }}
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
              fontWeight: '600',
            }}
          >
            <Plus size={20} /> Add Ingredient
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
        <IngredientForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
          isEdit={false}
        />
      )}

      {editingItem && (
        <IngredientForm
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
              <th style={{ padding: '15px', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item, index) => (
              <tr
                key={item.ingredient_id}
                style={{
                  backgroundColor: index % 2 === 0 ? colors.secondary : '#f5f5f5',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <td style={{ padding: '15px', color: colors.dark }}>{item.ingredient_name}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{item.stock}</td>
                <td style={{ padding: '15px', color: colors.dark }}>${parseFloat(item.price).toFixed(2)}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowAddForm(false);
                    }}
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
                    onClick={() => handleDelete(item.ingredient_id)}
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
        {ingredients.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: colors.dark }}>
            No ingredients found. Add your first ingredient!
          </div>
        )}
      </div>
    </div>
  );
}