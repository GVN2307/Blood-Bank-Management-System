const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function getDB() {
  if (db) return db;
  db = await open({
    filename: path.join(__dirname, 'bloodbank.db'),
    driver: sqlite3.Database
  });
  return db;
}

// Wrapper to mimic mysql2's [rows] return style
const pool = {
  query: async (sql, params) => {
    const db = await getDB();
    // Insert/Update/Delete return specific objects in sqlite, Select returns array
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows]; // Wrap in array to match [rows] from mysql2
    } else {
      const result = await db.run(sql, params);
      return [result];
    }
  }
};

async function initDB() {
  try {
    const db = await getDB();
    console.log('⚡ Initializing SQLite Database...');

    await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT CHECK(type IN ('hospital', 'bloodbank', 'user', 'admin')) NOT NULL,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                address TEXT,
                latitude REAL,
                longitude REAL,
                phone TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bloodbank_id INTEGER,
                blood_group TEXT NOT NULL,
                units INTEGER DEFAULT 0,
                FOREIGN KEY (bloodbank_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hospital_id INTEGER,
                blood_group TEXT NOT NULL,
                units INTEGER NOT NULL,
                status TEXT CHECK(status IN ('pending', 'fulfilled', 'cancelled')) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES users(id)
            );
            
            CREATE TABLE IF NOT EXISTS donations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                bloodbank_id INTEGER,
                units INTEGER DEFAULT 1,
                donation_date DATE NOT NULL,
                status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (bloodbank_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bloodbank_id INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                event_date DATE,
                location TEXT,
                FOREIGN KEY (bloodbank_id) REFERENCES users(id)
            );
        `);

    const usersCount = await db.all('SELECT count(*) as count FROM users');
    if (usersCount[0].count === 0) {
      console.log('🌱 Seeding Data with Hashed Passwords...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);

      const seedUsers = [
        ['hospital', 'NIMS Hyderabad', 'admin@nims.edu.in', 'password123', 'Punjagutta, Hyderabad', 17.4116, 78.4489, '040-23489000'],
        ['hospital', 'Apollo Hospitals Jubilee Hills', 'info@apollo.com', 'password123', 'Film Nagar, Hyderabad', 17.4156, 78.4077, '040-23607777'],
        ['bloodbank', 'Indian Red Cross Society', 'redcross@gmail.com', 'password123', 'Vidya Nagar, Hyderabad', 17.4042, 78.5026, '040-27633087'],
        ['bloodbank', 'Chiranjeevi Blood Bank', 'cbb@gmail.com', 'password123', 'Jubilee Hills, Hyderabad', 17.4265, 78.4128, '040-23547209'],
        ['bloodbank', 'NTR Trust Blood Bank', 'ntr@trust.org', 'password123', 'Banjara Hills, Hyderabad', 17.4107, 78.4356, '040-30799999'],
        ['admin', 'System Admin', 'admin@lifelink.com', 'admin123', 'Hyderabad', 17.3850, 78.4867, '9999999999'],
        ['user', 'Ravi Kumar', 'ravi@gmail.com', 'password123', 'Kukatpally, Hyderabad', 17.4875, 78.3953, '9876543210']
      ];

      for (const u of seedUsers) {
        const hashedPassword = await bcrypt.hash(u[3], salt);
        await db.run(
          'INSERT INTO users (type, name, email, password, address, latitude, longitude, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [u[0], u[1], u[2], hashedPassword, u[4], u[5], u[6], u[7]]
        );
      }

      await db.exec(`
                INSERT INTO inventory (bloodbank_id, blood_group, units) VALUES 
                (3, 'A+', 10), (3, 'O+', 15), (3, 'B-', 5),
                (4, 'AB+', 8), (4, 'O-', 2),
                (5, 'A+', 20), (5, 'B+', 12);

                INSERT INTO events (bloodbank_id, title, description, event_date, location) VALUES
                (3, 'Blood Donation Camp', 'Mega donation camp at OU Campus.', '2023-11-15', 'Osmania University, Hyderabad'),
                (4, 'Health Awareness Run', '5K run for heart health.', '2023-12-01', 'KBR Park, Hyderabad');
            `);
    }

  } catch (err) {
    console.error('Initialisation Error:', err);
  }
}

// Compatibility function
async function checkConnection() {
  try {
    await getDB();
    console.log('✅ Connected to SQLite Database');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = { pool, checkConnection, initDB };
