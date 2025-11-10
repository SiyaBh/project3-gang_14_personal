const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const { Pool } = require("pg");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

router.post("/google", async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Missing token" });

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        console.log("Google returned email:", email);


        // Lookup employee by email
        const result = await pool.query(
            "SELECT employee_id, employee_name, employee_role FROM employee WHERE LOWER(employee_email) = LOWER($1)",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Not an authorized employee" });
        }

        const employee = result.rows[0];

        return res.json({
            id: employee.employee_id,
            name: employee.employee_name,
            email,
            role: employee.employee_role,
            picture: payload.picture
        });

    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Auth Failed" });
    }
});

module.exports = router;
