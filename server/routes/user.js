const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get User Profile
router.get('/profile/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, address, type FROM users WHERE id = ?', [req.params.id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Test Requests
router.get('/tests/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT tr.*, u.name as hospital_name 
            FROM test_requests tr 
            JOIN users u ON tr.hospital_id = u.id 
            WHERE tr.user_id = ? 
            ORDER BY tr.created_at DESC`, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Schedule a Test
router.post('/tests', async (req, res) => {
    const { userId, hospitalId, testType } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO test_requests (user_id, hospital_id, test_type) VALUES (?, ?, ?)',
            [userId, hospitalId, testType]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Donation History
router.get('/donations/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.*, u.name as bloodbank_name 
            FROM donations d 
            JOIN users u ON d.bloodbank_id = u.id 
            WHERE d.user_id = ? 
            ORDER BY d.donation_date DESC`, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
