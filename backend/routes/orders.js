const db = require('../db');

const { authMiddleware, sellerOrAdmin, managerOrAbove } = require('./auth');

// Create new order
router.post('/', async (req, res) => {
    try {
        const { store_id, items, delivery_address, delivery_lat, delivery_lng } = req.body;
        const customer_id = req.user?.id;

        // Calculate total
        let total_amount = 0;
        for (const item of items) {
            total_amount += item.price * item.quantity;
        }

        // Create order
        const orderResult = await db.query(
            `INSERT INTO orders (customer_id, store_id, total_amount, delivery_address, delivery_lat, delivery_lng) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, store_id, total_amount, delivery_address, delivery_lat, delivery_lng]
        );

        const order = orderResult.rows[0];

        // Insert order items
        for (const item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        // Calculate commission
        // Fetch store commission rate
        const storeResult = await db.query('SELECT commission_rate FROM stores WHERE id = $1', [store_id]);
        const commissionRate = storeResult.rows[0]?.commission_rate || 10; // Default to 10 if not found

        const commissionAmount = total_amount * (commissionRate / 100);

        // Check if commission record already exists (sanity check, though new order shouldn't have one)
        await db.query(
            'INSERT INTO commissions (order_id, store_id, amount, rate) VALUES ($1, $2, $3, $4)',
            [order.id, store_id, commissionAmount, commissionRate]
        );

        res.status(201).json({ order, commission: { amount: commissionAmount, rate: commissionRate } });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all orders (Admin/Seller with filters)
router.get('/', managerOrAbove, async (req, res) => {
    try {
        const { status, store_id, customer_id, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT o.*, u.name as customer_name, s.name as store_name 
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            JOIN stores s ON o.store_id = s.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (req.user.role === 'SELLER') {
            // Sellers verify they own the store if store_id is passed, or we find their stores
            // For simplicity, let's assume sellers get orders for their stores.
            // We need to find stores owned by this seller
            query += ` AND s.owner_id = $${paramIndex}`;
            params.push(req.user.id);
            paramIndex++;
        }

        if (status) {
            query += ` AND o.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (store_id) {
            // If seller provided store_id, we already filtered by owner_id, so this is safe/redundant
            query += ` AND o.store_id = $${paramIndex}`;
            params.push(store_id);
            paramIndex++;
        }

        if (customer_id) {
            query += ` AND o.customer_id = $${paramIndex}`;
            params.push(customer_id);
            paramIndex++;
        }

        query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch order with customer, store, and driver details (via deliveries)
        const orderResult = await db.query(
            `SELECT o.*, 
            c.name as customer_name, c.email as customer_email, c.phone_number as customer_phone,
            s.name as store_name, s.owner_id as store_owner_id,
            d.id as delivery_id, d.status as delivery_status, dr.name as driver_name, dr.phone_number as driver_phone
            FROM orders o 
            LEFT JOIN users c ON o.customer_id = c.id
            LEFT JOIN stores s ON o.store_id = s.id
            LEFT JOIN deliveries d ON o.id = d.order_id
            LEFT JOIN users dr ON d.driver_id = dr.id
            WHERE o.id = $1`,
            [id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Authorization check: User must be Admin, Owner of store, or the Customer
        if (req.user && req.user.role !== 'ADMIN') {
            if (req.user.role === 'SELLER' && req.user.id !== order.store_owner_id) {
                return res.status(403).json({ error: 'Not authorized to view this order' });
            }
            if (req.user.role === 'CUSTOMER' && req.user.id !== order.customer_id) {
                return res.status(403).json({ error: 'Not authorized to view this order' });
            }
        }

        const itemsResult = await db.query(
            'SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
            [id]
        );

        res.json({ ...order, items: itemsResult.rows });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status
router.put('/:id/status', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get orders for customer
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        // Verify user is requesting their own data or is Admin
        if (req.user?.id != customerId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await db.query(
            'SELECT o.*, s.name as store_name FROM orders o JOIN stores s ON o.store_id = s.id WHERE o.customer_id = $1 ORDER BY o.created_at DESC',
            [customerId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get customer orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
