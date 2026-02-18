import 'package:flutter/material.dart';
import '../services/api_service.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> {
  List<dynamic> _availableOrders = [];
  List<dynamic> _myDeliveries = [];
  bool _isLoading = true;
  bool _isOnline = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      if (_isOnline) {
        final orders = await ApiService.getAvailableDeliveries();
        setState(() => _availableOrders = orders is List ? orders : []);
      }
    } catch (e) {
      // Handle error
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _acceptOrder(int orderId) async {
    try {
      await ApiService.acceptDelivery(orderId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Order accepted! Check your deliveries.')),
      );
      _loadData();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to accept order')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Dashboard'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Online/Offline Toggle
          Container(
            padding: const EdgeInsets.all(16),
            color: _isOnline ? Colors.green.shade50 : Colors.grey.shade100,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _isOnline ? 'You are ONLINE' : 'You are OFFLINE',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: _isOnline ? Colors.green : Colors.grey,
                      ),
                    ),
                    Text(_isOnline ? 'Receiving delivery requests' : 'Go online to receive orders'),
                  ],
                ),
                Switch(
                  value: _isOnline,
                  onChanged: (val) {
                    setState(() => _isOnline = val);
                    if (val) _loadData();
                  },
                  activeColor: Colors.green,
                ),
              ],
            ),
          ),
          
          // Available Orders
          Expanded(
            child: _isOnline
                ? _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _availableOrders.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.delivery_dining, size: 80, color: Colors.grey),
                                SizedBox(height: 16),
                                Text('No orders available right now', style: TextStyle(color: Colors.grey)),
                                Text('Pull down to refresh', style: TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _availableOrders.length,
                              itemBuilder: (context, index) {
                                final order = _availableOrders[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: ListTile(
                                    leading: const CircleAvatar(
                                      backgroundColor: Colors.orange,
                                      child: Icon(Icons.delivery_dining, color: Colors.white),
                                    ),
                                    title: Text('Order #${order['id']}'),
                                    subtitle: Text('${order['store_name']} → ${order['delivery_address']}'),
                                    trailing: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text('${order['total_amount']} DZD', 
                                          style: const TextStyle(fontWeight: FontWeight.bold)),
                                        const SizedBox(height: 4),
                                        ElevatedButton(
                                          onPressed: () => _acceptOrder(order['id']),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.green,
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                          ),
                                          child: const Text('Accept'),
                                        ),
                                      ],
                                    ),
                                    isThreeLine: true,
                                  ),
                                );
                              },
                            ),
                          )
                : const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.power_settings_new, size: 80, color: Colors.grey),
                        SizedBox(height: 16),
                        Text('Go online to start receiving orders', style: TextStyle(color: Colors.grey, fontSize: 18)),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
