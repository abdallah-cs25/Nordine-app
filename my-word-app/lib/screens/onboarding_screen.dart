import 'package:flutter/material.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      icon: Icons.shopping_bag,
      titleAr: 'مرحباً بك في My Word',
      titleEn: 'Welcome to My Word',
      descriptionAr: 'تسوّق من أفضل المتاجر في الجزائر',
      descriptionEn: 'Shop from the best stores in Algeria',
      color: Colors.teal,
    ),
    OnboardingPage(
      icon: Icons.delivery_dining,
      titleAr: 'توصيل سريع',
      titleEn: 'Fast Delivery',
      descriptionAr: 'توصيل لباب بيتك في أسرع وقت',
      descriptionEn: 'Delivery to your door in no time',
      color: Colors.orange,
    ),
    OnboardingPage(
      icon: Icons.map,
      titleAr: 'اكتشف المتاجر القريبة',
      titleEn: 'Discover Nearby Stores',
      descriptionAr: 'استخدم الخريطة للعثور على أقرب المتاجر',
      descriptionEn: 'Use the map to find stores near you',
      color: Colors.blue,
    ),
    OnboardingPage(
      icon: Icons.payments,
      titleAr: 'الدفع عند الاستلام',
      titleEn: 'Cash on Delivery',
      descriptionAr: 'ادفع نقداً عند وصول طلبك',
      descriptionEn: 'Pay cash when your order arrives',
      color: Colors.green,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: _goToHome,
                child: const Text('تخطي / Skip'),
              ),
            ),

            // Pages
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) => setState(() => _currentPage = index),
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final page = _pages[index];
                  return Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 150,
                          height: 150,
                          decoration: BoxDecoration(
                            color: page.color.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(page.icon, size: 80, color: page.color),
                        ),
                        const SizedBox(height: 48),
                        Text(
                          page.titleAr,
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          page.titleEn,
                          style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        Text(
                          page.descriptionAr,
                          style: const TextStyle(fontSize: 16),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          page.descriptionEn,
                          style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Dots indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_pages.length, (index) {
                return Container(
                  width: _currentPage == index ? 24 : 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    color: _currentPage == index ? Colors.teal : Colors.grey[300],
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
            const SizedBox(height: 32),

            // Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _currentPage == _pages.length - 1 
                    ? _goToHome 
                    : () => _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text(
                    _currentPage == _pages.length - 1 ? 'ابدأ الآن / Start Now' : 'التالي / Next',
                    style: const TextStyle(color: Colors.white, fontSize: 18),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _goToHome() {
    Navigator.pushReplacementNamed(context, '/home');
  }
}

class OnboardingPage {
  final IconData icon;
  final String titleAr;
  final String titleEn;
  final String descriptionAr;
  final String descriptionEn;
  final Color color;

  OnboardingPage({
    required this.icon,
    required this.titleAr,
    required this.titleEn,
    required this.descriptionAr,
    required this.descriptionEn,
    required this.color,
  });
}
