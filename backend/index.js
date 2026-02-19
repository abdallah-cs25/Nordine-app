const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

connectDb();

// Import Routes
const { router: authRoutes, authMiddleware } = require('./routes/auth');
const storesRoutes = require('./routes/stores');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const deliveryRoutes = require('./routes/delivery');
const notificationsRoutes = require('./routes/notifications');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const reviewsRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');
const couponsRoutes = require('./routes/coupons');
const searchRoutes = require('./routes/search');

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to My Word API v1.0', status: 'online' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', authMiddleware, ordersRoutes); // Protected
app.use('/api/delivery', authMiddleware, deliveryRoutes); // Protected
app.use('/api/notifications', authMiddleware, notificationsRoutes); // Protected
app.use('/api/products', productsRoutes); // Public read, protected write
app.use('/api/users', authMiddleware, usersRoutes); // Admin only
app.use('/api/analytics', authMiddleware, analyticsRoutes); // Admin only
app.use('/api/reviews', reviewsRoutes); // Public read, auth write
app.use('/api/favorites', authMiddleware, favoritesRoutes); // Protected
app.use('/api/coupons', couponsRoutes); // Public validate, admin create
app.use('/api/coupons', couponsRoutes); // Public validate, admin create
app.use('/api/search', searchRoutes); // Public
app.use('/api/upload', require('./routes/upload')); // Public upload
app.use('/api/commissions', require('./routes/commissions')); // Admin/Seller
app.use('/api/ads', require('./routes/ads')); // Public/Admin/Seller
// app.use('/api/notifications', ...); // Already there on line 61

// Serve static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`My Word API running on port ${port}`);
});
