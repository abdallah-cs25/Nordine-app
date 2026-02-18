const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Global search
router.get('/', async (req, res) => {
    try {
        const { q, type, limit = 20 } = req.query;

        if (!q || q.length < 2) {
            return res.json({ stores: [], products: [], categories: [] });
        }

        const searchTerm = `%${q}%`;

        let stores = [];
        let products = [];
        let categories = [];

        if (!type || type === 'all' || type === 'stores') {
            const storesResult = await pool.query(`
        SELECT id, name, description, image_url, 
               (SELECT AVG(rating) FROM reviews WHERE store_id = stores.id) as rating
        FROM stores 
        WHERE is_active = true AND (name ILIKE $1 OR description ILIKE $1)
        LIMIT $2
      `, [searchTerm, parseInt(limit)]);
            stores = storesResult.rows;
        }

        if (!type || type === 'all' || type === 'products') {
            const productsResult = await pool.query(`
        SELECT p.id, p.name, p.description, p.price, p.image_url, s.name as store_name
        FROM products p
        JOIN stores s ON p.store_id = s.id
        WHERE p.is_available = true AND (p.name ILIKE $1 OR p.description ILIKE $1)
        LIMIT $2
      `, [searchTerm, parseInt(limit)]);
            products = productsResult.rows;
        }

        if (!type || type === 'all' || type === 'categories') {
            const categoriesResult = await pool.query(`
        SELECT id, name, icon FROM categories WHERE name ILIKE $1 LIMIT $2
      `, [searchTerm, parseInt(limit)]);
            categories = categoriesResult.rows;
        }

        res.json({
            query: q,
            stores,
            products,
            categories,
            total: stores.length + products.length + categories.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Search suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json([]);
        }

        const searchTerm = `${q}%`;

        const result = await pool.query(`
      SELECT DISTINCT name, 'store' as type FROM stores WHERE name ILIKE $1 AND is_active = true
      UNION
      SELECT DISTINCT name, 'product' as type FROM products WHERE name ILIKE $1 AND is_available = true
      UNION
      SELECT DISTINCT name, 'category' as type FROM categories WHERE name ILIKE $1
      LIMIT 10
    `, [searchTerm]);

        res.json(result.rows);
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Popular searches
router.get('/popular', async (req, res) => {
    try {
        // In production, track actual search queries
        const popular = [
            { term: 'Protein', count: 156 },
            { term: 'ملابس رياضية', count: 134 },
            { term: 'عطور', count: 98 },
            { term: 'Gym', count: 87 },
            { term: 'Electronics', count: 76 },
        ];

        res.json(popular);
    } catch (error) {
        console.error('Popular searches error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
