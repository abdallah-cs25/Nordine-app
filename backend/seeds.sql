-- My Word Marketplace - Seed Data
-- Run this after schema.sql to populate initial data

-- Categories
INSERT INTO categories (name, icon) VALUES
('Gym & Clubs', 'fitness_center'),
('Clothing & Fashion', 'checkroom'),
('Perfumes & Scents', 'local_florist'),
('Equipment', 'build'),
('Food & Restaurants', 'restaurant'),
('Grocery', 'shopping_basket'),
('Electronics', 'devices'),
('Health & Beauty', 'spa'),
('Home & Garden', 'home')
ON CONFLICT DO NOTHING;

-- Demo Users (passwords are hashed version of 'password123')
INSERT INTO users (name, email, password_hash, phone_number, role) VALUES
('Ahmed Admin', 'admin@myword.dz', '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', '+213555000001', 'ADMIN'),
('Karim Store Owner', 'karim@store.dz', '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', '+213555000002', 'SELLER'),
('Fatima Customer', 'fatima@user.dz', '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', '+213555000003', 'CUSTOMER'),
('Omar Driver', 'omar@driver.dz', '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', '+213555000004', 'DRIVER'),
('Sara Customer', 'sara@user.dz', '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', '+213555000005', 'CUSTOMER')
ON CONFLICT DO NOTHING;

-- Demo Stores (Algiers locations)
INSERT INTO stores (owner_id, name, description, location_lat, location_lng, address, image_url, is_active, commission_rate, specializations) VALUES
(2, 'Gym Power', 'Premium fitness equipment and supplements', 36.7538, 3.0588, 'Rue Didouche Mourad, Algiers', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', true, 10.00, ARRAY['Supplements', 'Equipment', 'Coaching']),
(2, 'Fashion Hub', 'Latest fashion trends for men and women', 36.7600, 3.0500, 'Centre Commercial, Algiers', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8', true, 10.00, ARRAY['Men', 'Women', 'Children']),
(2, 'Perfume Palace', 'Authentic branded perfumes', 36.7520, 3.0620, 'Boulevard Khemisti, Algiers', 'https://images.unsplash.com/photo-1541643600914-78b084683601', true, 10.00, ARRAY['Men', 'Women', 'Oriental']),
(2, 'Tech World', 'Electronics and gadgets at best prices', 36.7480, 3.0550, 'Rue Larbi Ben Mhidi, Algiers', 'https://images.unsplash.com/photo-1491933382434-500287f9b54b', true, 10.00, ARRAY['Mobile', 'Laptops', 'Accessories']),
(2, 'Fresh Grocery', 'Daily fresh vegetables and fruits', 36.7650, 3.0450, 'Marché Clauzel, Algiers', 'https://images.unsplash.com/photo-1542838132-92c53300491e', true, 10.00, ARRAY['Vegetables', 'Fruits', 'Organic'])
ON CONFLICT DO NOTHING;

-- Demo Products
INSERT INTO products (store_id, category_id, name, description, price, image_url, stock_quantity, is_available) VALUES
-- Gym Power products
(1, 1, 'Whey Protein 2kg', 'Premium whey protein for muscle building', 8500, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d', 50, true),
(1, 1, 'Dumbbells Set 20kg', 'Adjustable dumbbells for home workout', 15000, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 20, true),
(1, 1, 'Yoga Mat Premium', 'Non-slip yoga mat with carrying bag', 3500, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 100, true),
(1, 1, 'Monthly Gym Membership', 'Full access gym membership - 1 month', 5000, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', 999, true),

-- Fashion Hub products
(2, 2, 'Classic T-Shirt', 'Comfortable cotton t-shirt', 1800, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 200, true),
(2, 2, 'Jeans Original Fit', 'High quality denim jeans', 4500, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 80, true),
(2, 2, 'Sports Jacket', 'Lightweight sports jacket', 7500, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 40, true),
(2, 2, 'Summer Dress', 'Elegant floral summer dress', 5500, 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217', 60, true),

-- Perfume Palace products
(3, 3, 'Oud Perfume 100ml', 'Authentic Arabian oud fragrance', 12000, 'https://images.unsplash.com/photo-1541643600914-78b084683601', 30, true),
(3, 3, 'Rose Collection', 'Premium rose eau de parfum', 8500, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', 45, true),
(3, 3, 'Fresh Sport Cologne', 'Fresh and energetic cologne', 4500, 'https://images.unsplash.com/photo-1595425959155-3c8c8bb08c6d', 100, true),

-- Tech World products
(4, 4, 'Wireless Earbuds', 'Bluetooth 5.0 wireless earbuds', 6500, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 150, true),
(4, 4, 'Smart Watch Pro', 'Fitness tracker with heart rate monitor', 9500, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 75, true),
(4, 4, 'Power Bank 20000mAh', 'Fast charging portable power bank', 3800, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5', 200, true),

-- Fresh Grocery products
(5, 6, 'Fresh Vegetables Box', 'Daily fresh mixed vegetables 5kg', 1500, 'https://images.unsplash.com/photo-1542838132-92c53300491e', 500, true),
(5, 6, 'Premium Olive Oil 1L', 'Extra virgin olive oil from Kabylie', 2800, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 100, true),
(5, 6, 'Local Honey 500g', 'Pure natural honey from Atlas mountains', 3500, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', 80, true)
ON CONFLICT DO NOTHING;

-- Demo Orders
INSERT INTO orders (customer_id, store_id, total_amount, status, delivery_address, delivery_lat, delivery_lng) VALUES
(3, 1, 12000, 'DELIVERED', 'Rue Didouche Mourad 45, Algiers', 36.7550, 3.0600),
(3, 2, 6300, 'PREPARING', 'Boulevard Khemisti 12, Algiers', 36.7550, 3.0600),
(5, 3, 8500, 'OUT_FOR_DELIVERY', 'Rue Larbi Ben Mhidi 78, Algiers', 36.7600, 3.0580),
(5, 4, 9500, 'PENDING', 'Centre Commercial Bab Ezzouar, Algiers', 36.7200, 3.1800)
ON CONFLICT DO NOTHING;

-- Demo Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 8500),
(1, 3, 1, 3500),
(2, 5, 2, 1800),
(2, 6, 1, 4500),
(3, 10, 1, 8500),
(4, 14, 1, 9500)
ON CONFLICT DO NOTHING;

-- Demo Commissions
INSERT INTO commissions (order_id, store_id, amount, rate) VALUES
(1, 1, 1200, 10),
(2, 2, 630, 10),
(3, 3, 850, 10),
(4, 4, 950, 10)
ON CONFLICT DO NOTHING;

-- Demo Deliveries
INSERT INTO deliveries (order_id, driver_id, status) VALUES
(1, 4, 'DELIVERED'),
(3, 4, 'PICKED_UP')
ON CONFLICT DO NOTHING;
