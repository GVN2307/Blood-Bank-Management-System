const mysql = require('mysql2/promise');

async function testConnection() {
    const passwords = ['', 'root', 'password', 'admin', '1234', '123456'];

    for (const pwd of passwords) {
        try {
            console.log(`Trying root / '${pwd}' ...`);
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pwd
            });
            console.log(`✅ SUCCESS! Password is '${pwd}'`);
            await connection.end();
            return;
        } catch (err) {
            console.log(`❌ Failed: ${err.message}`);
        }
    }
    console.log('Unable to connect with common passwords.');
}

testConnection();
