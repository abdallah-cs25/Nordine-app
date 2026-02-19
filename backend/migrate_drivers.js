const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        console.log('Connecting to database...');
        await pool.connect();
        console.log('Connected!');

        console.log('Adding commission_rate column...');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5, 2) DEFAULT 10.00;');

        console.log('Migration successful!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
