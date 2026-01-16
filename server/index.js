const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { pool, initDB } = require('./db');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin'); // Make sure this file exists, or remove if unused

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- DATABASE API ---

// Login
app.post('/api/login', async (req, res) => {
    const { email, password, type } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ? AND type = ?', [email, password, type]);
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Blood Banks List
app.get('/api/bloodbanks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE type = "bloodbank"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inventory
app.get('/api/inventory/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory WHERE bloodbank_id = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inventory', async (req, res) => {
    const { bloodbankId, bloodGroup, units } = req.body;
    try {
        // Check if exists
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
app.post('/api/request', async (req, res) => {
    const { hospitalId, bloodGroup, units } = req.body;
    try {
        const [hospital] = await pool.query('SELECT * FROM users WHERE id = ?', [hospitalId]);

        if (hospital.length > 0) {
            // Save request to DB
            await pool.query('INSERT INTO requests (hospital_id, blood_group, units, status) VALUES (?, ?, ?, "pending")', [hospitalId, bloodGroup, units]);

            io.emit('emergency_alert', {
                hospitalName: hospital[0].name,
                bloodGroup,
                units,
                time: new Date(),
                location: { lat: hospital[0].latitude, lng: hospital[0].longitude }
            });
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Hospital not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_room', (room) => socket.join(room));
});

// Initialize DB on Start
initDB();

server.listen(3000, () => {
    console.log(`🚀 Server running on port 3000`);
});
