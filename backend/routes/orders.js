const db = require('../db');

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
        const orderResult = await pool.query(
            `INSERT INTO orders (customer_id, store_id, total_amount, delivery_address, delivery_lat, delivery_lng) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, store_id, total_amount, delivery_address, delivery_lat, delivery_lng]
        );

        const order = orderResult.rows[0];

        // Insert order items
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        // Calculate commission
        // Fetch store commission rate
        const storeResult = await pool.query('SELECT commission_rate FROM stores WHERE id = $1', [store_id]);
        const commissionRate = storeResult.rows[0]?.commission_rate || 10; // Default to 10 if not found

        const commissionAmount = total_amount * (commissionRate / 100);
        await pool.query(
            'INSERT INTO commissions (order_id, store_id, amount, rate) VALUES ($1, $2, $3, $4)',
            [order.id, store_id, commissionAmount, commissionRate]
        );

        res.status(201).json({ order, commission: { amount: commissionAmount, rate: commissionRate } });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const itemsResult = await pool.query(
            'SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
            [id]
        );

        res.json({ ...orderResult.rows[0], items: itemsResult.rows });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
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
