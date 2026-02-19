const express = require('express');
const router = express.Router();
const db = require('../db');

const { authMiddleware, sellerOrAdmin } = require('./auth');

// Get all stores (with optional location filter)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query; // radius in km, default 10km

        let query = 'SELECT * FROM stores WHERE is_active = true';
        let params = [];

        // If location provided, filter by distance (basic Haversine approximation)
        if (lat && lng) {
            query = `
                SELECT * FROM (
                    SELECT *, 
                    (6371 * acos(cos(radians($1)) * cos(radians(location_lat)) 
                    * cos(radians(location_lng) - radians($2)) 
                    + sin(radians($1)) * sin(radians(location_lat)))) AS distance 
                    FROM stores 
                    WHERE is_active = true
                ) AS store_distances
                WHERE distance < $3
                ORDER BY distance
            `;
            params = [parseFloat(lat), parseFloat(lng), parseFloat(radius)];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get store by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM stores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get store error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new store (requires auth and SELLER/ADMIN role)
router.post('/', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { name, description, location_lat, location_lng, address, image_url, commission_rate } = req.body;
        // If admin, they can specify an owner_id, otherwise default to themselves
        const owner_id = (req.user.role === 'ADMIN' && req.body.owner_id) ? req.body.owner_id : req.user.id;

        const result = await db.query(
            `INSERT INTO stores (owner_id, name, description, location_lat, location_lng, address, image_url, commission_rate) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [owner_id, name, description, location_lat, location_lng, address, image_url, commission_rate || 10.00]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update store (update info or toggle active status)
router.put('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location_lat, location_lng, address, image_url, is_active, commission_rate, specializations } = req.body;

        // Check ownership or admin status
        const storeCheck = await db.query('SELECT owner_id FROM stores WHERE id = $1', [id]);
        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        if (req.user.role !== 'ADMIN' && storeCheck.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this store' });
        }

        const result = await db.query(
            `UPDATE stores SET 
                name = COALESCE($1, name), 
                description = COALESCE($2, description), 
                location_lat = COALESCE($3, location_lat), 
                location_lng = COALESCE($4, location_lng), 
                address = COALESCE($5, address), 
                image_url = COALESCE($6, image_url), 
                is_active = COALESCE($7, is_active),
                commission_rate = COALESCE($8, commission_rate),
                specializations = COALESCE($9, specializations)
            WHERE id = $10 RETURNING *`,
            [name, description, location_lat, location_lng, address, image_url, is_active, commission_rate, specializations, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update store error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get products for a store
router.get('/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM products WHERE store_id = $1 AND is_available = true ORDER BY created_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
