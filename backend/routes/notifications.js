const express = require('express');
const router = express.Router();

// In production, use Firebase Admin SDK or AWS SNS
// This is a mock implementation for development

// Store device tokens (in production, save to database)
const deviceTokens = new Map();

// Register device token
router.post('/register-device', async (req, res) => {
    try {
        const { user_id, token, platform } = req.body;

        deviceTokens.set(user_id, { token, platform, registered_at: new Date() });

        console.log(`Device registered: User ${user_id}, Platform: ${platform}`);
        res.json({ success: true, message: 'Device registered for notifications' });
    } catch (error) {
        console.error('Register device error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send notification to user
router.post('/send', async (req, res) => {
    try {
        const { user_id, title, body, data } = req.body;

        const device = deviceTokens.get(user_id);

        if (!device) {
            return res.status(404).json({ error: 'User device not registered' });
        }

        // In production, send to FCM/APNS
        // For now, log the notification
        console.log(`[NOTIFICATION] To: ${user_id}`);
        console.log(`  Title: ${title}`);
        console.log(`  Body: ${body}`);
        console.log(`  Data:`, data);

        // Mock successful send
        res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Notification types for ordering system
const NotificationTypes = {
    // Customer notifications
    ORDER_CONFIRMED: (orderId) => ({
        title: 'Order Confirmed',
        title_ar: 'تم تأكيد الطلب',
        body: `Your order #${orderId} has been confirmed`,
        body_ar: `تم تأكيد طلبك رقم #${orderId}`
    }),
    ORDER_PREPARING: (orderId, storeName) => ({
        title: 'Order Being Prepared',
        title_ar: 'جاري تحضير طلبك',
        body: `${storeName} is preparing your order #${orderId}`,
        body_ar: `${storeName} يقوم بتحضير طلبك رقم #${orderId}`
    }),
    DRIVER_ASSIGNED: (orderId, driverName) => ({
        title: 'Driver Assigned',
        title_ar: 'تم تعيين سائق',
        body: `${driverName} is on the way with your order #${orderId}`,
        body_ar: `${driverName} في الطريق إليك بطلبك رقم #${orderId}`
    }),
    ORDER_DELIVERED: (orderId) => ({
        title: 'Order Delivered',
        title_ar: 'تم التوصيل',
        body: `Your order #${orderId} has been delivered!`,
        body_ar: `تم توصيل طلبك رقم #${orderId}!`
    }),

    // Driver notifications
    NEW_DELIVERY_REQUEST: (orderId, storeName, distance) => ({
        title: 'New Delivery Request',
        title_ar: 'طلب توصيل جديد',
        body: `Pickup from ${storeName} - ${distance} km away`,
        body_ar: `استلام من ${storeName} - على بعد ${distance} كم`
    }),

    // Store notifications
    NEW_ORDER: (orderId, itemCount) => ({
        title: 'New Order!',
        title_ar: 'طلب جديد!',
        body: `You have a new order #${orderId} with ${itemCount} items`,
        body_ar: `لديك طلب جديد رقم #${orderId} يحتوي على ${itemCount} منتجات`
    })
};

// Helper function to send order status notifications
router.post('/order-status', async (req, res) => {
    try {
        const { order_id, status, customer_id, driver_id, store_name, driver_name, item_count, distance } = req.body;

        let notification;
        let targetUserId = customer_id;

        switch (status) {
            case 'CONFIRMED':
                notification = NotificationTypes.ORDER_CONFIRMED(order_id);
                break;
            case 'PREPARING':
                notification = NotificationTypes.ORDER_PREPARING(order_id, store_name);
                break;
            case 'DRIVER_ASSIGNED':
                notification = NotificationTypes.DRIVER_ASSIGNED(order_id, driver_name);
                break;
            case 'DELIVERED':
                notification = NotificationTypes.ORDER_DELIVERED(order_id);
                break;
            case 'NEW_DELIVERY':
                notification = NotificationTypes.NEW_DELIVERY_REQUEST(order_id, store_name, distance);
                targetUserId = driver_id;
                break;
            default:
                return res.status(400).json({ error: 'Unknown status' });
        }

        console.log(`[NOTIFICATION] Order ${order_id} -> ${status}`);
        console.log(`  To User: ${targetUserId}`);
        console.log(`  ${notification.title_ar}`);

        res.json({ success: true, notification });
    } catch (error) {
        console.error('Order notification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
