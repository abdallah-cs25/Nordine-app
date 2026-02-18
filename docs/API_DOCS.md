# My Word API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "secure123",
  "phone_number": "+213555123456",
  "role": "CUSTOMER"  // CUSTOMER | SELLER | DRIVER
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "secure123"
}
```

---

## Stores

### List All Stores
```http
GET /stores
GET /stores?lat=36.75&lng=3.06&radius=10  # Filter by location (km)
```

### Get Store Details
```http
GET /stores/:id
```

### Get Store Products
```http
GET /stores/:id/products
```

### Create Store (Auth Required)
```http
POST /stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gym Power",
  "description": "Fitness equipment and supplements",
  "location_lat": 36.7538,
  "location_lng": 3.0588,
  "address": "123 Main St, Algiers",
  "image_url": "https://..."
}
```

---

## Products

### List Products
```http
GET /products
GET /products?category_id=1
GET /products?search=protein
```

### Get Product
```http
GET /products/:id
```

### Create Product (Auth Required)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "store_id": 1,
  "category_id": 1,
  "name": "Whey Protein",
  "description": "Premium protein powder",
  "price": 5500,
  "image_url": "https://...",
  "stock_quantity": 50
}
```

---

## Categories

### List Categories
```http
GET /categories
```

### Get Category Products
```http
GET /categories/:id/products
```

---

## Orders (Auth Required)

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "store_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2, "price": 2500 },
    { "product_id": 3, "quantity": 1, "price": 1800 }
  ],
  "delivery_address": "456 Street, Algiers",
  "delivery_lat": 36.7540,
  "delivery_lng": 3.0590
}
```

**Response:**
```json
{
  "order": {
    "id": 123,
    "status": "PENDING",
    "total_amount": 6800
  },
  "commission": {
    "amount": 680,
    "rate": 10
  }
}
```

### Get Order
```http
GET /orders/:id
Authorization: Bearer <token>
```

### Update Order Status
```http
PUT /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PREPARING"  // PENDING | PREPARING | READY_FOR_PICKUP | OUT_FOR_DELIVERY | DELIVERED
}
```

---

## Delivery (Driver, Auth Required)

### Get Available Deliveries
```http
GET /delivery/available
Authorization: Bearer <token>
```

### Accept Delivery
```http
POST /delivery/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 123
}
```

### Update Delivery Status
```http
PUT /delivery/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PICKED_UP"  // ACCEPTED | PICKED_UP | DELIVERED
}
```

### Get Driver Deliveries
```http
GET /delivery/driver/:driverId
Authorization: Bearer <token>
```

---

## Notifications (Auth Required)

### Register Device
```http
POST /notifications/register-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 1,
  "token": "fcm_device_token",
  "platform": "android"  // android | ios
}
```

### Send Order Status Notification
```http
POST /notifications/order-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 123,
  "status": "PREPARING",
  "customer_id": 1,
  "store_name": "Gym Power"
}
```

---

## Error Responses

```json
{
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limits

- API: 10 requests/second per IP
- General: 30 requests/second per IP
