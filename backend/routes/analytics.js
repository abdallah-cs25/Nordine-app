const express = require('express');
const db = require('../db');

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const { period = 'today' } = req.query;

        let dateFilter = "created_at >= CURRENT_DATE";
        if (period === 'week') dateFilter = "created_at >= CURRENT_DATE - INTERVAL '7 days'";
        if (period === 'month') dateFilter = "created_at >= CURRENT_DATE - INTERVAL '30 days'";
        if (period === 'year') dateFilter = "created_at >= CURRENT_DATE - INTERVAL '365 days'";

        // Total orders and revenue
        const ordersResult = await pool.query(`
      SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders WHERE ${dateFilter}
    `);

        // Orders by status
        const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders WHERE ${dateFilter}
      GROUP BY status
    `);

        // Active stores
        const storesResult = await pool.query(`
      SELECT COUNT(*) as active_stores FROM stores WHERE is_active = true
    `);

        // Active drivers (those with deliveries)
        const driversResult = await pool.query(`
      SELECT COUNT(DISTINCT driver_id) as active_drivers
      FROM deliveries WHERE ${dateFilter}
    `);

        // New users
        const usersResult = await pool.query(`
      SELECT COUNT(*) as new_users FROM users WHERE ${dateFilter}
    `);

        // Total commissions
        const commissionsResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_commission,
             SUM(CASE WHEN is_collected THEN amount ELSE 0 END) as collected,
             SUM(CASE WHEN NOT is_collected THEN amount ELSE 0 END) as pending
      FROM commissions c WHERE ${dateFilter.replace('created_at', 'c.created_at')}
    `);

        res.json({
            orders: {
                total: parseInt(ordersResult.rows[0].total_orders),
                revenue: parseFloat(ordersResult.rows[0].total_revenue),
                by_status: statusResult.rows
            },
            stores: {
                active: parseInt(storesResult.rows[0].active_stores)
            },
            drivers: {
                active: parseInt(driversResult.rows[0].active_drivers)
            },
            users: {
                new: parseInt(usersResult.rows[0].new_users)
            },
            commissions: {
                total: parseFloat(commissionsResult.rows[0].total_commission || 0),
                collected: parseFloat(commissionsResult.rows[0].collected || 0),
                pending: parseFloat(commissionsResult.rows[0].pending || 0)
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Top stores by revenue
router.get('/top-stores', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const result = await db.query(`
      SELECT s.id, s.name, s.image_url,
             COUNT(o.id) as order_count,
             COALESCE(SUM(o.total_amount), 0) as total_revenue
      FROM stores s
      LEFT JOIN orders o ON s.id = o.store_id AND o.status = 'DELIVERED'
      GROUP BY s.id, s.name, s.image_url
      ORDER BY total_revenue DESC
      LIMIT $1
    `, [parseInt(limit)]);

        res.json(result.rows);
    } catch (error) {
        console.error('Top stores error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Top products by sales
router.get('/top-products', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const result = await db.query(`
      SELECT p.id, p.name, p.price, p.image_url, s.name as store_name,
             COALESCE(SUM(oi.quantity), 0) as total_sold,
             COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN stores s ON p.store_id = s.id
      GROUP BY p.id, p.name, p.price, p.image_url, s.name
      ORDER BY total_sold DESC
      LIMIT $1
    `, [parseInt(limit)]);

        res.json(result.rows);
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Top drivers by deliveries
router.get('/top-drivers', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const result = await db.query(`
      SELECT u.id, u.name, u.phone_number,
             COUNT(d.id) as delivery_count,
             COUNT(CASE WHEN d.status = 'DELIVERED' THEN 1 END) as completed
      FROM users u
      LEFT JOIN deliveries d ON u.id = d.driver_id
      WHERE u.role = 'DRIVER'
      GROUP BY u.id, u.name, u.phone_number
      ORDER BY delivery_count DESC
      LIMIT $1
    `, [parseInt(limit)]);

        res.json(result.rows);
    } catch (error) {
        console.error('Top drivers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Revenue chart data (daily for last 30 days)
router.get('/revenue-chart', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as orders,
             COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

        res.json(result.rows);
    } catch (error) {
        console.error('Revenue chart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Category distribution
router.get('/category-stats', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT c.name, COUNT(p.id) as product_count,
             COALESCE(SUM(oi.quantity), 0) as items_sold
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY c.id, c.name
      ORDER BY items_sold DESC
    `);

        res.json(result.rows);
    } catch (error) {
        console.error('Category stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
