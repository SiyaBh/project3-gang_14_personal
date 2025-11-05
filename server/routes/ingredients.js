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
// Add a new ingredient
router.post('/', async (req, res) => {
    const { ingredient_name, stock, price } = req.body;

    try {
        // Get the current max ingredient_id
        const idResult = await pool.query(
            'SELECT COALESCE(MAX(ingredient_id), 0) + 1 AS next_id FROM ingredient'
        );

        const nextId = idResult.rows[0].next_id;

        const result = await pool.query(
            'INSERT INTO ingredient (ingredient_id, ingredient_name, stock, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [nextId, ingredient_name, stock, price]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Update an ingredient by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ingredient_name, stock, price } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ingredient SET ingredient_name = $1, stock = $2, price = $3 WHERE ingredient_id = $4 RETURNING *',
            [ingredient_name, stock, price, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete an ingredient by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM ingredient WHERE ingredient_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }
        res.json({ message: 'Ingredient deleted successfully', ingredient: result.rows[0] });
    } catch (err) {
        console.error('Error deleting ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;