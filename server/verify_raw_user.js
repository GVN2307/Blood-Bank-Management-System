const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'bloodbank.db');
const db = new sqlite3.Database(dbPath);

db.get('SELECT email, type FROM users WHERE id = 6', (err, row) => {
    if (err) console.error(err);
    else {
        console.log('User ID 6:');
        console.log('Email:', JSON.stringify(row.email));
        console.log('Type:', JSON.stringify(row.type));
    }
    db.close();
});
