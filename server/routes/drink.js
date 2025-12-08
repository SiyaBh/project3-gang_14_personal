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



router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT
    product_name,
    product_type,
    price,
    season,
    available_months,
    image_url,
    description
FROM
    menu;`);
    res.json(result.rows); // rows is an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/', async (req, res) => {
    const { product_name, price, product_type, season, available_months, image_url, description} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO menu (product_name, price, product_type, season, available_months, image_url, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
            [product_name, price, product_type, season, available_months, image_url, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding drink:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/:product_name', async (req, res) => {
    const { product_name } = req.params;
    const { price, product_type, season, available_months, image_url, description } = req.body;

    try {
        const result = await pool.query(
            `UPDATE menu 
             SET price = $1, 
                 product_type = $2, 
                 season = $3, 
                 available_months = $4,
                 image_url = $5,
                 description = $6
             WHERE product_name = $7
             RETURNING *`,
            [price, product_type, season, available_months, image_url, description, product_name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        res.json({
            message: `Updated ${result.rowCount} drink(s) with name "${product_name}".`,
            updatedDrinks: result.rows
        });

    } catch (err) {
        console.error('Error updating drink:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



router.delete('/:product_name', async (req, res) => {
    const { product_name } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM menu WHERE product_name = $1 RETURNING *',
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