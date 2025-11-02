const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
require('dotenv').config();

// Database connection
const pool = new Pool({
    user: 'gang_14',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'gang_14_db',
    password: 'D0fXm2QW', 
    port: 5432,
});

// Get all drinks
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM drink ORDER BY product_name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching drinks:', err);
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

// 🟡 Update all drinks by product_name and adjust customizations
router.put('/:product_name', async (req, res) => {
    const { product_name } = req.params;
    const { new_price } = req.body;

    try {
        // Get the old price of the base drink
        const oldPriceResult = await pool.query(
            'SELECT price FROM drink WHERE product_name = $1 LIMIT 1',
            [product_name]
        );

        if (oldPriceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        const oldPrice = parseFloat(oldPriceResult.rows[0].price);
        const priceDifference = parseFloat(new_price) - oldPrice;

        // Update ALL drinks with the same product_name (includes customizations)
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

// 🔴 Delete all drinks with the same product_name
router.delete('/:product_name', async (req, res) => {
    const { product_name } = req.params;

    try {
        const result = await pool.query('DELETE FROM drink WHERE product_name = $1 RETURNING *', [product_name]);

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

module.exports = router;
