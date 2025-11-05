const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT
});



router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.product_name,
        COUNT(*) AS total_sold
      FROM order_drink od
      JOIN drink d ON od.product_id = d.product_id
      GROUP BY d.product_name
      ORDER BY total_sold DESC;
    `);

    const data = result.rows.map(r => ({
      product_name: r.product_name,
      total_sold: parseInt(r.total_sold) || 0
    }));

    res.json(data);
  } catch (err) {
    console.error('Error fetching product usage:', err);
    res.status(500).json({ error: 'Failed to fetch product usage' });
  }
});
module.exports = router;
