# My Word Marketplace - Admin User Manual

## 1. Dashboard Overview
Access the dashboard at `https://admin.myword.dz`.
Login with your Admin credentials.

### Key Metrics
- **Total Revenue**: Sum of all delivered orders.
- **Active Orders**: Orders currently being processed.
- **New Customers**: Users registered today.

---

## 2. Managing Stores (`/stores`)
- **Add Store**: Click "+ Add Store". Upload logo, set name, description, and pinpoint location on map.
- **Edit**: Update working hours or temporarily disable a store.
- **Products**: Click on a store to view/manage its specific inventory.

---

## 3. Product Management (`/products`)
- **Add Product**: Requires Name, Price, Category, and Image.
- **Stock**: Manage inventory count. Set to 0 to mark "Out of Stock".
- **Categories**: Gym, Clothing, Perfumes, Equipment, etc.

---

## 4. Order Processing (`/orders`)
Orders move through these stages:
1. **PENDING**: New order received.
2. **ACCEPTED**: Store confirms availability.
3. **PREPARING**: Store is packing the items.
4. **READY_FOR_PICKUP**: Waiting for driver.
5. **OUT_FOR_DELIVERY**: Driver picked up.
6. **DELIVERED**: Successfully handed to customer.

**Actions:**
- **Cancel**: Can cancel if not yet picked up.
- **Reassign Driver**: Manually assign a different driver if needed.

---

## 5. Driver Management (`/drivers`)
- **Verification**: Approve new driver mark "Is Active".
- **Tracking**: View driver's last known location.
- **Performance**: View total deliveries and ratings.

---

## 6. Financials
### Commissions (`/commissions`)
- Platform takes **10%** (default) of each order.
- Drivers collect Cash on Delivery (COD).
- **Settlement**: Mark commissions as "Paid" when drivers transfer their dues to the platform.

---

## 7. Marketing
### Coupons (`/coupons`)
- Create codes like `WELCOME50`.
- Set type: Percentage (%) or Fixed Amount (DZD).
- Set expiry date and usage limits.

### Push Notifications
- Send broadcast messages to all users (e.g., "Special Eid Offer").
- Target specific user groups (Customers vs Drivers).

---

## 8. Support & Analytics
- **Reviews**: moderate user reviews. Delete inappropriate content.
- **Analytics**: View sales trends, top performing stores, and category popularity.
