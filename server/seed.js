const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
    try {
        console.log('Connecting to MySQL...');
        // First connect without DB to ensure it exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Reading schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

        // Remove comments and split by semi-colon to get individual statements
        // This is a naive split but works for simple schemas
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                // Skip empty lines or comments
                if (!statement) continue;
                await connection.query(statement);
                console.log('Executed statement.');
            } catch (err) {
                // Ignore "Database exists" or similar non-fatal errors if helpful, 
                // but usually we want to see errors.
                console.error('Error executing statement:', err.message);
                // Continue despite errors (e.g. if table exists)
            }
        }

        console.log('Seeding complete.');
        await connection.end();
        process.exit(0);

    } catch (err) {
        console.error('Fatal error during seeding:', err.message);
        process.exit(1);
    }
}

seed();
