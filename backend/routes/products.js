const db = require('../db');

const { authMiddleware, sellerOrAdmin } = require('./auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category_id, search, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT p.*, s.name as store_name, c.name_ar as category_name_ar, c.name_en as category_name_en, c.name_fr as category_name_fr FROM products p LEFT JOIN stores s ON p.store_id = s.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_available = true';
        const params = [];
        let paramIndex = 1;

        if (category_id) {
            query += ` AND p.category_id = $${paramIndex}`;
            params.push(category_id);
            paramIndex++;
        }

        // Add store_id filter
        if (req.query.store_id) {
            query += ` AND p.store_id = $${paramIndex}`;
            params.push(req.query.store_id);
            paramIndex++;
        }

        if (search) {
            query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT p.*, s.name as store_name, c.name_ar as category_name_ar FROM products p LEFT JOIN stores s ON p.store_id = s.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (store owner only or ADMIN)
router.post('/', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { store_id, category_id, name, description, price, image_url, stock_quantity = 0, attributes = {} } = req.body;

        // Verify store ownership
        const storeCheck = await db.query('SELECT owner_id FROM stores WHERE id = $1', [store_id]);
        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        if (req.user.role !== 'ADMIN' && storeCheck.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to add products to this store' });
        }

        const result = await db.query(
            `INSERT INTO products (store_id, category_id, name, description, price, image_url, stock_quantity, attributes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [store_id, category_id, name, description, price, image_url, stock_quantity, attributes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
router.put('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image_url, stock_quantity, is_available, attributes, category_id } = req.body;

        // Check ownership via store
        const productCheck = await db.query('SELECT p.store_id, s.owner_id FROM products p JOIN stores s ON p.store_id = s.id WHERE p.id = $1', [id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (req.user.role !== 'ADMIN' && productCheck.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this product' });
        }

        const result = await db.query(
            `UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), 
       price = COALESCE($3, price), image_url = COALESCE($4, image_url), 
       stock_quantity = COALESCE($5, stock_quantity), is_available = COALESCE($6, is_available),
       attributes = COALESCE($7, attributes), category_id = COALESCE($8, category_id)
       WHERE id = $9 RETURNING *`,
            [name, description, price, image_url, stock_quantity, is_available, attributes, category_id, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
router.delete('/:id', authMiddleware, sellerOrAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Check ownership
        const productCheck = await db.query('SELECT p.store_id, s.owner_id FROM products p JOIN stores s ON p.store_id = s.id WHERE p.id = $1', [id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (req.user.role !== 'ADMIN' && productCheck.rows[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this product' });
        }

        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
