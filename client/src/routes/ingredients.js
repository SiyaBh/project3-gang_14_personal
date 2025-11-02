// routes/ingredient.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// DB connection
// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});


// display ingredients 
router.get('/details', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ingredient ORDER BY ingredient_name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ask manager to add a new ingredient 
router.post('/', async (req, res) => {
    const { ingredient_name, stock, price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ingredient (ingredient_name, stock, price) VALUES ($1, $2, $3) RETURNING *',
            [ingredient_name, stock, price]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// update a new ingredient 
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ingredient_name, stock, price } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ingredient SET ingredient_name = $1, stock = $2, price = $3 WHERE ingredient_id = $4 RETURNING *',
            [ingredient_name, stock, price, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE ingredient by thier id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ingredient WHERE ingredient_id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting ingredient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
