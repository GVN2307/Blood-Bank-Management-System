const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'bloodbank.db');
const db = new sqlite3.Database(dbPath);

async function resetAdmin() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@lifelink.com'], function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Admin password reset successful. Rows affected:', this.changes);
        }
        db.close();
    });
}

resetAdmin();
