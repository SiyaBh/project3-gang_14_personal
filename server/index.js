const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001; // usually server is 3001, React runs on 3000

app.use(cors());
app.use(express.json());


const employeeRouter = require('./routes/employee');
const receiptRouter = require('./routes/receipt');
const ingredientRouter = require('./routes/ingredients');
const drinkRouter = require('./routes/drink');
const kioskRouter = require('./routes/kiosk');
const orderRouter = require('./routes/order');
const trendsRouter = require('./routes/trends');
const authRoutes = require('./routes/auth');
const translateRouter = require('./routes/translate');

app.use('/api/employee', employeeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/drinks', drinkRouter);
app.use('/api/order', orderRouter);
app.use('/api/trends', trendsRouter);
app.use('/auth', authRoutes);
app.use('/api/translate', translateRouter);
app.use('/api/kiosk',kioskRouter);
app.use('/api/receipt',receiptRouter);


app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
