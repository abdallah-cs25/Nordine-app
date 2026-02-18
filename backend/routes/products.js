const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category_id, search, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT p.*, s.name as store_name, c.name as category_name FROM products p LEFT JOIN stores s ON p.store_id = s.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_available = true';
        const params = [];
        let paramIndex = 1;

        if (category_id) {
            query += ` AND p.category_id = $${paramIndex}`;
            params.push(category_id);
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
            'SELECT p.*, s.name as store_name, c.name as category_name FROM products p LEFT JOIN stores s ON p.store_id = s.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
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

// Create product (store owner only)
router.post('/', async (req, res) => {
    try {
        const { store_id, category_id, name, description, price, image_url, stock_quantity = 0, attributes = {} } = req.body;

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
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image_url, stock_quantity, is_available, attributes } = req.body;

        const result = await db.query(
            `UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), 
       price = COALESCE($3, price), image_url = COALESCE($4, image_url), 
       stock_quantity = COALESCE($5, stock_quantity), is_available = COALESCE($6, is_available),
       attributes = COALESCE($7, attributes)
       WHERE id = $8 RETURNING *`,
            [name, description, price, image_url, stock_quantity, is_available, attributes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
