import 'package:flutter/material.dart';
import 'order_tracking_screen.dart';
import 'review_screen.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _orders = [
    {
      'id': 1,
      'store_id': 1,
      'store_name': 'Gym Power',
      'total_amount': 12000,
      'status': 'DELIVERED',
      'items_count': 2,
      'date': '2026-01-28',
    },
    {
      'id': 2,
      'store_id': 2,
      'store_name': 'Fashion Hub',
      'total_amount': 6300,
      'status': 'PREPARING',
      'items_count': 3,
      'date': '2026-01-30',
    },
    {
      'id': 3,
      'store_id': 3,
      'store_name': 'Perfume Palace',
      'total_amount': 8500,
      'status': 'OUT_FOR_DELIVERY',
      'items_count': 1,
      'date': '2026-01-30',
    },
    {
      'id': 4,
      'store_id': 4,
      'store_name': 'Tech World',
      'total_amount': 9500,
      'status': 'CANCELLED',
      'items_count': 1,
      'date': '2026-01-25',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _activeOrders =>
    _orders.where((o) => !['DELIVERED', 'CANCELLED'].contains(o['status'])).toList();

  List<Map<String, dynamic>> get _pastOrders =>
    _orders.where((o) => ['DELIVERED', 'CANCELLED'].contains(o['status'])).toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('طلباتي / My Orders'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            Tab(text: 'نشطة (${_activeOrders.length})'),
            Tab(text: 'سابقة (${_pastOrders.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrderList(_activeOrders, isActive: true),
          _buildOrderList(_pastOrders, isActive: false),
        ],
      ),
    );
  }

  Widget _buildOrderList(List<Map<String, dynamic>> orders, {required bool isActive}) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? Icons.shopping_bag_outlined : Icons.history,
              size: 80,
              color: Colors.grey,
            ),
            const SizedBox(height: 16),
            Text(
              isActive ? 'لا توجد طلبات نشطة' : 'لا توجد طلبات سابقة',
              style: const TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) => _OrderCard(
        order: orders[index],
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => OrderTrackingScreen(orderId: orders[index]['id']),
          ),
        ),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Map<String, dynamic> order;
  final VoidCallback onTap;

  const _OrderCard({required this.order, required this.onTap});

  Color _getStatusColor(String status) {
    switch (status) {
      case 'DELIVERED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      case 'PREPARING':
        return Colors.orange;
      case 'OUT_FOR_DELIVERY':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'DELIVERED':
        return 'تم التوصيل';
      case 'CANCELLED':
        return 'ملغي';
      case 'PREPARING':
        return 'قيد التحضير';
      case 'OUT_FOR_DELIVERY':
        return 'في الطريق';
      case 'PENDING':
        return 'قيد الانتظار';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'طلب #${order['id']}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(order['status']).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _getStatusText(order['status']),
                      style: TextStyle(
                        color: _getStatusColor(order['status']),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.store, size: 16, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(order['store_name']),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(order['date']),
                ],
              ),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${order['items_count']} منتجات'),
                  Row(
                    children: [
                      if (order['status'] == 'DELIVERED')
                        TextButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ReviewScreen(
                                  orderId: order['id'],
                                  storeId: order['store_id'],
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.star, size: 16, color: Colors.amber),
                          label: const Text('قيم الطلب', style: TextStyle(color: Colors.amber)),
                        ),
                      const SizedBox(width: 8),
                      Text(
                        '${order['total_amount']} DZD',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: Colors.teal,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
