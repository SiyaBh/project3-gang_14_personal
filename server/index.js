const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001; // usually server is 3001, React runs on 3000

app.use(cors());
app.use(express.json());

const employeeRouter = require('./routes/employee');
const ingredientRouter = require('./routes/ingredients');
const drinkRouter = require('./routes/drink');
const orderRouter = require('./routes/order');
const trendsRouter = require('./routes/trends');


app.use('/api/employee', employeeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/drinks', drinkRouter);
app.use('/api/order', orderRouter);
app.use('/api/trends', trendsRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
