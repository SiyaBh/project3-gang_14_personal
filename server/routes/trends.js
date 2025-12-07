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
pool.on('connect', (client) => {
  client.query(`SET TIME ZONE 'America/Chicago'`);
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.product_name, COUNT(*) AS total_sold
      FROM order_drink od
      JOIN drink d ON od.product_id = d.product_id
      GROUP BY d.product_name
      ORDER BY total_sold DESC;
    `);
    res.json(result.rows.map(r => ({
      product_name: r.product_name,
      total_sold: parseInt(r.total_sold) || 0
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product usage' });
  }
});


router.get('/x-report', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(HOUR FROM o.order_time) AS hour,
             SUM(o.total_order_price) AS total_sales,
             COUNT(o.order_id) AS total_orders
      FROM orders o
      WHERE o.order_date = CURRENT_DATE
        AND o.order_time BETWEEN TIME '8:00' AND TIME '22:59:59.999999'
      GROUP BY hour
      ORDER BY hour;
    `);

    const data = result.rows.map(r => ({
      hour: r.hour,
      total_sales: parseFloat(r.total_sales),
      total_orders: parseInt(r.total_orders)
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch X report' });
  }
});


router.get('/z-report', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(HOUR FROM o.order_time) AS hour,
             SUM(o.total_order_price) AS total_sales,
             COUNT(o.order_id) AS total_orders
      FROM orders o
      WHERE o.order_date = CURRENT_DATE
        AND o.order_time BETWEEN TIME '8:00' AND TIME '22:59:59.999999'
      GROUP BY hour
      ORDER BY hour;
    `);

    let cumulativeSales = 0;
    const data = result.rows.map(r => {
      cumulativeSales += parseFloat(r.total_sales);
      return { hour: r.hour, cumulative_sales: cumulativeSales, total_orders: r.total_orders };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Z report' });
  }
});

module.exports = router;
