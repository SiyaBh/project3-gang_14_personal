const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const employeeRoutes = require('./routes/employee.js');
const ingredientRoutes = require('./routes/ingredient');
const productRoutes = require('./routes/product');

app.use('/employee', employeeRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/product', productRoutes);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
