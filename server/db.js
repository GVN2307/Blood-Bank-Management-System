const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const { Pool } = require('pg');

let db;
let pgPool;

// Database Configuration
const isPostgres = process.env.DATABASE_URL || process.env.PGHOST;

async function getDB() {
    if (isPostgres) return null; // Use pgPool instead
    if (db) return db;
    db = await open({
        filename: path.join(__dirname, 'bloodbank.db'),
        driver: sqlite3.Database
    });
    return db;
}

if (isPostgres) {
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    console.log('🐘 PostgreSQL Pool Initialized');
}

// Unified Query Wrapper
const pool = {
    query: async (sql, params) => {
        if (isPostgres) {
            // Postgres uses $1, $2 instead of ?
            let pgSql = sql;
            let count = 1;
            pgSql = sql.replace(/\?/g, () => `$${count++}`);
            const result = await pgPool.query(pgSql, params);
            return [result.rows, result];
        } else {
            const db = await getDB();
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                const rows = await db.all(sql, params);
                return [rows];
            } else {
                const result = await db.run(sql, params);
                return [result];
            }
        }
    }
};

async function initDB() {
    try {
        console.log(`⚡ Initializing ${isPostgres ? 'PostgreSQL' : 'SQLite'} Database...`);
        
        const schema = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                address TEXT,
                latitude REAL,
                longitude REAL,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,
                bloodbank_id INTEGER REFERENCES users(id),
                blood_group TEXT NOT NULL,
                units INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,
                hospital_id INTEGER REFERENCES users(id),
                blood_group TEXT NOT NULL,
                units INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS test_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                hospital_id INTEGER REFERENCES users(id),
                test_type TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                bloodbank_id INTEGER REFERENCES users(id),
                units INTEGER DEFAULT 1,
                donation_date DATE NOT NULL,
                status TEXT DEFAULT 'scheduled'
            );

            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                bloodbank_id INTEGER REFERENCES users(id),
                title TEXT NOT NULL,
                description TEXT,
                event_date DATE,
                location TEXT
            );
        `;

        // SQLite Specific adjustments for SERIAL and TIMESTAMP
        let runSchema = schema;
        if (!isPostgres) {
            runSchema = schema
                .replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
                .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
                .replace(/REFERENCES users\(id\)/g, ''); // SQLite constraints are handled differently in simple scripts
            
            const db = await getDB();
            await db.exec(runSchema);
        } else {
            await pgPool.query(runSchema);
        }

        // Seeding Logic
        const [usersCount] = await pool.query('SELECT count(*) as count FROM users');
        if (parseInt(usersCount[0].count) === 0) {
            console.log('🌱 Seeding Data...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            const adminPassword = await bcrypt.hash('admin123', salt);

            const seedUsers = [
                ['hospital', 'NIMS Hyderabad', 'admin@nims.edu.in', hashedPassword, 'Punjagutta, Hyderabad', 17.4116, 78.4489, '040-23489000'],
                ['bloodbank', 'Indian Red Cross Society', 'redcross@gmail.com', hashedPassword, 'Vidya Nagar, Hyderabad', 17.4042, 78.5026, '040-27633087'],
                ['admin', 'System Admin', 'admin@lifelink.com', adminPassword, 'Hyderabad', 17.3850, 78.4867, '9999999999']
            ];

            for (const u of seedUsers) {
                await pool.query(
                    'INSERT INTO users (type, name, email, password, address, latitude, longitude, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    u
                );
            }
        }
    } catch (err) {
        console.error('Initialisation Error:', err);
    }
}

async function checkConnection() {
    try {
        if (isPostgres) {
            await pgPool.query('SELECT 1');
        } else {
            await getDB();
        }
        console.log('✅ Database Connection Verified');
        return true;
    } catch (e) {
        console.error('❌ Database Connection Failed:', e.message);
        return false;
    }
}

module.exports = { pool, checkConnection, initDB };

