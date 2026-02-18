# API Documentation

Base URL: `http://localhost:3001`

## Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

## Stores
- GET `/api/stores` - List all stores (with pagination and location filter)
- GET `/api/stores/:id` - Get store details
- POST `/api/stores` - Create new store (Seller/Admin only)

## Products
- GET `/api/products` - List products (filter by store, category)
- POST `/api/products` - Add new product

## Orders
- POST `/api/orders` - Create new order
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/status` - Update order status

## Delivery
- GET `/api/delivery/available` - Get available orders for drivers
- POST `/api/delivery/accept` - Accept an order for delivery
