const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'bloodbank.db');
const db = new sqlite3.Database(dbPath);

const email = 'admin@lifelink.com';
const password = 'admin123';
const type = 'admin';

db.get('SELECT * FROM users WHERE email = ? AND type = ?', [email, type], async (err, user) => {
    if (err) {
        console.error(err);
    } else if (!user) {
        console.log('User not found');
    } else {
        console.log('User found:', user.email);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
    }
    db.close();
});
