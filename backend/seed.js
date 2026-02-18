const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function seed() {
    try {
        console.log('🌱 Seeding database...');
        const sql = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Database seeded successfully');
    } catch (err) {
        console.error('❌ Error seeding database:', err.message);
    } finally {
        await pool.end();
    }
}

seed();
