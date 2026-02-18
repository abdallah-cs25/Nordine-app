const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    try {
        console.log('Running migration...');
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes JSONB;');
        console.log('Successfully added attributes column to products table.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
