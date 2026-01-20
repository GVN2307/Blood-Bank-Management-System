const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, type, phone, address, latitude, longitude } = req.body;

    if (!name || !email || !password || !type) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert User
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, type, phone, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, type, phone, address, latitude || null, longitude || null]
        );

        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password, type } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND type = ?', [email, type]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Compare password (support both hashed and legacy plain text for transition if needed, but here we enforce hash or plain check)
        // NOTE: For existing users with plain text, this might fail unless we migrate them.
        // We will assume new users use hash. For legacy support, we might need a condition.
        const isMatch = await bcrypt.compare(password, user.password);

        // fallback for legacy plain text passwords (remove this in production once migrated)
        const isLegacyMatch = user.password === password;

        if (!isMatch && !isLegacyMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({ success: true, token, user: userWithoutPassword });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
