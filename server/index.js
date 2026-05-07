const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
    const { checkConnection } = require('./db');
    const dbStatus = await checkConnection();
    res.json({
        status: 'online',
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Public Blood Banks List
app.get('/api/bloodbanks', async (req, res) => {
    const { pool } = require('./db');
    try {
        const [rows] = await pool.query('SELECT id, name, address, latitude as lat, longitude as lng, phone FROM users WHERE type = ?', ['bloodbank']);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Inventory (Protected)
app.get('/api/inventory/:id', authenticateToken, async (req, res) => {
    const { pool } = require('./db');
    if (parseInt(req.params.id) !== req.user.id && req.user.type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM inventory WHERE bloodbank_id = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inventory', authenticateToken, async (req, res) => {
    const { pool } = require('./db');
    const { bloodGroup, units } = req.body;
    const bloodbankId = req.user.id;
    if (req.user.type !== 'bloodbank') return res.status(403).json({ error: 'Blood Bank access required' });
    
    try {
        const [existing] = await pool.query('SELECT * FROM inventory WHERE bloodbank_id = ? AND blood_group = ?', [bloodbankId, bloodGroup]);
        if (existing.length > 0) {
            await pool.query('UPDATE inventory SET units = ? WHERE id = ?', [units, existing[0].id]);
        } else {
            await pool.query('INSERT INTO inventory (bloodbank_id, blood_group, units) VALUES (?, ?, ?)', [bloodbankId, bloodGroup, units]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Broadcast Alert
app.post('/api/request', authenticateToken, async (req, res) => {
    const { pool } = require('./db');
    const { bloodGroup, units } = req.body;
    const hospitalId = req.user.id;
    if (req.user.type !== 'hospital') return res.status(403).json({ error: 'Hospital access required' });

    try {
        const [hospital] = await pool.query('SELECT * FROM users WHERE id = ?', [hospitalId]);
        if (hospital.length > 0) {
            await pool.query('INSERT INTO requests (hospital_id, blood_group, units, status) VALUES (?, ?, ?, "pending")', [hospitalId, bloodGroup, units]);
            
            const io = app.get('io');
            if (io) {
                io.emit('emergency_alert', {
                    hospitalName: hospital[0].name,
                    bloodGroup,
                    units,
                    time: new Date(),
                    location: { lat: hospital[0].latitude, lng: hospital[0].longitude }
                });
            }
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Hospital not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize DB only if not in serverless mode or on first hit
if (process.env.NODE_ENV !== 'production') {
    initDB();
}

if (require.main === module) {
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
        console.log(`🚀 LifeLink Grid active on port ${PORT}`);
    });
}

module.exports = app;


