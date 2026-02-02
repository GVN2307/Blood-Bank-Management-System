const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authorizeRole } = require('../middleware/authMiddleware');

router.use(authorizeRole('admin'));

// Get System Stats
router.get('/stats', async (req, res) => {
    try {
        const [userCounts] = await pool.query('SELECT type, COUNT(*) as count FROM users GROUP BY type');
        const [totalBlood] = await pool.query('SELECT SUM(units) as total_units FROM inventory');
        const [requestStats] = await pool.query('SELECT status, COUNT(*) as count FROM requests GROUP BY status');

        const stats = {
            users: userCounts,
            blood_units: totalBlood[0]?.total_units || 0,
            requests: requestStats
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, type, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Requests
router.get('/requests', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*, h.name as hospital_name 
            FROM requests r 
            JOIN users h ON r.hospital_id = h.id 
            ORDER BY r.created_at DESC`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
