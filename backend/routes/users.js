const express = require('express');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const db = require('../db');

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Get all users (Admin only)
router.get('/', async (req, res) => {
    try {
        const { role, search, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT id, name, email, phone_number, role, is_active, created_at FROM users WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (role) {
            query += ` AND role = $${paramIndex}`;
            params.push(role);
            paramIndex++;
        }

        if (search) {
            query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT id, name, email, phone_number, role, is_active, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone_number, role, is_active } = req.body;

        const result = await db.query(
            `UPDATE users SET name = COALESCE($1, name), phone_number = COALESCE($2, phone_number), 
       role = COALESCE($3, role), is_active = COALESCE($4, is_active)
       WHERE id = $5 RETURNING id, name, email, phone_number, role, is_active`,
            [name, phone_number, role, is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user password (Admin or self)
router.put('/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { new_password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(new_password, salt);

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted', user: result.rows[0] });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const totalCustomers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER'");
        const totalDrivers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'DRIVER'");
        const totalSellers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'SELLER'");
        const todayUsers = await pool.query("SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE");

        res.json({
            total: parseInt(totalUsers.rows[0].count),
            customers: parseInt(totalCustomers.rows[0].count),
            drivers: parseInt(totalDrivers.rows[0].count),
            sellers: parseInt(totalSellers.rows[0].count),
            today: parseInt(todayUsers.rows[0].count)
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
