import 'package:flutter/material.dart';
import '../services/api_service.dart';

class OrderTrackingScreen extends StatefulWidget {
  final int orderId;

  const OrderTrackingScreen({super.key, required this.orderId});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> with TickerProviderStateMixin {
  Map<String, dynamic>? _order;
  bool _isLoading = true;
  late AnimationController _animationController;
  double _animationProgress = 0.0;

  final List<Map<String, dynamic>> _trackingSteps = [
    {'status': 'PENDING', 'title': 'تم استلام الطلب', 'titleEn': 'Order Received', 'icon': Icons.receipt},
    {'status': 'CONFIRMED', 'title': 'تم التأكيد', 'titleEn': 'Confirmed', 'icon': Icons.check_circle},
    {'status': 'PREPARING', 'title': 'قيد التحضير', 'titleEn': 'Preparing', 'icon': Icons.restaurant},
    {'status': 'READY_FOR_PICKUP', 'title': 'جاهز للاستلام', 'titleEn': 'Ready for Pickup', 'icon': Icons.inventory},
    {'status': 'OUT_FOR_DELIVERY', 'title': 'في الطريق', 'titleEn': 'Out for Delivery', 'icon': Icons.delivery_dining},
    {'status': 'DELIVERED', 'title': 'تم التوصيل', 'titleEn': 'Delivered', 'icon': Icons.done_all},
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..addListener(() {
      setState(() {
        _animationProgress = _animationController.value;
      });
    });
    _loadOrder();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadOrder() async {
    try {
      // Mock data for demo
      setState(() {
        _order = {
          'id': widget.orderId,
          'status': 'OUT_FOR_DELIVERY',
          'store_name': 'Gym Power',
          'total_amount': 12000,
          'driver_name': 'Omar Benali',
          'driver_phone': '+213555000004',
          'estimated_time': '15 دقيقة',
          'created_at': DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
        };
        _isLoading = false;
      });
      // Start animation if driver is on the way
      if (_order!['status'] == 'OUT_FOR_DELIVERY') {
        _animationController.repeat();
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  int _getCurrentStepIndex() {
    if (_order == null) return 0;
    final status = _order!['status'];
    return _trackingSteps.indexWhere((step) => step['status'] == status);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('تتبع الطلب #${widget.orderId}'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
        ? const Center(child: CircularProgressIndicator())
        : _order == null
          ? const Center(child: Text('Order not found'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Order info card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('طلب #${_order!['id']}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              Text('${_order!['total_amount']} DZD',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.teal)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('من: ${_order!['store_name']}'),
                          if (_order!['estimated_time'] != null)
                            Text('الوقت المتوقع: ${_order!['estimated_time']}',
                              style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Driver info (if assigned)
                  if (_order!['driver_name'] != null) ...[
                    Card(
                      color: Colors.orange.shade50,
                      child: ListTile(
                        leading: const CircleAvatar(
                          backgroundColor: Colors.orange,
                          child: Icon(Icons.delivery_dining, color: Colors.white),
                        ),
                        title: Text(_order!['driver_name']),
                        subtitle: Text(_order!['driver_phone']),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.phone, color: Colors.green),
                              onPressed: () {
                                // Call driver
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.message, color: Colors.blue),
                              onPressed: () {
                                // Message driver
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // LIVE MAP - Driver Location Tracking
                    Container(
                      height: 250,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Stack(
                          children: [
                            // Map Background (simulated - use google_maps_flutter in production)
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [Colors.green.shade100, Colors.blue.shade50],
                                ),
                              ),
                              child: CustomPaint(
                                painter: _MapGridPainter(),
                                size: const Size(double.infinity, 250),
                              ),
                            ),
                            // Driver marker (animated)
                            Positioned(
                              left: 100 + (_animationProgress * 150),
                              top: 150 - (_animationProgress * 80),
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Colors.orange,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.delivery_dining, color: Colors.white, size: 24),
                                  ),
                                  const Text('🚴 السائق', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            // Customer destination marker
                            Positioned(
                              right: 40,
                              top: 50,
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Colors.green,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.home, color: Colors.white, size: 24),
                                  ),
                                  const Text('📍 موقعك', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            // Store marker
                            Positioned(
                              left: 40,
                              bottom: 40,
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Colors.teal,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.store, color: Colors.white, size: 20),
                                  ),
                                  Text(_order!['store_name'], style: const TextStyle(fontSize: 9)),
                                ],
                              ),
                            ),
                            // Live indicator
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.red,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.circle, color: Colors.white, size: 8),
                                    SizedBox(width: 4),
                                    Text('LIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                            // ETA overlay
                            Positioned(
                              bottom: 8,
                              left: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4)],
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.timer, size: 16, color: Colors.orange),
                                    const SizedBox(width: 4),
                                    Text('${_order!['estimated_time']}', 
                                      style: const TextStyle(fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Tracking timeline
                  const Text('حالة الطلب', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  ..._buildTimeline(),
                ],
              ),
            ),
    );
  }

  List<Widget> _buildTimeline() {
    final currentIndex = _getCurrentStepIndex();
    
    return List.generate(_trackingSteps.length, (index) {
      final step = _trackingSteps[index];
      final isCompleted = index <= currentIndex;
      final isCurrent = index == currentIndex;
      
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline indicator
          Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isCompleted ? Colors.teal : Colors.grey.shade300,
                  border: isCurrent ? Border.all(color: Colors.orange, width: 3) : null,
                ),
                child: Icon(step['icon'], color: Colors.white, size: 20),
              ),
              if (index < _trackingSteps.length - 1)
                Container(
                  width: 2,
                  height: 40,
                  color: isCompleted ? Colors.teal : Colors.grey.shade300,
                ),
            ],
          ),
          const SizedBox(width: 16),
          // Step info
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    step['title'],
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                      color: isCompleted ? Colors.black : Colors.grey,
                    ),
                  ),
                  Text(
                    step['titleEn'],
                    style: TextStyle(
                      fontSize: 12,
                      color: isCompleted ? Colors.grey : Colors.grey.shade400,
                    ),
                  ),
                  if (isCurrent && step['status'] == 'OUT_FOR_DELIVERY')
                    const Padding(
                      padding: EdgeInsets.only(top: 8),
                      child: Text('🚴 السائق في الطريق إليك!',
                        style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                    ),
                ],
              ),
            ),
          ),
        ],
      );
    });
  }
}

// Custom painter for map grid background
class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey.withOpacity(0.2)
      ..strokeWidth = 1;

    // Draw horizontal lines
    for (double y = 0; y < size.height; y += 30) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }

    // Draw vertical lines
    for (double x = 0; x < size.width; x += 30) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }

    // Draw a curved path (simulating a road)
    final roadPaint = Paint()
      ..color = Colors.grey.withOpacity(0.4)
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(40, size.height - 40);
    path.quadraticBezierTo(
      size.width / 2, size.height / 2,
      size.width - 40, 50,
    );
    canvas.drawPath(path, roadPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

