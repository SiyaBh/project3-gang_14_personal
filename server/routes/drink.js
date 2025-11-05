const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create PostgreSQL pool using environment variables
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});


// Get all drinks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT d.*
FROM drink d
JOIN (
    SELECT product_name, MIN(price) AS min_price
    FROM drink
    GROUP BY product_name
) AS min_drink
ON d.product_name = min_drink.product_name
   AND d.price = min_drink.min_price
ORDER BY d.product_name`);
    res.json(result.rows); // rows is an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Add a new drink
router.post('/', async (req, res) => {
    const { product_name, price, product_type, season, available_months } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO drink (product_name, price, product_type, season, available_months) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [product_name, price, product_type, season, available_months]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding drink:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update all drinks by product_name and adjust customizations
router.put('/:product_name', async (req, res) => {
    const { product_name } = req.params;
    const { new_price } = req.body;

    try {
        const oldPriceResult = await pool.query(
            'SELECT price FROM drink WHERE product_name = $1 LIMIT 1',
            [product_name]
        );

        if (oldPriceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        const oldPrice = parseFloat(oldPriceResult.rows[0].price);
        const priceDifference = parseFloat(new_price) - oldPrice;

        const result = await pool.query(
            'UPDATE drink SET price = price + $1 WHERE product_name = $2 RETURNING *',
            [priceDifference, product_name]
        );

        res.json({
            message: `Updated ${result.rowCount} drink(s) with name "${product_name}".`,
            updatedDrinks: result.rows
        });
    } catch (err) {
        console.error('Error updating drink:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete all drinks with the same product_name
router.delete('/:product_name', async (req, res) => {
    const { product_name } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM drink WHERE product_name = $1 RETURNING *',
            [product_name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No drinks found with that name' });
        }

        res.json({
            message: `Deleted ${result.rowCount} drink(s) with name "${product_name}".`,
            deletedDrinks: result.rows
        });
    } catch (err) {
        console.error('Error deleting drink:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Graceful shutdown (optional if you handle in app.js)
process.on('SIGINT', function () {
    pool.end();
    console.log('Database pool closed due to app termination');
    process.exit(0);
});

module.exports = router;
