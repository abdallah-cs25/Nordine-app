const express = require('express');
const router = express.Router();
const db = require('../db');

// Get reviews for a store
router.get('/store/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [storeId, parseInt(limit), parseInt(offset)]);

        const avgResult = await pool.query(`
      SELECT AVG(rating) as average, COUNT(*) as total
      FROM reviews WHERE store_id = $1
    `, [storeId]);

        res.json({
            reviews: result.rows,
            average_rating: parseFloat(avgResult.rows[0].average || 0).toFixed(1),
            total_reviews: parseInt(avgResult.rows[0].total)
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        const result = await db.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [productId, parseInt(limit), parseInt(offset)]);

        const avgResult = await pool.query(`
      SELECT AVG(rating) as average, COUNT(*) as total
      FROM reviews WHERE product_id = $1
    `, [productId]);

        res.json({
            reviews: result.rows,
            average_rating: parseFloat(avgResult.rows[0].average || 0).toFixed(1),
            total_reviews: parseInt(avgResult.rows[0].total)
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get reviews for a driver
router.get('/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;

        const result = await db.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.driver_id = $1
      ORDER BY r.created_at DESC
      LIMIT 50
    `, [driverId]);

        const avgResult = await pool.query(`
      SELECT AVG(rating) as average, COUNT(*) as total
      FROM reviews WHERE driver_id = $1
    `, [driverId]);

        res.json({
            reviews: result.rows,
            average_rating: parseFloat(avgResult.rows[0].average || 0).toFixed(1),
            total_reviews: parseInt(avgResult.rows[0].total)
        });
    } catch (error) {
        console.error('Get driver reviews error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create review (after order delivered)
router.post('/', async (req, res) => {
    try {
        const { order_id, store_id, product_id, driver_id, rating, comment } = req.body;
        const user_id = req.user.id;

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if order exists and belongs to user
        if (order_id) {
            const orderCheck = await pool.query(
                'SELECT id FROM orders WHERE id = $1 AND customer_id = $2 AND status = $3',
                [order_id, user_id, 'DELIVERED']
            );
            if (orderCheck.rows.length === 0) {
                return res.status(400).json({ error: 'Can only review delivered orders' });
            }
        }

        // Check if already reviewed
        const existingReview = await pool.query(`
      SELECT id FROM reviews 
      WHERE user_id = $1 AND order_id = $2
    `, [user_id, order_id]);

        if (existingReview.rows.length > 0) {
            return res.status(400).json({ error: 'Already reviewed this order' });
        }

        const result = await db.query(`
      INSERT INTO reviews (user_id, order_id, store_id, product_id, driver_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [user_id, order_id, store_id, product_id, driver_id, rating, comment]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update review
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user.id;

        const result = await db.query(`
      UPDATE reviews SET rating = $1, comment = $2
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [rating, comment, id, user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found or not authorized' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete review
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found or not authorized' });
        }

        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
