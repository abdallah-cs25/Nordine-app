import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/localization_service.dart';

class LanguagePickerWidget extends StatelessWidget {
  const LanguagePickerWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, langProvider, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                'Language / اللغة / Langue',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            _LanguageTile(
              flag: '🇩🇿',
              name: 'العربية',
              code: 'ar',
              isSelected: langProvider.locale.languageCode == 'ar',
              onTap: () => langProvider.setLocale('ar'),
            ),
            _LanguageTile(
              flag: '🇬🇧',
              name: 'English',
              code: 'en',
              isSelected: langProvider.locale.languageCode == 'en',
              onTap: () => langProvider.setLocale('en'),
            ),
            _LanguageTile(
              flag: '🇫🇷',
              name: 'Français',
              code: 'fr',
              isSelected: langProvider.locale.languageCode == 'fr',
              onTap: () => langProvider.setLocale('fr'),
            ),
          ],
        );
      },
    );
  }
}

class _LanguageTile extends StatelessWidget {
  final String flag;
  final String name;
  final String code;
  final bool isSelected;
  final VoidCallback onTap;

  const _LanguageTile({
    required this.flag,
    required this.name,
    required this.code,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Text(flag, style: const TextStyle(fontSize: 24)),
      title: Text(name),
      trailing: isSelected
          ? const Icon(Icons.check_circle, color: Colors.teal)
          : null,
      onTap: onTap,
      tileColor: isSelected ? Colors.teal.withOpacity(0.1) : null,
    );
  }
}
