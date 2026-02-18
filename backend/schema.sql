-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SELLER', 'MANAGER', 'DRIVER', 'CUSTOMER')),
    language_preference VARCHAR(10) DEFAULT 'ar',
    apple_id VARCHAR(255) UNIQUE, -- For Apple Sign In
    google_id VARCHAR(255) UNIQUE, -- For Google Sign In
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    address TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    commission_rate DECIMAL(5, 2) DEFAULT 10.00,
    specializations TEXT[], -- Array of strings e.g. ['Men', 'Women', 'Kids']
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store Managers Table (Link Users to Stores)
CREATE TABLE store_managers (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    name_fr VARCHAR(100),
    image_url VARCHAR(255)
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    attributes JSONB, -- Stores size, gender, color, cuisine_type, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    delivery_address TEXT,
    delivery_lat DECIMAL(9, 6),
    delivery_lng DECIMAL(9, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table (Split by store implicitly via product->store, but logic handles splitting)
-- NOTE: If we split orders per store at creation, we might need a "Parent Order" or just "Sub Orders".
-- For simplicity, let's assume 'orders' are per-store. If a customer buys from multiple stores, multiple 'orders' are created.
-- Let's add store_id to orders to make it explicit that an order belongs to one store.
ALTER TABLE orders ADD COLUMN store_id INTEGER REFERENCES stores(id);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Deliveries Table
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    driver_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'DELIVERED')),
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commissions Table
CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    store_id INTEGER REFERENCES stores(id),
    amount DECIMAL(10, 2) NOT NULL, -- Calculated commission amount
    rate DECIMAL(5, 2) NOT NULL, -- Percentage used
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SETTLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions (Cash handling logs)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    amount_collected DECIMAL(10, 2), -- From customer
    amount_paid_to_store DECIMAL(10, 2), -- To seller (minus commission)
    commission_amount DECIMAL(10, 2), -- To platform (kept by driver or paid later?)
    -- In cash model: Driver collects Cash. Driver pays Store (Price - Commission). Driver keeps Commission? Or Driver pays full and Store pays Commission?
    -- Requirement: "Driver collects cash from customer. Driver pays seller (minus commission)."
    -- So Driver owes Platform the Commission.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ads/Offers Table
CREATE TABLE ads (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PERFORMANCE INDEXES
-- Essential for preventing lag during high load
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_ads_store ON ads(store_id);

