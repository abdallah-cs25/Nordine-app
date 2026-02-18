const db = require('../db');

// Get available orders for drivers to accept
router.get('/available', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT o.*, s.name as store_name, s.address as store_address, s.location_lat as store_lat, s.location_lng as store_lng
      FROM orders o 
      JOIN stores s ON o.store_id = s.id 
      WHERE o.status = 'READY_FOR_PICKUP' 
      AND NOT EXISTS (SELECT 1 FROM deliveries d WHERE d.order_id = o.id AND d.status != 'PENDING')
      ORDER BY o.created_at ASC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get available orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Accept delivery
router.post('/accept', async (req, res) => {
    try {
        const { order_id } = req.body;
        const driver_id = req.user?.id;

        if (!driver_id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Check if order is still available
        const existingDelivery = await pool.query(
            'SELECT * FROM deliveries WHERE order_id = $1 AND status IN ($2, $3)',
            [order_id, 'ACCEPTED', 'PICKED_UP']
        );

        if (existingDelivery.rows.length > 0) {
            return res.status(400).json({ error: 'Order already taken by another driver' });
        }

        // Create delivery record
        const deliveryResult = await pool.query(
            'INSERT INTO deliveries (order_id, driver_id, status) VALUES ($1, $2, $3) RETURNING *',
            [order_id, driver_id, 'ACCEPTED']
        );

        // Update order status
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['OUT_FOR_DELIVERY', order_id]);

        res.status(201).json(deliveryResult.rows[0]);
    } catch (error) {
        console.error('Accept delivery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update delivery status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            'UPDATE deliveries SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        // If delivered, update order status and record transaction
        if (status === 'DELIVERED') {
            const delivery = result.rows[0];
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['DELIVERED', delivery.order_id]);

            // Get order and commission details
            const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [delivery.order_id]);
            const commissionResult = await pool.query('SELECT * FROM commissions WHERE order_id = $1', [delivery.order_id]);

            if (orderResult.rows.length > 0 && commissionResult.rows.length > 0) {
                const order = orderResult.rows[0];
                const commission = commissionResult.rows[0];

                // Record transaction
                await pool.query(
                    'INSERT INTO transactions (driver_id, order_id, amount_collected, amount_paid_to_store, commission_amount) VALUES ($1, $2, $3, $4, $5)',
                    [delivery.driver_id, delivery.order_id, order.total_amount, order.total_amount - commission.amount, commission.amount]
                );
            }
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get driver's active deliveries
router.get('/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const result = await db.query(`
      SELECT d.*, o.total_amount, o.delivery_address, s.name as store_name, s.address as store_address
      FROM deliveries d 
      JOIN orders o ON d.order_id = o.id 
      JOIN stores s ON o.store_id = s.id
      WHERE d.driver_id = $1
      ORDER BY d.created_at DESC
    `, [driverId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get driver deliveries error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
