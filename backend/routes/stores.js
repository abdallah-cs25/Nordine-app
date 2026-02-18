const db = require('../db');

// Get all stores (with optional location filter)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query; // radius in km, default 10km

        let query = 'SELECT * FROM stores WHERE is_active = true';
        let params = [];

        // If location provided, filter by distance (basic Haversine approximation)
        if (lat && lng) {
            query = `
                SELECT * FROM (
                    SELECT *, 
                    (6371 * acos(cos(radians($1)) * cos(radians(location_lat)) 
                    * cos(radians(location_lng) - radians($2)) 
                    + sin(radians($1)) * sin(radians(location_lat)))) AS distance 
                    FROM stores 
                    WHERE is_active = true
                ) AS store_distances
                WHERE distance < $3
                ORDER BY distance
            `;
            params = [parseFloat(lat), parseFloat(lng), parseFloat(radius)];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get store by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM stores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get store error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new store (requires auth and SELLER/ADMIN role)
router.post('/', async (req, res) => {
    try {
        const { name, description, location_lat, location_lng, address, image_url } = req.body;
        const owner_id = req.user?.id;

        if (!owner_id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = await db.query(
            `INSERT INTO stores (owner_id, name, description, location_lat, location_lng, address, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [owner_id, name, description, location_lat, location_lng, address, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get products for a store
router.get('/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM products WHERE store_id = $1 AND is_available = true ORDER BY created_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
