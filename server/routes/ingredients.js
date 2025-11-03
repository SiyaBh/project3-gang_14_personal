// routes/ingredients.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

// Get all ingredients
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ingredient ORDER BY ingredient_name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new ingredient
router.post('/', async (req, res) => {
    const { ingredient_id, ingredient_name, stock, price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ingredient (ingredient_id, ingredient_name, stock, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [ingredient_id, ingredient_name, stock, price]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;