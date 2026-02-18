import 'package:flutter/material.dart';

class ReviewWidget extends StatefulWidget {
  final int orderId;
  final String storeName;
  final String? driverName;
  final Function(int rating, String comment)? onSubmit;

  const ReviewWidget({
    super.key,
    required this.orderId,
    required this.storeName,
    this.driverName,
    this.onSubmit,
  });

  @override
  State<ReviewWidget> createState() => _ReviewWidgetState();
}

class _ReviewWidgetState extends State<ReviewWidget> {
  int _storeRating = 0;
  int _driverRating = 0;
  final _commentController = TextEditingController();
  bool _isSubmitting = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'قيّم طلبك / Rate Your Order',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Store rating
            Text('المتجر: ${widget.storeName}'),
            const SizedBox(height: 8),
            Row(
              children: List.generate(5, (index) {
                return IconButton(
                  icon: Icon(
                    index < _storeRating ? Icons.star : Icons.star_border,
                    color: Colors.amber,
                    size: 32,
                  ),
                  onPressed: () => setState(() => _storeRating = index + 1),
                );
              }),
            ),
            const SizedBox(height: 16),

            // Driver rating (if delivered by driver)
            if (widget.driverName != null) ...[
              Text('السائق: ${widget.driverName}'),
              const SizedBox(height: 8),
              Row(
                children: List.generate(5, (index) {
                  return IconButton(
                    icon: Icon(
                      index < _driverRating ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                      size: 32,
                    ),
                    onPressed: () => setState(() => _driverRating = index + 1),
                  );
                }),
              ),
              const SizedBox(height: 16),
            ],

            // Comment
            TextField(
              controller: _commentController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'اكتب تعليقك هنا... (اختياري)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),

            // Submit button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _storeRating == 0 || _isSubmitting ? null : _submitReview,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: _isSubmitting
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('إرسال التقييم', style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitReview() async {
    setState(() => _isSubmitting = true);
    
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    if (widget.onSubmit != null) {
      widget.onSubmit!(_storeRating, _commentController.text);
    }
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('شكراً لتقييمك! Thank you for your review!'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    }
  }
}

// Quick rating dialog
class QuickRatingDialog extends StatefulWidget {
  final String title;
  final Function(int rating) onRate;

  const QuickRatingDialog({super.key, required this.title, required this.onRate});

  @override
  State<QuickRatingDialog> createState() => _QuickRatingDialogState();
}

class _QuickRatingDialogState extends State<QuickRatingDialog> {
  int _rating = 0;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.title),
      content: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(5, (index) {
          return IconButton(
            icon: Icon(
              index < _rating ? Icons.star : Icons.star_border,
              color: Colors.amber,
              size: 40,
            ),
            onPressed: () => setState(() => _rating = index + 1),
          );
        }),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('إلغاء'),
        ),
        ElevatedButton(
          onPressed: _rating == 0 ? null : () {
            widget.onRate(_rating);
            Navigator.pop(context);
          },
          style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
          child: const Text('إرسال', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}
