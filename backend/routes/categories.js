const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get products by category
router.get('/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT p.*, s.name as store_name FROM products p JOIN stores s ON p.store_id = s.id WHERE p.category_id = $1 AND p.is_available = true',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get category products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
