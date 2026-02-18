# My Word API Documentation

**Base URL**: `http://localhost:3001/api`  
**Version**: 1.0  
**Authentication**: JWT Bearer Token

---

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "password123",
  "phone_number": "+213555123456",
  "role": "CUSTOMER"
}
```
**Roles**: `ADMIN`, `SELLER`, `MANAGER`, `DRIVER`, `CUSTOMER`

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@myword.dz",
  "password": "password123"
}
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Ahmed", "role": "ADMIN" }
}
```

---

## 🏪 Stores

### Get All Stores
```http
GET /stores
```

### Get Store by ID
```http
GET /stores/:id
```

### Create Store (Admin/Seller)
```http
POST /stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fashion Hub",
  "description": "Latest fashion trends",
  "location_lat": 36.7600,
  "location_lng": 3.0500,
  "address": "Centre Commercial, Algiers",
  "specializations": ["Men", "Women", "Children"]
}
```

---

## 📦 Products

### Get Products
```http
GET /products?store_id=1&category_id=2
```

### Create Product (Seller)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "store_id": 1,
  "category_id": 2,
  "name": "Sports T-Shirt",
  "description": "Breathable cotton",
  "price": 2500,
  "stock_quantity": 100,
  "attributes": {
    "Size": "L",
    "Gender": "Men",
    "Color": "Blue"
  }
}
```

---

## 🛒 Orders

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "store_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "delivery_address": "Rue Didouche Mourad 45, Algiers",
  "delivery_lat": 36.7550,
  "delivery_lng": 3.0600
}
```
**Response**:
```json
{
  "order": { "id": 1, "total_amount": 12000, "status": "PENDING" },
  "commission": { "amount": 1200, "rate": 10 }
}
```

### Get Order Status
```http
GET /orders/:id
Authorization: Bearer <token>
```

### Update Order Status (Store/Admin)
```http
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PREPARING"
}
```
**Statuses**: `PENDING`, `ACCEPTED`, `PREPARING`, `READY_FOR_PICKUP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`

---

## 🚴 Delivery

### Get Available Deliveries (Driver)
```http
GET /delivery/available
Authorization: Bearer <token>
```

### Accept Delivery (Driver)
```http
POST /delivery/accept/:orderId
Authorization: Bearer <token>
```

### Update Delivery Status (Driver)
```http
PATCH /delivery/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PICKED_UP"
}
```

---

## 🔔 Notifications

### Register Device
```http
POST /notifications/register-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "fcm_device_token_here",
  "platform": "android"
}
```

### Send Order Notification
```http
POST /notifications/order-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 1,
  "status": "DRIVER_ASSIGNED",
  "customer_id": 3,
  "driver_name": "Omar Benali"
}
```

---

## 📊 Analytics (Admin)

### Get Dashboard Stats
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

### Get Revenue Report
```http
GET /analytics/revenue?start_date=2026-01-01&end_date=2026-01-31
Authorization: Bearer <token>
```

---

## 🎫 Coupons

### Validate Coupon
```http
POST /coupons/validate
Content-Type: application/json

{
  "code": "WELCOME50",
  "order_total": 5000
}
```

---

## Error Responses

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

| Status | Description |
|--------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |
