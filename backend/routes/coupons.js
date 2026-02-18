const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Get all active coupons (public)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT id, code, description, discount_type, discount_value, min_order_amount
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

// Validate coupon
router.post('/validate', async (req, res) => {
    try {
        const { code, order_total } = req.body;

        const result = await pool.query(
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
router.post('/apply', async (req, res) => {
    try {
        const { coupon_id, order_id } = req.body;

        await pool.query(
            'UPDATE coupons SET usage_count = usage_count + 1 WHERE id = $1',
            [coupon_id]
        );

        // Optionally track which user used which coupon
        await pool.query(
            'INSERT INTO coupon_usage (coupon_id, order_id, user_id) VALUES ($1, $2, $3)',
            [coupon_id, order_id, req.user?.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin: Create coupon
router.post('/', async (req, res) => {
    try {
        const {
            code, description, discount_type, discount_value,
            min_order_amount, max_discount, usage_limit, expires_at
        } = req.body;

        const result = await pool.query(`
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

// Admin: Deactivate coupon
router.put('/:id/deactivate', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('UPDATE coupons SET is_active = false WHERE id = $1', [id]);
        res.json({ message: 'Coupon deactivated' });
    } catch (error) {
        console.error('Deactivate coupon error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
