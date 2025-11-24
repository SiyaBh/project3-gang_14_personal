const express = require('express');
const router = express.Router();

const drinkRouter = require('./drink');
const orderRouter = require('./order');

router.use('/drinks', drinkRouter);

router.use('/order', orderRouter);

module.exports = router;
