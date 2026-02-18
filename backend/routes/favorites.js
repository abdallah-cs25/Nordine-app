const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Get user's favorites
router.get('/', async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
      SELECT f.*, 
             CASE 
               WHEN f.store_id IS NOT NULL THEN json_build_object('type', 'store', 'id', s.id, 'name', s.name, 'image_url', s.image_url)
               WHEN f.product_id IS NOT NULL THEN json_build_object('type', 'product', 'id', p.id, 'name', p.name, 'price', p.price, 'image_url', p.image_url)
             END as item
      FROM favorites f
      LEFT JOIN stores s ON f.store_id = s.id
      LEFT JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [user_id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to favorites
router.post('/', async (req, res) => {
    try {
        const user_id = req.user.id;
        const { store_id, product_id } = req.body;

        if (!store_id && !product_id) {
            return res.status(400).json({ error: 'Must specify store_id or product_id' });
        }

        // Check if already favorited
        const existing = await pool.query(
            'SELECT id FROM favorites WHERE user_id = $1 AND (store_id = $2 OR product_id = $3)',
            [user_id, store_id, product_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Already in favorites' });
        }

        const result = await pool.query(
            'INSERT INTO favorites (user_id, store_id, product_id) VALUES ($1, $2, $3) RETURNING *',
            [user_id, store_id || null, product_id || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from favorites
router.delete('/:id', async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check if item is favorited
router.get('/check', async (req, res) => {
    try {
        const user_id = req.user.id;
        const { store_id, product_id } = req.query;

        const result = await pool.query(
            'SELECT id FROM favorites WHERE user_id = $1 AND (store_id = $2 OR product_id = $3)',
            [user_id, store_id || null, product_id || null]
        );

        res.json({ is_favorited: result.rows.length > 0, favorite_id: result.rows[0]?.id });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
