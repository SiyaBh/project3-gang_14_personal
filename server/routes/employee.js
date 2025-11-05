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

// Add a new employee
router.post('/', async (req, res) => {
    const { employee_name, employee_role, employee_email } = req.body;

    try {
        // Get next employee_id
        const idResult = await pool.query(
            'SELECT COALESCE(MAX(employee_id), 0) + 1 AS next_id FROM employee'
        );
        const nextId = idResult.rows[0].next_id;

        const result = await pool.query(
            `INSERT INTO employee (employee_id, employee_name, employee_role, employee_email)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nextId, employee_name, employee_role, employee_email]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// update an employee by the employee id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { employee_name, employee_role, employee_email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employee SET employee_name = $1, employee_role = $2, employee_email = $3 WHERE employee_id = $4 RETURNING *',
            [employee_name, employee_role, employee_email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// delete an employee based on id 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM employee WHERE employee_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;