import 'package:flutter/material.dart';

void main() {
  runApp(const DriverApp());
}

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Algeria Driver',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.orange), // Different color for driver
        useMaterial3: true,
      ),
      locale: const Locale('ar'),
      home: const DriverHomePage(title: 'Driver Dashboard'),
    );
  }
}

class DriverHomePage extends StatefulWidget {
  const DriverHomePage({super.key, required this.title});
  final String title;

  @override
  State<DriverHomePage> createState() => _DriverHomePageState();
}

class _DriverHomePageState extends State<DriverHomePage> {
  bool isOnline = false;

  void _toggleStatus() {
    setState(() {
      isOnline = !isOnline;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              isOnline ? 'You are ONLINE' : 'You are OFFLINE',
              style: TextStyle(
                fontSize: 24,
                color: isOnline ? Colors.green : Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            SwitchListTile(
              title: const Text('Availability Status'),
              value: isOnline,
              onChanged: (bool value) {
                _toggleStatus();
              },
            ),
             const SizedBox(height: 40),
            ElevatedButton(
              onPressed: isOnline ? () {
                 // Check for new orders
              } : null,
              child: const Text('Check for Orders'),
            ),
          ],
        ),
      ),
    );
  }
}
