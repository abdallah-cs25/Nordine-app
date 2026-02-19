const express = require('express');
const db = require('../db');
const { authMiddleware, sellerOrAdmin } = require('./auth');

const router = express.Router();

// Get all active ads (public, for the app)
router.get('/', async (req, res) => {
    try {
        const { store_id } = req.query;
        let query = 'SELECT * FROM ads WHERE is_active = true AND (end_date IS NULL OR end_date > NOW())';
        const params = [];

        if (store_id) {
            query += ' AND store_id = $1';
            params.push(store_id);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get ads error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all ads (Admin/Seller with filtering)
router.get('/all', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { store_id } = req.query;
        let query = 'SELECT a.*, s.name as store_name FROM ads a LEFT JOIN stores s ON a.store_id = s.id WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (req.user.role === 'SELLER') {
            query += ` AND s.owner_id = $${paramIndex}`;
            params.push(req.user.id);
            paramIndex++;
        }

        if (store_id) {
            query += ` AND a.store_id = $${paramIndex}`;
            params.push(store_id);
            paramIndex++;
        }

        query += ' ORDER BY a.created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get all ads error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create ad
router.post('/', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { store_id, title, image_url, start_date, end_date, is_active } = req.body;

        // Verify ownership
        if (store_id) {
            const storeCheck = await db.query('SELECT owner_id FROM stores WHERE id = $1', [store_id]);
            if (storeCheck.rows.length === 0) return res.status(404).json({ error: 'Store not found' });

            if (req.user.role !== 'ADMIN' && storeCheck.rows[0].owner_id !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized for this store' });
            }
        } else if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can create global ads' });
        }

        const result = await db.query(
            `INSERT INTO ads (store_id, title, image_url, start_date, end_date, is_active)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [store_id || null, title, image_url, start_date || new Date(), end_date, is_active !== undefined ? is_active : true]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create ad error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update ad
router.put('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image_url, start_date, end_date, is_active } = req.body;

        // Verify ownership
        const adCheck = await db.query('SELECT a.store_id, s.owner_id FROM ads a LEFT JOIN stores s ON a.store_id = s.id WHERE a.id = $1', [id]);
        if (adCheck.rows.length === 0) return res.status(404).json({ error: 'Ad not found' });

        if (req.user.role !== 'ADMIN') {
            // If global ad (store_id null), only admin can edit
            if (!adCheck.rows[0].store_id) return res.status(403).json({ error: 'Not authorized' });
            // If store ad, owner must match
            if (adCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
        }

        const result = await db.query(
            `UPDATE ads SET 
                title = COALESCE($1, title),
                image_url = COALESCE($2, image_url),
                start_date = COALESCE($3, start_date),
                end_date = COALESCE($4, end_date),
                is_active = COALESCE($5, is_active)
            WHERE id = $6 RETURNING *`,
            [title, image_url, start_date, end_date, is_active, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update ad error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete ad
router.delete('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const adCheck = await db.query('SELECT a.store_id, s.owner_id FROM ads a LEFT JOIN stores s ON a.store_id = s.id WHERE a.id = $1', [id]);
        if (adCheck.rows.length === 0) return res.status(404).json({ error: 'Ad not found' });

        if (req.user.role !== 'ADMIN') {
            if (!adCheck.rows[0].store_id) return res.status(403).json({ error: 'Not authorized' });
            if (adCheck.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
        }

        await db.query('DELETE FROM ads WHERE id = $1', [id]);
        res.json({ message: 'Ad deleted' });
    } catch (error) {
        console.error('Delete ad error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
