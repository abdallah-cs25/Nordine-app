const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database Connected Successfully at:', res.rows[0].now);

        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        console.log('Users count:', userCount.rows[0].count);

        process.exit(0);
    } catch (err) {
        console.error('Database Connection Error:', err);
        process.exit(1);
    }
}

checkConnection();
