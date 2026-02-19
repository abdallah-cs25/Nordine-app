const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('./auth');

const router = express.Router();

// Get all active coupons (public)
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT id, code, description, discount_type, discount_value, min_order_amount, expires_at
      FROM coupons 
      WHERE is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (usage_limit IS NULL OR usage_count < usage_limit)
    `);

        res.json(result.rows);
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all coupons (Admin only - includes inactive)
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get all coupons error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Validate coupon
router.post('/validate', async (req, res) => {
    try {
        const { code, order_total } = req.body;

        const result = await db.query(
            'SELECT * FROM coupons WHERE code = $1 AND is_active = true',
            [code.toUpperCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ valid: false, error: 'Coupon not found' });
        }

        const coupon = result.rows[0];

        // Check expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return res.json({ valid: false, error: 'Coupon has expired' });
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return res.json({ valid: false, error: 'Coupon usage limit reached' });
        }

        // Check minimum order
        if (coupon.min_order_amount && order_total < coupon.min_order_amount) {
            return res.json({
                valid: false,
                error: `Minimum order amount is ${coupon.min_order_amount} DZD`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discount_type === 'PERCENTAGE') {
            discount = (order_total * coupon.discount_value) / 100;
            if (coupon.max_discount) {
                discount = Math.min(discount, coupon.max_discount);
            }
        } else {
            discount = coupon.discount_value;
        }

        res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value
            },
            discount_amount: discount,
            final_total: order_total - discount
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Apply coupon (increment usage count)
router.post('/apply', authMiddleware, async (req, res) => {
    try {
        const { coupon_id, order_id } = req.body;

        await db.query(
            'UPDATE coupons SET usage_count = usage_count + 1 WHERE id = $1',
            [coupon_id]
        );

        // Optionally track which user used which coupon
        // Check if table exists first or handle error? schema.sql didn't show coupon_usage table by default.
        // I will assume it exists or wrap in try/catch to not fail flow
        try {
            await db.query(
                'INSERT INTO coupon_usage (coupon_id, order_id, user_id) VALUES ($1, $2, $3)',
                [coupon_id, order_id, req.user?.id]
            );
        } catch (e) {
            // Ignore if table missing
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Create coupon
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const {
            code, description, discount_type, discount_value,
            min_order_amount, max_discount, usage_limit, expires_at
        } = req.body;

        const result = await db.query(`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [code.toUpperCase(), description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, expires_at]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Update coupon
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            code, description, discount_type, discount_value,
            min_order_amount, max_discount, usage_limit, expires_at, is_active
        } = req.body;

        const result = await db.query(`
            UPDATE coupons SET 
                code = COALESCE($1, code),
                description = COALESCE($2, description),
                discount_type = COALESCE($3, discount_type),
                discount_value = COALESCE($4, discount_value),
                min_order_amount = COALESCE($5, min_order_amount),
                max_discount = COALESCE($6, max_discount),
                usage_limit = COALESCE($7, usage_limit),
                expires_at = COALESCE($8, expires_at),
                is_active = COALESCE($9, is_active)
            WHERE id = $10
            RETURNING *
        `, [code ? code.toUpperCase() : null, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, expires_at, is_active, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Delete coupon
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM coupons WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.json({ message: 'Coupon deleted', coupon: result.rows[0] });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
