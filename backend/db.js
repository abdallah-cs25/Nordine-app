const { Pool } = require('pg');
require('dotenv').config();
const mockData = require('./utils/mockDb');

let pool;
let isMockMode = false;

try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 2000 // Fail fast
    });

    // Test connection silently
    pool.query('SELECT 1').catch(() => {
        console.warn('⚠️  Database connection failed. Switching to DEMO MODE (Mock Data).');
        isMockMode = true;
    });

} catch (e) {
    console.warn('⚠️  Database setup failed. Switching to DEMO MODE.');
    isMockMode = true;
}

const db = {
    query: async (text, params) => {
        if (isMockMode) {
            // Simple Mock Logic based on query content
            const q = text.toLowerCase();

            if (q.includes('count') && q.includes('users')) return { rows: [{ count: mockData.users.length }] };
            if (q.includes('count') && q.includes('stores')) return { rows: [{ active_stores: mockData.stores.length }] };
            if (q.includes('count') && q.includes('orders')) return { rows: [{ total_orders: mockData.orders.length, total_revenue: 19500 }] };

            if (q.includes('from users')) return { rows: mockData.users };
            if (q.includes('from stores')) return { rows: mockData.stores };
            if (q.includes('from orders')) return { rows: mockData.orders };
            if (q.includes('from products')) return { rows: mockData.products };

            // Default empty
            return { rows: [] };
        }

        try {
            return await pool.query(text, params);
        } catch (error) {
            console.error('DB Query Error (Switching to mock for this query):', error.message);
            // Fallback to mock if individual query fails (e.g. auth error during runtime)
            isMockMode = true;
            return { rows: [] }; // Return empty first time to prevent crash
        }
    }
};

module.exports = db;
