# Firebase Push Notifications Setup Guide

## Overview
This guide explains how to integrate Firebase Cloud Messaging (FCM) for push notifications in the My Word app.

---

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → "My Word Marketplace"
3. Enable Google Analytics (optional)

---

## 2. Add Apps to Firebase

### Android
1. Click "Add app" → Android
2. Package name: `com.myword.app`
3. Download `google-services.json`
4. Place in `android/app/`

### iOS
1. Click "Add app" → iOS
2. Bundle ID: `com.myword.app`
3. Download `GoogleService-Info.plist`
4. Place in `ios/Runner/`

---

## 3. Configure Flutter

### Install Packages

Add to `pubspec.yaml`:
```yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.0
```

### Initialize Firebase

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  // Request notification permissions
  await FirebaseMessaging.instance.requestPermission();
  
  // Get FCM token
  final token = await FirebaseMessaging.instance.getToken();
  print('FCM Token: $token');
  
  runApp(MyWordApp());
}
```

### Handle Notifications

```dart
class NotificationService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  static Future<void> initialize() async {
    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);
    
    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((message) {
      print('Foreground message: ${message.notification?.title}');
      _showLocalNotification(message);
    });
    
    // Handle notification tap when app is terminated
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }
    
    // Handle notification tap when app is in background
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
  }

  static Future<void> _handleBackgroundMessage(RemoteMessage message) async {
    print('Background message: ${message.notification?.title}');
  }

  static void _handleNotificationTap(RemoteMessage message) {
    // Navigate based on notification data
    final data = message.data;
    if (data['type'] == 'order') {
      // Navigate to order details
    }
  }
}
```

---

## 4. Backend Integration

### Install Firebase Admin SDK

```bash
cd backend
npm install firebase-admin
```

### Initialize Firebase Admin

Create `backend/config/firebase.js`:
```javascript
const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

### Send Notifications

Update `backend/routes/notifications.js`:
```javascript
const admin = require('../config/firebase');

async function sendPushNotification(token, title, body, data = {}) {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data,
      android: {
        priority: 'high',
        notification: { sound: 'default' }
      },
      apns: {
        payload: {
          aps: { sound: 'default', badge: 1 }
        }
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error };
  }
}
```

---

## 5. Notification Templates

```javascript
// Order confirmed
await sendPushNotification(
  customerToken,
  'تم تأكيد طلبك / Order Confirmed',
  `طلبك رقم #${orderId} قيد التحضير`
);

// Driver assigned
await sendPushNotification(
  customerToken,
  'سائق في الطريق / Driver On The Way',
  `${driverName} يقوم بتوصيل طلبك`
);

// New delivery for driver
await sendPushNotification(
  driverToken,
  'طلب توصيل جديد / New Delivery',
  `طلب جديد من ${storeName}`,
  { type: 'delivery', orderId: order.id.toString() }
);
```

---

## 6. Topics for Broadcast

```javascript
// Subscribe user to topic
await admin.messaging().subscribeToTopic(token, 'offers');

// Send to all subscribed
await admin.messaging().send({
  topic: 'offers',
  notification: {
    title: 'عرض خاص! / Special Offer!',
    body: '50% خصم على جميع المنتجات'
  }
});
```

---

## Resources
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Flutter Docs](https://firebase.flutter.dev/docs/messaging/overview)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
