// server/routes/orders.js
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


// Get all orders with drinks 
router.get('/', async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY order_id DESC');
    const orders = ordersResult.rows;

    for (let order of orders) {
      const drinksResult = await pool.query(
        `SELECT d.product_name, od.price, d.product_id
         FROM order_drink od 
         JOIN drink d ON od.product_id = d.product_id 
         WHERE od.order_id = $1`,
        [order.order_id]
      );
      order.drinks = drinksResult.rows;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  const { employee_id, drinks } = req.body; 

  if (!drinks || drinks.length === 0) {
    return res.status(400).json({ error: 'No drinks in order' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    
    let totalPrice = 0;
    const drinkItems = []; 

    for (let item of drinks) {
      const drinkRes = await client.query(
        'SELECT price FROM drink WHERE product_id = $1', 
        [item.product_id]
      );
      
      if (drinkRes.rows.length === 0) {
        throw new Error(`Drink ${item.product_id} not found`);
      }
      
      const drinkPrice = parseFloat(drinkRes.rows[0].price);
      totalPrice += drinkPrice * item.quantity;
      
      // Store for later
      drinkItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: drinkPrice
      });
    }

    // Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (employee_id, total_order_price, order_date, order_time) 
       VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME) 
       RETURNING *`,
      [employee_id, totalPrice]
    );
    const orderId = orderRes.rows[0].order_id;

    // Insert each drink into order_drink (one row per drink instance)
    for (let item of drinkItems) {
      // Insert one row for each quantity
      for (let i = 0; i < item.quantity; i++) {
        await client.query(
          'INSERT INTO order_drink (order_id, product_id, price) VALUES ($1, $2, $3)',
          [orderId, item.product_id, item.price]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ 
      message: 'Order created successfully', 
      order_id: orderId,
      total_price: totalPrice 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;