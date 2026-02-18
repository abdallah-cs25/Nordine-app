-- Additional tables for My Word Marketplace
-- Favorites, Coupons, Search tracking

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id),
    UNIQUE(user_id, product_id)
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    max_discount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER REFERENCES coupons(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history (optional, for analytics)
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    results_count INTEGER,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_search_query ON search_history(query);

-- Demo coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, expires_at) VALUES
('WELCOME50', 'خصم 50% للطلب الأول - 50% off first order', 'PERCENTAGE', 50, 2000, 1000, '2026-12-31'),
('SAVE500', 'خصم 500 دج - 500 DZD off', 'FIXED', 500, 3000, 500, '2026-06-30'),
('DELIVERY10', 'خصم 10% على التوصيل - 10% off delivery', 'PERCENTAGE', 10, 1500, NULL, NULL),
('SUMMER2026', 'عرض الصيف - Summer Sale 25%', 'PERCENTAGE', 25, 5000, 200, '2026-08-31')
ON CONFLICT DO NOTHING;

-- Demo favorites
INSERT INTO favorites (user_id, store_id) VALUES
(3, 1), (3, 3), (5, 2)
ON CONFLICT DO NOTHING;

INSERT INTO favorites (user_id, product_id) VALUES
(3, 1), (3, 4), (5, 9), (5, 14)
ON CONFLICT DO NOTHING;
