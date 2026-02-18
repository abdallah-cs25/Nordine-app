import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://192.168.1.3:3001/api'; // Updated for local network
  static String? _authToken;

  static void setAuthToken(String token) {
    _authToken = token;
  }

  static Map<String, String> get _headers {
    return {
      'Content-Type': 'application/json',
      if (_authToken != null) 'Authorization': 'Bearer $_authToken',
    };
  }

  // --- AUTH ---
  static Future<Map<String, dynamic>> register(String name, String email, String password, String phone) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: jsonEncode({'name': name, 'email': email, 'password': password, 'phone_number': phone}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (data['token'] != null) {
      setAuthToken(data['token']);
    }
    return data;
  }

  // --- STORES ---
  static Future<List<dynamic>> getStores({double? lat, double? lng}) async {
    String url = '$baseUrl/stores';
    if (lat != null && lng != null) {
      url += '?lat=$lat&lng=$lng';
    }
    final response = await http.get(Uri.parse(url), headers: _headers);
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getStore(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/stores/$id'), headers: _headers);
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getStoreProducts(int storeId) async {
    final response = await http.get(Uri.parse('$baseUrl/stores/$storeId/products'), headers: _headers);
    return jsonDecode(response.body);
  }

  // --- CATEGORIES ---
  static Future<List<dynamic>> getCategories() async {
    final response = await http.get(Uri.parse('$baseUrl/categories'), headers: _headers);
    return jsonDecode(response.body);
  }

  // --- ORDERS ---
  static Future<Map<String, dynamic>> createOrder({
    required int storeId,
    required List<Map<String, dynamic>> items,
    required String deliveryAddress,
    double? deliveryLat,
    double? deliveryLng,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: _headers,
      body: jsonEncode({
        'store_id': storeId,
        'items': items,
        'delivery_address': deliveryAddress,
        'delivery_lat': deliveryLat,
        'delivery_lng': deliveryLng,
      }),
    );
    return jsonDecode(response.body);
  }

  // --- DELIVERY (for drivers) ---
  static Future<List<dynamic>> getAvailableDeliveries() async {
    final response = await http.get(Uri.parse('$baseUrl/delivery/available'), headers: _headers);
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> acceptDelivery(int orderId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/delivery/accept'),
      headers: _headers,
      body: jsonEncode({'order_id': orderId}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> updateDeliveryStatus(int deliveryId, String status) async {
    final response = await http.put(
      Uri.parse('$baseUrl/delivery/$deliveryId/status'),
      headers: _headers,
      body: jsonEncode({'status': status}),
    );
    return jsonDecode(response.body);
  }

  // --- REVIEWS ---
  static Future<void> submitReview({
    required int orderId,
    required int storeId,
    required int rating,
    String? comment,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/reviews'),
      headers: _headers,
      body: jsonEncode({
        'order_id': orderId,
        'store_id': storeId,
        'rating': rating,
        'comment': comment,
      }),
    );
    
    if (response.statusCode >= 400) {
      throw Exception(jsonDecode(response.body)['error'] ?? 'Failed to submit review');
    }
  }
}
