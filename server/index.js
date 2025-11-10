const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
const employeeRouter = require('./routes/employee');
const ingredientRouter = require('./routes/ingredients');
const drinkRouter = require('./routes/drink');
const orderRouter = require('./routes/order');
const trendsRouter = require('./routes/trends');
const authRoutes = require('./routes/auth');

app.use('/api/employee', employeeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/drinks', drinkRouter);
app.use('/api/order', orderRouter);
app.use('/api/trends', trendsRouter);
app.use('/auth', authRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
