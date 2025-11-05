// client/src/components/EmployeeManagement.js
import { useEffect, useState } from "react";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../api/employee";
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';

const colors = {
  primary: '#BF1834',
  secondary: '#FFFFFF',
  dark: '#221713',
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    setError(null);
    getEmployees()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Employees API did not return an array");
        }
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load employees");
        setLoading(false);
      });
  };

  const handleAdd = (newItem) => {
    setLoading(true);
    setError(null);
    addEmployee(newItem)
      .then(() => {
        fetchEmployees();
        setShowAddForm(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to add employee');
        setLoading(false);
      });
  };

  const handleUpdate = (updatedItem) => {
    setLoading(true);
    setError(null);
    updateEmployee(updatedItem.employee_id, updatedItem)
      .then(() => {
        fetchEmployees();
        setEditingItem(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to update employee');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    setError(null);
    deleteEmployee(id)
      .then(() => {
        fetchEmployees();
      })
      .catch((err) => {
        setError(err.message || 'Failed to delete employee');
        setLoading(false);
      });
  };

  const EmployeeForm = ({ item, onSave, onCancel, isEdit }) => {
    const [formData, setFormData] = useState(item || {
      employee_name: '',
      employee_role: ''
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
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
          <input
            type="text"
            placeholder="Employee Name"
            value={formData.employee_name}
            onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.employee_role}
            onChange={(e) => setFormData({ ...formData, employee_role: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: `1px solid ${colors.dark}`,
            }}
          />
          <input
            type="text"
            placeholder="Email"
            value={formData.employee_email}
            onChange={(e) => setFormData({ ...formData, employee_email: e.target.value })}
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

  if (loading && employees.length === 0) {
    return <p style={{ color: colors.dark }}>Loading employees...</p>;
  }

  if (error && employees.length === 0) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: colors.dark, margin: 0 }}>Employees</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchEmployees}
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
            <Plus size={20} /> Add Employee
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
        <EmployeeForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
          isEdit={false}
        />
      )}

      {editingItem && (
        <EmployeeForm
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
              <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((item, index) => (
              <tr
                key={item.employee_id}
                style={{
                  backgroundColor: index % 2 === 0 ? colors.secondary : '#f5f5f5',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <td style={{ padding: '15px', color: colors.dark }}>{item.employee_name}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{item.employee_role}</td>
                <td style={{ padding: '15px', color: colors.dark }}>{item.employee_email}</td>
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
                    onClick={() => handleDelete(item.employee_id)}
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
        {employees.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: colors.dark }}>
            No employees found. Add your first employee!
          </div>
        )}
      </div>
    </div>
  );
}
