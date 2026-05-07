const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'bloodbank.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, type, name, email FROM users', (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Users in database:');
        console.table(rows);
    }
    db.close();
});
