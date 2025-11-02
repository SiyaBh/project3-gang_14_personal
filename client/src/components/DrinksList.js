// src/components/DrinksList.js
import { useEffect, useState } from "react";
import { getDrinks } from "../api/drinks";

export default function DrinksList() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDrinks()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Drinks API did not return an array");
        }
        setDrinks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching drinks:", err);
        setError(err.message || "Failed to load drinks");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading drinks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (drinks.length === 0) return <p>No drinks available.</p>;

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Type</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Price</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Customization ID</th>
        </tr>
      </thead>
      <tbody>
        {drinks.map((drink) => (
          <tr key={drink.product_id}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {drink.product_name}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {drink.product_type}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              ${drink.price.toFixed(2)}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {drink.custom_id}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
