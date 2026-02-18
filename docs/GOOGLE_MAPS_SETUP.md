# Google Maps Integration Guide

## Overview
This guide explains how to integrate Google Maps into the My Word mobile app for real-time store locations and driver tracking.

---

## 1. Get Google Maps API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "My Word Marketplace"
3. Enable billing (required for Maps API)

### Step 2: Enable APIs
Enable the following APIs:
- **Maps SDK for Android**
- **Maps SDK for iOS**
- **Directions API** (for navigation)
- **Geocoding API** (for address lookup)
- **Places API** (for search)

### Step 3: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the key:
   - **Android:** Add SHA-1 fingerprint + package name
   - **iOS:** Add bundle identifier
   - **Web:** Add allowed domains

---

## 2. Configure Flutter App

### Android Configuration

**File:** `android/app/src/main/AndroidManifest.xml`
```xml
<manifest ...>
    <application ...>
        <!-- Add inside <application> tag -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_API_KEY_HERE"/>
    </application>
    
    <!-- Add permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

### iOS Configuration

**File:** `ios/Runner/AppDelegate.swift`
```swift
import GoogleMaps

@UIApplicationMain
class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GMSServices.provideAPIKey("YOUR_API_KEY_HERE")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

**File:** `ios/Runner/Info.plist`
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show nearby stores.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>This app needs location access for delivery tracking.</string>
```

---

## 3. Update Flutter Code

### Replace Mock Map with Google Maps

```dart
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';

class MapScreen extends StatefulWidget {
  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _controller;
  Set<Marker> _markers = {};
  LatLng _center = LatLng(36.7538, 3.0588); // Algiers

  @override
  void initState() {
    super.initState();
    _loadStores();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    final permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) return;
    
    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _center = LatLng(position.latitude, position.longitude);
    });
    _controller?.animateCamera(CameraUpdate.newLatLng(_center));
  }

  Future<void> _loadStores() async {
    final stores = await ApiService.getStores();
    setState(() {
      _markers = stores.map((store) => Marker(
        markerId: MarkerId(store['id'].toString()),
        position: LatLng(store['location_lat'], store['location_lng']),
        infoWindow: InfoWindow(
          title: store['name'],
          snippet: store['address'],
          onTap: () => _navigateToStore(store),
        ),
      )).toSet();
    });
  }

  void _navigateToStore(store) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => StoreDetailsScreen(store: store)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GoogleMap(
        initialCameraPosition: CameraPosition(target: _center, zoom: 13),
        markers: _markers,
        myLocationEnabled: true,
        myLocationButtonEnabled: true,
        onMapCreated: (controller) => _controller = controller,
      ),
    );
  }
}
```

---

## 4. Driver Real-Time Tracking

### Update Driver Location

```dart
class DriverLocationService {
  static Timer? _locationTimer;
  
  static void startTracking(int driverId) {
    _locationTimer = Timer.periodic(Duration(seconds: 10), (timer) async {
      final position = await Geolocator.getCurrentPosition();
      await ApiService.updateDriverLocation(
        driverId,
        position.latitude,
        position.longitude,
      );
    });
  }
  
  static void stopTracking() {
    _locationTimer?.cancel();
  }
}
```

### Backend Location Endpoint

Add to `backend/routes/delivery.js`:
```javascript
router.put('/location', async (req, res) => {
  const { driver_id, lat, lng } = req.body;
  await pool.query(
    'UPDATE users SET current_lat = $1, current_lng = $2 WHERE id = $3',
    [lat, lng, driver_id]
  );
  res.json({ success: true });
});
```

---

## 5. Environment Variables

Add to `.env`:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

Add to `lib/config.dart`:
```dart
class Config {
  static const String googleMapsApiKey = String.fromEnvironment(
    'GOOGLE_MAPS_API_KEY',
    defaultValue: 'YOUR_DEV_KEY',
  );
}
```

---

## 6. Pricing

Google Maps Platform offers $200/month free credit. Typical costs:
- **Maps load:** $7 per 1,000 loads
- **Directions:** $5 per 1,000 requests
- **Geocoding:** $5 per 1,000 requests

For a startup, the free tier is usually sufficient.

---

## Resources
- [Google Maps Flutter Package](https://pub.dev/packages/google_maps_flutter)
- [Geolocator Package](https://pub.dev/packages/geolocator)
- [Google Cloud Console](https://console.cloud.google.com/)
