import 'package:flutter/material.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  String _query = '';
  bool _isSearching = false;

  final List<String> _popularSearches = [
    'Protein', 'ملابس رياضية', 'عطور', 'Gym', 'Electronics'
  ];

  final List<String> _recentSearches = [
    'Whey Protein', 'Gym Power', 'عطر عود'
  ];

  List<Map<String, dynamic>> _results = [];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _performSearch(String query) {
    if (query.length < 2) {
      setState(() {
        _results = [];
        _isSearching = false;
      });
      return;
    }

    setState(() => _isSearching = true);

    // Simulate search
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          _isSearching = false;
          _results = [
            {'type': 'store', 'name': 'Gym Power', 'subtitle': 'Fitness & Equipment'},
            {'type': 'product', 'name': 'Whey Protein 2kg', 'subtitle': '8500 DZD'},
            {'type': 'product', 'name': 'Dumbbells Set', 'subtitle': '15000 DZD'},
            {'type': 'category', 'name': 'Gym Memberships', 'subtitle': '4 stores'},
          ].where((item) => 
            item['name'].toString().toLowerCase().contains(query.toLowerCase())
          ).toList();
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'ابحث عن متاجر أو منتجات...',
            border: InputBorder.none,
            suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    setState(() {
                      _query = '';
                      _results = [];
                    });
                  },
                )
              : null,
          ),
          onChanged: (value) {
            setState(() => _query = value);
            _performSearch(value);
          },
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _query.isEmpty ? _buildSuggestions() : _buildResults(),
    );
  }

  Widget _buildSuggestions() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Recent searches
          if (_recentSearches.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('البحث السابق', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                TextButton(
                  onPressed: () => setState(() => _recentSearches.clear()),
                  child: const Text('مسح الكل'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _recentSearches.map((search) => ActionChip(
                label: Text(search),
                avatar: const Icon(Icons.history, size: 16),
                onPressed: () {
                  _searchController.text = search;
                  setState(() => _query = search);
                  _performSearch(search);
                },
              )).toList(),
            ),
            const SizedBox(height: 24),
          ],

          // Popular searches
          const Text('الأكثر بحثاً', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _popularSearches.map((search) => ActionChip(
              label: Text(search),
              avatar: const Icon(Icons.trending_up, size: 16, color: Colors.orange),
              onPressed: () {
                _searchController.text = search;
                setState(() => _query = search);
                _performSearch(search);
              },
            )).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildResults() {
    if (_isSearching) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_results.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.search_off, size: 80, color: Colors.grey),
            const SizedBox(height: 16),
            Text('لا توجد نتائج لـ "$_query"', style: const TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _results.length,
      itemBuilder: (context, index) {
        final item = _results[index];
        IconData icon;
        Color iconColor;

        switch (item['type']) {
          case 'store':
            icon = Icons.store;
            iconColor = Colors.teal;
            break;
          case 'product':
            icon = Icons.shopping_bag;
            iconColor = Colors.blue;
            break;
          case 'category':
            icon = Icons.category;
            iconColor = Colors.orange;
            break;
          default:
            icon = Icons.search;
            iconColor = Colors.grey;
        }

        return ListTile(
          leading: CircleAvatar(
            backgroundColor: iconColor.withOpacity(0.1),
            child: Icon(icon, color: iconColor),
          ),
          title: Text(item['name']),
          subtitle: Text(item['subtitle']),
          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          onTap: () {
            // Navigate based on type
          },
        );
      },
    );
  }
}
