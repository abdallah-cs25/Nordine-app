import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'services/localization_service.dart';
import 'services/api_service.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/driver_dashboard_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => LanguageProvider(),
      child: const MyWordApp(),
    ),
  );
}

class MyWordApp extends StatelessWidget {
  const MyWordApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, langProvider, child) {
        return MaterialApp(
          title: 'My Word',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
            useMaterial3: true,
            fontFamily: langProvider.isRtl ? 'Cairo' : null,
          ),
          locale: langProvider.locale,
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          initialRoute: '/',
          routes: {
            '/': (context) => const SplashScreen(),
            '/login': (context) => const LoginScreen(),
            '/register': (context) => const RegisterScreen(),
            '/home': (context) => const MainScreen(),
            '/driver': (context) => const DriverDashboardScreen(),
          },
        );
      },
    );
  }
}

// Splash Screen
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.teal,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.shopping_bag, size: 100, color: Colors.white),
            const SizedBox(height: 20),
            const Text(
              'My Word',
              style: TextStyle(
                fontSize: 42,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Marketplace for Algeria',
              style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.8)),
            ),
            const SizedBox(height: 40),
            const CircularProgressIndicator(color: Colors.white),
          ],
        ),
      ),
    );
  }
}

// Main Screen with Bottom Navigation
class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const StoresScreen(),
    const MapScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isRtl = context.watch<LanguageProvider>().isRtl;
    
    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        body: _screens[_currentIndex],
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.teal,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'الرئيسية'),
            BottomNavigationBarItem(icon: Icon(Icons.store), label: 'المتاجر'),
            BottomNavigationBarItem(icon: Icon(Icons.map), label: 'الخريطة'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'الحساب'),
          ],
        ),
      ),
    );
  }
}

// Home Screen - Professional & Modern
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _categories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final categories = await ApiService.getCategories();
      setState(() {
        _categories = categories is List ? categories : [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'My Word',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.0),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none)),
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CartScreen()),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Featured Offers Carousel
              SizedBox(
                height: 200,
                child: PageView(
                  padEnds: false,
                  controller: PageController(viewportFraction: 0.9),
                  children: [
                    _OfferCard(
                      color: Colors.teal, 
                      title: 'Welcome Offer', 
                      subtitle: '50% OFF First Order', 
                      icon: Icons.local_offer
                    ),
                    _OfferCard(
                      color: Colors.indigo, 
                      title: 'Gym Special', 
                      subtitle: 'Free Protein Shaker', 
                      icon: Icons.fitness_center
                    ),
                    _OfferCard(
                      color: Colors.orange, 
                      title: 'Fast Delivery', 
                      subtitle: 'Free Delivery Today', 
                      icon: Icons.delivery_dining
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 2. Delivery Services Highlight
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Text('خدمات التوصيل / Delivery', 
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    TextButton(
                      onPressed: () {}, // Navigate to delivery info
                      child: const Text('INFO', style: TextStyle(color: Colors.teal)),
                    ),
                  ],
                ),
              ),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _DeliveryFeature(icon: Icons.timer, label: 'Fast\nRunning'),
                    _DeliveryFeature(icon: Icons.security, label: 'Secure\nHandling'),
                    _DeliveryFeature(icon: Icons.map, label: 'Live\nTracking'),
                    _DeliveryFeature(icon: Icons.support_agent, label: '24/7\nSupport'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 3. Categories & Stores
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Text('الأقسام / Categories',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    TextButton(
                      onPressed: () {}, 
                      child: const Text('VIEW ALL', style: TextStyle(color: Colors.teal)),
                    ),
                  ],
                ),
              ),
              
              _isLoading
                ? const Center(child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(),
                  ))
                : GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 1.1,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final cat = _categories[index];
                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 5),
                          ],
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(16),
                          onTap: () {
                             // Navigate to specific category stores
                             Navigator.push(context, MaterialPageRoute(builder: (_) => const StoresScreen()));
                          },
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.teal.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.category, size: 32, color: Colors.teal),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                cat['name'] ?? 'Category',
                                style: const TextStyle(fontWeight: FontWeight.w600),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _OfferCard extends StatelessWidget {
  final Color color;
  final String title;
  final String subtitle;
  final IconData icon;

  const _OfferCard({required this.color, required this.title, required this.subtitle, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 12, top: 12, bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: color.withOpacity(0.4), blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(8)),
                  child: const Text('SPECIAL OFFER', style: TextStyle(color: Colors.white, fontSize: 10)),
                ),
                const SizedBox(height: 8),
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 14)),
              ],
            ),
          ),
          Icon(icon, color: Colors.white.withOpacity(0.9), size: 60),
        ],
      ),
    );
  }
}

class _DeliveryFeature extends StatelessWidget {
  final IconData icon;
  final String label;

  const _DeliveryFeature({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: Colors.teal, size: 28),
        const SizedBox(height: 8),
        Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 10, color: Colors.grey, height: 1.2)),
      ],
    );
  }
}

// Stores Screen with API
class StoresScreen extends StatefulWidget {
  const StoresScreen({super.key});

  @override
  State<StoresScreen> createState() => _StoresScreenState();
}

class _StoresScreenState extends State<StoresScreen> {
  List<dynamic> _stores = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStores();
  }

  Future<void> _loadStores() async {
    setState(() => _isLoading = true);
    try {
      final stores = await ApiService.getStores();
      setState(() {
        _stores = stores is List ? stores : [];
        _isLoading = false;
      });
    } catch (e) {
      // Use mock data if API fails
      setState(() {
        _stores = [
          {'id': 1, 'name': 'Gym Power', 'description': 'Fitness Equipment & Supplements', 'rating': 4.8},
          {'id': 2, 'name': 'Fashion Hub', 'description': 'Latest Fashion Trends', 'rating': 4.5},
          {'id': 3, 'name': 'Perfume Palace', 'description': 'Premium Fragrances', 'rating': 4.9},
          {'id': 4, 'name': 'Tech World', 'description': 'Electronics & Gadgets', 'rating': 4.3},
        ];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('المتاجر / Stores'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _loadStores,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _stores.length,
              itemBuilder: (context, index) {
                final store = _stores[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.teal.withOpacity(0.1),
                      child: const Icon(Icons.store, color: Colors.teal),
                    ),
                    title: Text(store['name'] ?? 'Store', 
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(store['description'] ?? ''),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 18),
                        Text(' ${store['rating'] ?? 4.5}'),
                      ],
                    ),
                    onTap: () {
                       // Pass specializations (mock for now if not in API)
                       var storeWithSpecs = Map<String, dynamic>.from(store);
                       if (storeWithSpecs['specializations'] == null) {
                         // Default mock specs based on name for demo
                         if (store['name'].toString().contains('Gym')) storeWithSpecs['specializations'] = ['Supplements', 'Equipment'];
                         else if (store['name'].toString().contains('Fashion')) storeWithSpecs['specializations'] = ['Men', 'Women', 'Kids'];
                         else if (store['name'].toString().contains('Perfume')) storeWithSpecs['specializations'] = ['Men', 'Women', 'Oriental'];
                         else storeWithSpecs['specializations'] = ['General', 'Official'];
                       }
                       Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => StoreDetailsScreen(store: storeWithSpecs)),
                      );
                    },
                  ),
                );
              },
            ),
          ),
    );
  }
}

// Store Details Screen
class StoreDetailsScreen extends StatelessWidget {
  final Map<String, dynamic> store;

  const StoreDetailsScreen({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    final products = [
      {
        'name': 'Sports T-Shirt',
        'price': 2500,
        'description': 'Breathable running shirt',
        'attributes': {'Size': 'L', 'Gender': 'Men', 'Color': 'Blue'}
      },
      // ... (other products)
    ];

    // Safe cast for specializations
    final List<String> specs = store['specializations'] is List 
        ? List<String>.from(store['specializations']) 
        : [];

    return Scaffold(
      appBar: AppBar(
        title: Text(store['name'] ?? 'Store'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Store Info Header with Specializations
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(radius: 24, backgroundColor: Colors.teal, child: Icon(Icons.store, color: Colors.white)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(store['name'] ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                          Text(store['description'] ?? '', style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                if (specs.isNotEmpty)
                  Wrap(
                    spacing: 8,
                    children: specs.map((spec) => Chip(
                      label: Text(spec),
                      backgroundColor: Colors.teal.withOpacity(0.1),
                      labelStyle: const TextStyle(color: Colors.teal, fontSize: 12),
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      padding: EdgeInsets.zero,
                    )).toList(),
                  ),
              ],
            ),
          ),
          const Divider(height: 1),
          
          // Products List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: products.length, // In real app, filter by store_id
              itemBuilder: (context, index) {
          final product = products[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.image, size: 40, color: Colors.grey),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(product['name'] as String, 
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text(product['description'] as String,
                          style: const TextStyle(color: Colors.grey)),
                        const SizedBox(height: 4),
                        Text('${product['price']} DZD',
                          style: const TextStyle(color: Colors.teal, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        // Display attributes as chips
                        if (product['attributes'] != null)
                          Wrap(
                            spacing: 4,
                            runSpacing: 0,
                            children: (product['attributes'] as Map<String, dynamic>).entries.map((e) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.grey[100],
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: Colors.grey[300]!),
                                ),
                                child: Text('${e.key}: ${e.value}', style: const TextStyle(fontSize: 10)),
                              );
                            }).toList(),
                          ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('تمت الإضافة للسلة!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
                    child: const Text('إضافة', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Cart Screen
class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('السلة / Cart'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey),
            SizedBox(height: 16),
            Text('سلتك فارغة', style: TextStyle(fontSize: 18, color: Colors.grey)),
            Text('Your cart is empty', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// Map Screen
class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الخريطة / Map'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          Container(
            color: Colors.grey[200],
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, size: 100, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('Algeria Map Integration'),
                  Text('Interactive Store Locator'),
                ],
              ),
            ),
          ),
          // Interactive Store Pins
          Positioned(
            left: 50, top: 100,
            child: _MapPin(
              label: 'Gym Power', 
              onTap: () => _navigateToStore(context, 1, 'Gym Power')
            ),
          ),
          Positioned(
            right: 80, top: 200,
            child: _MapPin(
              label: 'Fashion Hub',
              onTap: () => _navigateToStore(context, 2, 'Fashion Hub')
            ),
          ),
          Positioned(
            left: 120, bottom: 200,
            child: _MapPin(
              label: 'Perfume Palace',
              onTap: () => _navigateToStore(context, 3, 'Perfume Palace')
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToStore(BuildContext context, int id, String name) {
    // Mock store data for navigation
    final mockStore = {'id': id, 'name': name, 'description': 'Best in Algiers', 'rating': 4.8};
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => StoreDetailsScreen(store: mockStore)),
    );
  }
}

class _MapPin extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;

  const _MapPin({required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [const BoxShadow(color: Colors.black26, blurRadius: 4)],
            ),
            child: Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
          ),
          const Icon(Icons.location_pin, color: Colors.red, size: 40),
        ],
      ),
    );
  }
}

// Profile Screen
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isDriverMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الحساب / Profile'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Profile Header
          Container(
            padding: const EdgeInsets.all(24),
            color: Colors.teal.withOpacity(0.1),
            child: const Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.teal,
                  child: Icon(Icons.person, size: 50, color: Colors.white),
                ),
                SizedBox(height: 12),
                Text('المستخدم / User', 
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                Text('user@example.com', style: TextStyle(color: Colors.grey)),
                SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.phone, size: 16, color: Colors.grey),
                    SizedBox(width: 4),
                    Text('+213 555 123 456', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          ),

          // Driver Mode Toggle
          SwitchListTile(
            title: const Text('وضع السائق / Driver Mode'),
            subtitle: const Text('تفعيل استلام الطلبات'),
            value: _isDriverMode,
            onChanged: (val) {
              setState(() => _isDriverMode = val);
              if (val) {
                Navigator.pushNamed(context, '/driver');
              }
            },
            secondary: Icon(
              Icons.delivery_dining,
              color: _isDriverMode ? Colors.orange : Colors.grey,
            ),
          ),
          const Divider(),

          // Menu Items
          ListTile(
            leading: const Icon(Icons.history),
            title: const Text('سجل الطلبات / Order History'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.favorite),
            title: const Text('المفضلة / Favorites'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.location_on),
            title: const Text('العناوين / Addresses'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('اللغة / Language'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              showModalBottomSheet(
                context: context,
                builder: (_) => const LanguagePickerSheet(),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.help),
            title: const Text('الدعم / Support'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('تسجيل الخروج / Logout', 
              style: TextStyle(color: Colors.red)),
            onTap: () => Navigator.pushReplacementNamed(context, '/login'),
          ),
        ],
      ),
    );
  }
}

// Language Picker Sheet
class LanguagePickerSheet extends StatelessWidget {
  const LanguagePickerSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, langProvider, _) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('اختر اللغة / Select Language',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            ListTile(
              leading: const Text('🇩🇿', style: TextStyle(fontSize: 24)),
              title: const Text('العربية'),
              trailing: langProvider.locale.languageCode == 'ar' 
                ? const Icon(Icons.check, color: Colors.teal) : null,
              onTap: () {
                langProvider.setLocale('ar');
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Text('🇬🇧', style: TextStyle(fontSize: 24)),
              title: const Text('English'),
              trailing: langProvider.locale.languageCode == 'en'
                ? const Icon(Icons.check, color: Colors.teal) : null,
              onTap: () {
                langProvider.setLocale('en');
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Text('🇫🇷', style: TextStyle(fontSize: 24)),
              title: const Text('Français'),
              trailing: langProvider.locale.languageCode == 'fr'
                ? const Icon(Icons.check, color: Colors.teal) : null,
              onTap: () {
                langProvider.setLocale('fr');
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 16),
          ],
        );
      },
    );
  }
}
