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

pool.on('connect', (client) => {
  client.query(`SET TIME ZONE 'America/Chicago'`);
});



router.get('/', async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT order_id, total_order_price
      FROM orders
      ORDER BY order_id DESC
      LIMIT 5;
    `);

    const orders = ordersResult.rows;

    for (const order of orders) {
      const drinksResult = await pool.query(
        `SELECT 
           d.product_name,
           d.price,                
           c.custom_id,
           c.ice_level,
           c.sweetness,
           c.hot_cold,
           c.toppings,
           c.miscellaneous,
           COUNT(*) AS quantity
         FROM order_drink od
         JOIN drink d ON od.product_id = d.product_id
         LEFT JOIN customization c ON d.custom_id = c.custom_id
         WHERE od.order_id = $1
         GROUP BY 
           d.product_name,
           d.price,
           c.custom_id,
           c.ice_level,
           c.sweetness,
           c.hot_cold,
           c.toppings,
           c.miscellaneous`,
        [order.order_id]
      );

      //order.drinks = drinksResult.rows;
      order.drinks = drinksResult.rows.map(row => ({
        product_name: row.product_name,
        price: row.price,                    // may be null if you don't have it
        quantity: Number(row.quantity),
        ice_level: row.ice_level,
        sweetness: row.sweetness,
        hot_cold: row.hot_cold,
        toppings: row.toppings,
        miscellaneous: row.miscellaneous,
      }));
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


//need to get employee id (nullable) and add it to order table but that can be a later problem maybe
router.post('/', async (req, res) => {
  //const { employee_id, drinks } = req.body; 
  //const orderItems = req.body;
  const orderItems = Array.isArray(req.body) ? req.body : req.body?.items;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productIds = [];
    let orderTotal = 0

    for (const item of orderItems) {
      const {
        name,
        category,
        quantity,
        totalPrice,
        options
      } = item;

      //gets the menu id foreign key
      const menuResult = await client.query(
        `SELECT menu_id 
          FROM menu 
          WHERE LOWER(product_name) = LOWER($1)`, 
        [name]
      );
      const menuIDFK = menuResult.rows[0]?.menu_id ?? null;

      orderTotal += (parseFloat(totalPrice)*quantity);

      const iceMap = { None: 0, Less: 50, Regular: 100, More: 125 };
      const sugarMap = { "0%": 0, "30%": 30, "50%": 50, "80%": 80, "100%": 100, "120%": 120 };
      const temperatureMap = { Hot: true, Cold: false };

      const iceLevel = iceMap[options?.ice] ?? null;
      const sweetnessLevel = sugarMap[options?.sugar] ?? null;
      const isHot = temperatureMap[options?.temperature] ?? null;

      //insert customization here first
      const customResult = await client.query(
        `INSERT INTO customization
          (ice_level, sweetness, hot_cold, toppings, miscellaneous)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING custom_id`,
        [
          iceLevel,
          sweetnessLevel,
          isHot,
          options?.toppings ? options.toppings.join(", ") : null,
          options?.misc ? options.misc.join(", ") : null,
        ]
      )
      const customId = customResult.rows[0].custom_id;

      // Insert into drinks here
      for(let i = 0; i < quantity; i++) {
        const productRresult = await client.query(
          `INSERT INTO drink
            (product_name, price, product_type, custom_id, menu_id_fk)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING product_id`,
          [
            name,
            totalPrice,
            category,
            customId,
            menuIDFK
          ]
        );
        const productId = productRresult.rows[0].product_id;
        productIds.push(productId);
      }
    }

    //insert order is now done (employee_id is nullable) -- ***still need to find a way to get employee_id
    const employee_id = 1; //TODO
    const orderResult = await client.query( 
      `INSERT INTO orders (employee_id, total_order_price, order_date, order_time) 
       VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME) 
       RETURNING order_id`,
      [employee_id, orderTotal]
    );
    const orderId = orderResult.rows[0].order_id;

    for(const pid of productIds) {
      await client.query(
        'INSERT INTO order_drink (order_id, product_id) VALUES ($1, $2)',
        [orderId, pid]
      );
    }

    await client.query('COMMIT');
    res.json({ 
      message: 'Order created successfully', 
      order_id: orderId,
      total_price: orderTotal 
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