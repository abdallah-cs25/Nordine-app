-- Reviews table for My Word Marketplace
-- Add this to schema.sql

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_store ON reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_driver ON reviews(driver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Demo reviews
INSERT INTO reviews (user_id, order_id, store_id, driver_id, rating, comment) VALUES
(3, 1, 1, 4, 5, 'خدمة ممتازة وسريعة! Excellent and fast service!'),
(3, 2, 2, NULL, 4, 'منتجات جيدة، التوصيل كان متأخر قليلاً'),
(5, 3, 3, 4, 5, 'العطر أصلي 100%، أنصح به بشدة'),
(5, NULL, 1, NULL, 4, 'أسعار معقولة وجودة عالية')
ON CONFLICT DO NOTHING;
