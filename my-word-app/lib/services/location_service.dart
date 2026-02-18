import 'dart:async';
import 'package:flutter/foundation.dart';

/// GPS Location Service for My Word App
/// Handles store location mapping and real-time delivery tracking
class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  // Stream controller for location updates
  final _locationController = StreamController<LocationData>.broadcast();
  Stream<LocationData> get locationStream => _locationController.stream;

  Timer? _trackingTimer;
  bool _isTracking = false;

  // Algerian cities with store locations
  static const Map<String, LocationData> algerianCities = {
    'algiers': LocationData(lat: 36.7538, lng: 3.0588, name: 'Algiers'),
    'oran': LocationData(lat: 35.6969, lng: -0.6331, name: 'Oran'),
    'constantine': LocationData(lat: 36.3650, lng: 6.6147, name: 'Constantine'),
    'annaba': LocationData(lat: 36.9000, lng: 7.7667, name: 'Annaba'),
    'blida': LocationData(lat: 36.4700, lng: 2.8300, name: 'Blida'),
    'setif': LocationData(lat: 36.1900, lng: 5.4100, name: 'Sétif'),
  };

  /// Get nearby stores based on user location
  Future<List<StoreLocation>> getNearbyStores(double lat, double lng, {double radiusKm = 10}) async {
    // Simulate API call to get nearby stores
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Mock data for demo - in production, this would call the backend API
    return [
      StoreLocation(
        id: 1,
        name: 'Gym Power',
        lat: 36.7538,
        lng: 3.0588,
        category: 'Gym & Clubs',
        specializations: ['Supplements', 'Equipment', 'Coaching'],
        distance: 0.5,
      ),
      StoreLocation(
        id: 2,
        name: 'Fashion Hub',
        lat: 36.7600,
        lng: 3.0500,
        category: 'Clothing & Fashion',
        specializations: ['Men', 'Women', 'Children'],
        distance: 1.2,
      ),
      StoreLocation(
        id: 3,
        name: 'Perfume Palace',
        lat: 36.7520,
        lng: 3.0620,
        category: 'Perfumes & Scents',
        specializations: ['Men', 'Women', 'Oriental'],
        distance: 0.8,
      ),
    ];
  }

  /// Start real-time delivery tracking
  void startDeliveryTracking(int orderId, {Duration interval = const Duration(seconds: 5)}) {
    if (_isTracking) return;
    _isTracking = true;

    debugPrint('🚴 Started tracking delivery #$orderId');

    // Simulate driver moving towards customer
    double driverLat = 36.7538;
    double driverLng = 3.0588;
    const targetLat = 36.7600;
    const targetLng = 3.0650;

    _trackingTimer = Timer.periodic(interval, (timer) {
      // Simulate movement
      if (driverLat < targetLat) driverLat += 0.001;
      if (driverLng < targetLng) driverLng += 0.001;

      final location = LocationData(
        lat: driverLat,
        lng: driverLng,
        name: 'Driver',
        timestamp: DateTime.now(),
      );

      _locationController.add(location);

      // Check if arrived
      if ((driverLat - targetLat).abs() < 0.001 && (driverLng - targetLng).abs() < 0.001) {
        debugPrint('✅ Driver arrived at destination');
        stopDeliveryTracking();
      }
    });
  }

  /// Stop delivery tracking
  void stopDeliveryTracking() {
    _trackingTimer?.cancel();
    _trackingTimer = null;
    _isTracking = false;
    debugPrint('🛑 Stopped delivery tracking');
  }

  /// Calculate distance between two points (Haversine formula)
  static double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
    const double earthRadius = 6371; // km
    final dLat = _toRadians(lat2 - lat1);
    final dLng = _toRadians(lng2 - lng1);
    final a = _sin(dLat / 2) * _sin(dLat / 2) +
        _cos(_toRadians(lat1)) * _cos(_toRadians(lat2)) * _sin(dLng / 2) * _sin(dLng / 2);
    final c = 2 * _atan2(_sqrt(a), _sqrt(1 - a));
    return earthRadius * c;
  }

  static double _toRadians(double degree) => degree * 3.14159265358979 / 180;
  static double _sin(double x) => x - (x * x * x) / 6 + (x * x * x * x * x) / 120;
  static double _cos(double x) => 1 - (x * x) / 2 + (x * x * x * x) / 24;
  static double _sqrt(double x) => x > 0 ? x / 2 + x / (2 * x / 2) : 0; // Simplified
  static double _atan2(double y, double x) => y / (x + 0.0001); // Simplified

  void dispose() {
    stopDeliveryTracking();
    _locationController.close();
  }
}

/// Location data model
class LocationData {
  final double lat;
  final double lng;
  final String name;
  final DateTime? timestamp;

  const LocationData({
    required this.lat,
    required this.lng,
    required this.name,
    this.timestamp,
  });
}

/// Store location model
class StoreLocation {
  final int id;
  final String name;
  final double lat;
  final double lng;
  final String category;
  final List<String> specializations;
  final double distance;

  const StoreLocation({
    required this.id,
    required this.name,
    required this.lat,
    required this.lng,
    required this.category,
    required this.specializations,
    required this.distance,
  });
}
