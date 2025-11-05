// routes/employee.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
require('dotenv').config();

// DB connection
// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});


// display all employee details
router.get('/details', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee ORDER BY employee_id');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// asks manager to insert a new employee 
router.post('/', async (req, res) => {
    const { employee_name, employee_role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO employee (employee_name, employee_role) VALUES ($1, $2) RETURNING *',
            [employee_name, employee_role]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// update an employee by the employee id
router.put('/:id', async (req, res) => {
    const { employee_id } = req.params;
    const { employee_name, employee_role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employee SET employee_name = $1, employee_role = $2 WHERE employee_id = $3 RETURNING *',
            [employee_name, employee_role, employee_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// delete an employee based on id 
router.delete('/:id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        await pool.query('DELETE FROM employee WHERE employee_id = $1', [employee_id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
