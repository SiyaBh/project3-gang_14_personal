const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001; // usually server is 3001, React runs on 3000

app.use(cors());
app.use(express.json());

const employeeRouter = require('./routes/employee.js');
const ingredientRouter = require('./routes/ingredients');
const drinkRouter = require('./routes/drink');

app.use('/api/employee', employeeRouter);
app.use('/api/ingredient', ingredientRouter);
app.use('/api/drinks', drinkRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
