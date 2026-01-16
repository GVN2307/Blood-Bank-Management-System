const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection based on environment variables or defaults
// NOTE: User must setup their MySQL manually or provide credentials.
// For now we assume typical local defaults or empty params if env not set.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blood_bank_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database');
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please make sure MySQL is running and credentials in .env are correct.');
    return false;
  }
}

// Ensure tables exist (Simple migration)
async function initDB() {
    const fs = require('fs');
    const path = require('path');
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        // Split queries by semicolon to execute them one by one (basic approach)
        // Note: This is rudimentary.
        // For robustness, usually we run via CL or migration tool. 
        // Here we just warn user to run schema.sql if tables missing.
    } catch (e) {
        // schema file might be just for reference
    }
}

module.exports = { pool, checkConnection };
