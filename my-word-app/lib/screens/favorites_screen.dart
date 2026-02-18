import 'package:flutter/material.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _favoriteStores = [
    {'id': 1, 'name': 'Gym Power', 'category': 'Fitness', 'rating': 4.8},
    {'id': 3, 'name': 'Perfume Palace', 'category': 'Perfumes', 'rating': 4.9},
  ];

  final List<Map<String, dynamic>> _favoriteProducts = [
    {'id': 1, 'name': 'Whey Protein 2kg', 'price': 8500, 'store': 'Gym Power'},
    {'id': 4, 'name': 'Gym Membership', 'price': 5000, 'store': 'Gym Power'},
    {'id': 9, 'name': 'Oud Perfume', 'price': 12000, 'store': 'Perfume Palace'},
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('المفضلة / Favorites'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            Tab(text: 'متاجر (${_favoriteStores.length})'),
            Tab(text: 'منتجات (${_favoriteProducts.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildStoresList(),
          _buildProductsList(),
        ],
      ),
    );
  }

  Widget _buildStoresList() {
    if (_favoriteStores.isEmpty) {
      return _buildEmptyState('لا توجد متاجر مفضلة', Icons.store_outlined);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _favoriteStores.length,
      itemBuilder: (context, index) {
        final store = _favoriteStores[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.teal.withOpacity(0.1),
              child: const Icon(Icons.store, color: Colors.teal),
            ),
            title: Text(store['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(store['category']),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.star, color: Colors.amber, size: 18),
                Text(' ${store['rating']}'),
                IconButton(
                  icon: const Icon(Icons.favorite, color: Colors.red),
                  onPressed: () => _removeFromFavorites('store', index),
                ),
              ],
            ),
            onTap: () {
              // Navigate to store details
            },
          ),
        );
      },
    );
  }

  Widget _buildProductsList() {
    if (_favoriteProducts.isEmpty) {
      return _buildEmptyState('لا توجد منتجات مفضلة', Icons.shopping_bag_outlined);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _favoriteProducts.length,
      itemBuilder: (context, index) {
        final product = _favoriteProducts[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.image, color: Colors.grey),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(product['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text(product['store'], style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      Text('${product['price']} DZD', 
                        style: const TextStyle(color: Colors.teal, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                Column(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.favorite, color: Colors.red),
                      onPressed: () => _removeFromFavorites('product', index),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_shopping_cart, color: Colors.teal),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('تمت الإضافة للسلة!')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Colors.grey),
          const SizedBox(height: 16),
          Text(message, style: const TextStyle(fontSize: 16, color: Colors.grey)),
        ],
      ),
    );
  }

  void _removeFromFavorites(String type, int index) {
    setState(() {
      if (type == 'store') {
        _favoriteStores.removeAt(index);
      } else {
        _favoriteProducts.removeAt(index);
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('تمت الإزالة من المفضلة')),
    );
  }
}
