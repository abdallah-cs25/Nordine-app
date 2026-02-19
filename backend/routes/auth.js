const db = require('../db');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone_number, role = 'CUSTOMER' } = req.body;

        // Check if user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert user
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, password_hash, phone_number, role]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        let store = null;
        if (user.role === 'SELLER') {
            const storeResult = await db.query('SELECT * FROM stores WHERE owner_id = $1', [user.id]);
            if (storeResult.rows.length > 0) {
                store = storeResult.rows[0];
            }
        }

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            store, // Return store info if available (id, name, etc.)
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Role-Based Access Control (RBAC) Middleware
// Covers all 5 user types: ADMIN, SELLER, MANAGER, DRIVER, CUSTOMER

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied',
                message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};

// Specific role middleware helpers
const adminOnly = requireRole('ADMIN');
const sellerOrAdmin = requireRole('ADMIN', 'SELLER');
const managerOrAbove = requireRole('ADMIN', 'SELLER', 'MANAGER');
const driverOnly = requireRole('DRIVER');
const customerOrDriver = requireRole('CUSTOMER', 'DRIVER');

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, phone_number, role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = {
    router,
    authMiddleware,
    requireRole,
    adminOnly,
    sellerOrAdmin,
    managerOrAbove,
    driverOnly,
    customerOrDriver
};
