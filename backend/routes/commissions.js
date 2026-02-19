const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly, managerOrAbove } = require('./auth');

const router = express.Router();

// Get all commissions (Admin/Manager)
router.get('/', authMiddleware, managerOrAbove, async (req, res) => {
    try {
        const { store_id, status, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT c.*, s.name as store_name, o.total_amount as order_total
            FROM commissions c
            JOIN stores s ON c.store_id = s.id
            JOIN orders o ON c.order_id = o.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (req.user.role === 'SELLER') {
            // Sellers only see their commissions (commissions they owe or are owed?)
            // Usually commissions are what store pays to platform.
            // So seller wants to see what they have paid or need to pay.
            query += ` AND s.owner_id = $${paramIndex}`;
            params.push(req.user.id);
            paramIndex++;
        }

        if (store_id) {
            query += ` AND c.store_id = $${paramIndex}`;
            params.push(store_id);
            paramIndex++;
        }

        if (status) {
            query += ` AND c.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get commissions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark commission as collected/paid (Admin only)
router.post('/:id/collect', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "UPDATE commissions SET status = 'PAID' WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Commission not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Collect commission error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get commission statistics
router.get('/stats', authMiddleware, managerOrAbove, async (req, res) => {
    try {
        // Total Unpaid, Total Paid, Total Commissions
        let query = `
            SELECT 
                COUNT(*) as count,
                SUM(amount) as total_amount,
                SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as pending_amount,
                SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as paid_amount
            FROM commissions c
            JOIN stores s ON c.store_id = s.id
        `;
        const params = [];

        if (req.user.role === 'SELLER') {
            query += ' WHERE s.owner_id = $1';
            params.push(req.user.id);
        }

        const result = await db.query(query, params);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get commission stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
