export const flutterMainCode = `import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/home_screen.dart';
import 'screens/services_screen.dart';
import 'screens/results_screen.dart';
import 'screens/contact_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );

  runApp(const ZenithFloraApp());
}

class ZenithFloraApp extends StatelessWidget {
  const ZenithFloraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zenith Flora',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFFBF9F4),
        fontFamily: 'Cairo', // Botanical Sanctuary Font Cairo
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF52613E), // Olive Green
          primary: const Color(0xFF52613E),
          secondary: const Color(0xFF576341),
          surface: const Color(0xFFFBF9F4),
          onSurface: const Color(0xFF1B1C19),
        ),
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const HomeScreen(),
    const ServicesScreen(),
    const ResultsScreen(),
    const ContactScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(
          color: const Color(0xFFF5F3EE),
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: Colors.transparent,
            elevation: 0,
            type: BottomNavigationBarType.fixed,
            selectedItemColor: const Color(0xFF52613E),
            unselectedItemColor: const Color(0xFF45483F),
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
            unselectedLabelStyle: const TextStyle(fontSize: 10),
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.spa_outlined),
                activeIcon: Icon(Icons.spa),
                label: 'Services',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.auto_awesome_outlined),
                activeIcon: Icon(Icons.auto_awesome),
                label: 'Results',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.chat_bubble_outline),
                activeIcon: Icon(Icons.chat_bubble),
                label: 'Contact',
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;

export const flutterSupabaseService = `import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/clinic_models.dart';

class SupabaseService {
  static final _client = Supabase.instance.client;

  // Fetch Clinic Settings
  static Future<ClinicSettings> getClinicSettings() async {
    final response = await _client
        .from('clinic_settings')
        .select()
        .limit(1)
        .single();
    return ClinicSettings.fromJson(response);
  }

  // Update Clinic Settings (Admin)
  static Future<void> updateClinicSettings(ClinicSettings settings) async {
    await _client
        .from('clinic_settings')
        .update(settings.toJson())
        .eq('id', settings.id);
  }

  // Fetch Categories
  static Future<List<Category>> getCategories() async {
    final response = await _client.from('categories').select();
    return (response as List).map((x) => Category.fromJson(x)).toList();
  }

  // Fetch Sub-categories (Services)
  static Future<List<SubCategory>> getSubCategories() async {
    final response = await _client.from('sub_categories').select();
    return (response as List).map((x) => SubCategory.fromJson(x)).toList();
  }

  // Add Service (Admin with Media Saving)
  static Future<void> addSubCategory(SubCategory subCategory) async {
    await _client.from('sub_categories').insert(subCategory.toJson());
  }

  // Fetch Case Studies
  static Future<List<CaseStudy>> getCaseStudies() async {
    final response = await _client.from('cases').select();
    return (response as List).map((x) => CaseStudy.fromJson(x)).toList();
  }

  // Add Case Study (Before/After Media Link)
  static Future<void> addCaseStudy(CaseStudy caseStudy) async {
    await _client.from('cases').insert(caseStudy.toJson());
  }

  // Save Contact Inquiry
  static Future<void> saveContactInquiry(ContactInquiry inquiry) async {
    await _client.from('contact_inquiries').insert(inquiry.toJson());
  }

  // Media Management (Storage)
  static Future<String?> uploadMedia(String bucket, String path, dynamic file) async {
    try {
      await _client.storage.from(bucket).upload(path, file);
      return _client.storage.from(bucket).getPublicUrl(path);
    } catch (e) {
      return null;
    }
  }

  // Fetch Clinic Hours
  static Future<List<ClinicHours>> getClinicHours() async {
    final response = await _client.from('clinic_hours').select('id, day_of_week, opening_time, closing_time, is_closed').order('id');
    return (response as List).map((x) => ClinicHours.fromJson(x)).toList();
  }

  // Update Clinic Hours (Admin)
  static Future<void> updateClinicHours(List<ClinicHours> hoursList) async {
    for (var hours in hoursList) {
      await _client
          .from('clinic_hours')
          .update(hours.toJson())
          .eq('id', hours.id);
    }
  }
}`;

export const flutterModelsCode = `class ClinicSettings {
  final int id;
  final String clinicName;
  final String contactPhone;
  final String address;
  final String? whatsappLink;
  final String doctorName;
  final int yearsOfPractice;
  final String newSmilesCount;
  final String aboutBio;

  ClinicSettings({
    required this.id,
    required this.clinicName,
    required this.contactPhone,
    required this.address,
    this.whatsappLink,
    required this.doctorName,
    required this.yearsOfPractice,
    required this.newSmilesCount,
    required this.aboutBio,
  });

  factory ClinicSettings.fromJson(Map<String, dynamic> json) {
    return ClinicSettings(
      id: json['id'],
      clinicName: json['clinic_name'] ?? 'Zenith Flora',
      contactPhone: json['contact_phone'] ?? '',
      address: json['address'] ?? '',
      whatsappLink: json['whatsapp_link'],
      doctorName: json['doctor_name'] ?? '',
      yearsOfPractice: json['years_of_practice'] ?? 15,
      newSmilesCount: json['new_smiles_count'] ?? '5k+',
      aboutBio: json['about_bio'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'clinic_name': clinicName,
    'contact_phone': contactPhone,
    'address': address,
    'whatsapp_link': whatsappLink,
    'doctor_name': doctorName,
    'years_of_practice': yearsOfPractice,
    'new_smiles_count': newSmilesCount,
    'about_bio': aboutBio,
  };
}

class Category {
  final int id;
  final String name;
  final String? description;

  Category({required this.id, required this.name, this.description});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      description: json['description'],
    );
  }
}

class SubCategory {
  final int? id;
  final int categoryId;
  final String name;
  final String description;
  final String? imageUrl;

  SubCategory({
    this.id,
    required this.categoryId,
    required this.name,
    required this.description,
    this.imageUrl,
  });

  factory SubCategory.fromJson(Map<String, dynamic> json) {
    return SubCategory(
      id: json['id'],
      categoryId: json['category_id'],
      name: json['name'],
      description: json['description'] ?? '',
      imageUrl: json['image_url'],
    );
  }

  Map<String, dynamic> toJson() => {
    'category_id': categoryId,
    'name': name,
    'description': description,
    'image_url': imageUrl,
  };
}

class CaseStudy {
  final int? id;
  final String title;
  final String? subtitle;
  final int? categoryId;
  final String beforeImageUrl;
  final String afterImageUrl;

  CaseStudy({
    this.id,
    required this.title,
    this.subtitle,
    this.categoryId,
    required this.beforeImageUrl,
    required this.afterImageUrl,
  });

  factory CaseStudy.fromJson(Map<String, dynamic> json) {
    return CaseStudy(
      id: json['id'],
      title: json['title'],
      subtitle: json['subtitle'],
      categoryId: json['category_id'],
      beforeImageUrl: json['before_image_url'],
      afterImageUrl: json['after_image_url'],
    );
  }

  Map<String, dynamic> toJson() => {
    'title': title,
    'subtitle': subtitle,
    'category_id': categoryId,
    'before_image_url': beforeImageUrl,
    'after_image_url': afterImageUrl,
  };
}

class ContactInquiry {
  final int? id;
  final String fullName;
  final String phone;
  final String treatmentInterest;
  final String message;
  final String? status;

  ContactInquiry({
    this.id,
    required this.fullName,
    required this.phone,
    required this.treatmentInterest,
    required this.message,
    this.status,
  });

  Map<String, dynamic> toJson() => {
    'full_name': fullName,
    'phone': phone,
    'treatment_interest': treatmentInterest,
    'message': message,
  };
}

class ClinicHours {
  final int id;
  final String dayOfWeek;
  final String? openingTime;
  final String? closingTime;
  final bool isClosed;

  ClinicHours({
    required this.id,
    required this.dayOfWeek,
    this.openingTime,
    this.closingTime,
    required this.isClosed,
  });

  factory ClinicHours.fromJson(Map<String, dynamic> json) {
    return ClinicHours(
      id: json['id'],
      dayOfWeek: json['day_of_week'],
      openingTime: json['opening_time'],
      closingTime: json['closing_time'],
      isClosed: json['is_closed'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'opening_time': openingTime,
    'closing_time': closingTime,
    'is_closed': isClosed,
  };
}
`;

export const flutterStorageCode = `import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';

class StorageService {
  static final _storage = Supabase.instance.client.storage;

  /// Uploads an image to the 'media' bucket
  /// Returns the public URL of the uploaded image
  static Future<String?> uploadPatientImage(File file, String fileName) async {
    try {
      final String path = 'cases/\$fileName';
      
      // Upload to Supabase Storage bucket
      await _storage.from('media').upload(
        path,
        file,
        fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
      );

      // Retrieve Public URL to save into the Database table
      final String publicUrl = _storage.from('media').getPublicUrl(path);
      return publicUrl;
    } catch (e) {
      print('Error uploading to Supabase: \$e');
      return null;
    }
  }
}
`;

export const flutterResultsCode = `import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../models/clinic_models.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({super.key});

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  List<CaseStudy> _cases = [];
  bool _loading = true;
  String _selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final cases = await SupabaseService.getCaseStudies();
      setState(() {
        _cases = cases;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredCases = _selectedFilter == 'All'
        ? _cases
        : _cases.where((c) => c.title.toLowerCase().contains(_selectedFilter.toLowerCase())).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Beautiful Results', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF52613E)))
          : Column(
              children: [
                _buildFilterRow(),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    itemCount: filteredCases.length,
                    itemBuilder: (context, index) {
                      return CaseStudyCard(caseStudy: filteredCases[index]);
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildFilterRow() {
    final filters = ['All', 'Veneers', 'Whitening', 'Implants'];
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: filters.length,
        itemBuilder: (context, index) {
          final filter = filters[index];
          final isSelected = _selectedFilter == filter;
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: FilterChip(
              label: Text(filter),
              selected: isSelected,
              onSelected: (selected) {
                setState(() => _selectedFilter = filter);
              },
              selectedColor: const Color(0xFF52613E),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF1B1C19),
                fontWeight: FontWeight.bold,
              ),
              backgroundColor: const Color(0xFFF5F3EE),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
          );
        },
      ),
    );
  }
}

class CaseStudyCard extends StatefulWidget {
  final CaseStudy caseStudy;
  const CaseStudyCard({super.key, required this.caseStudy});

  @override
  State<CaseStudyCard> createState() => _CaseStudyCardState();
}

class _CaseStudyCardState extends State<CaseStudyCard> {
  double _sliderValue = 0.5;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3EE),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.black.withOpacity(0.05)),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Dynamic Interactive Image Slider in Flutter
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: AspectRatio(
              aspectRatio: 1.0,
              child: Stack(
                children: [
                  // After Image (Base)
                  Positioned.fill(
                    child: Image.network(
                      widget.caseStudy.afterImageUrl,
                      fit: BoxFit.cover,
                    ),
                  ),
                  // Before Image (Clipped on top)
                  Positioned.fill(
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: FractionallySizedBox(
                        widthFactor: _sliderValue,
                        heightFactor: 1.0,
                        child: Image.network(
                          widget.caseStudy.beforeImageUrl,
                          fit: BoxFit.cover,
                          alignment: Alignment.centerLeft,
                        ),
                      ),
                    ),
                  ),
                  // Before Label
                  Positioned(
                    bottom: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, py: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('Before', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  // After Label
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, py: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('After', style: TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  // Draggable Area Overlay
                  Positioned.fill(
                    child: GestureDetector(
                      onHorizontalDragUpdate: (details) {
                        final RenderBox box = context.findRenderObject() as RenderBox;
                        final localOffset = box.globalToLocal(details.globalPosition);
                        setState(() {
                          _sliderValue = (localOffset.dx / box.size.width).clamp(0.0, 1.0);
                        });
                      },
                    ),
                  ),
                  // Slider vertical line indicator
                  Align(
                    alignment: Alignment(_sliderValue * 2 - 1, 0),
                    child: Container(
                      width: 3,
                      color: Colors.white.withOpacity(0.7),
                      child: Center(
                        child: Container(
                          width: 24,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))
                            ],
                          ),
                          child: const Icon(Icons.swap_horiz, size: 16, color: Color(0xFF52613E)),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.caseStudy.title,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.caseStudy.subtitle ?? '',
                        style: const TextStyle(color: Color(0xFF45483F), fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, py: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFD7E9BD),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Text('Veneers', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF121F04))),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
`;

export const flutterPubspecCode = `name: zenith_flora_dental
description: A high-end botanical sanctuary dental clinic application.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Supabase database and authentication client
  supabase_flutter: ^2.6.0
  
  # Fluent icons and design assets
  lucide_icons: ^3.0.1
  
  # Font style helper
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # For easily packaging our custom generated app icon
  flutter_launcher_icons: ^0.13.1

# Configure launcher icons
flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icon/app_icon.png"
  adaptive_icon_background: "#FBF9F4"
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"

flutter:
  uses-material-design: true
  assets:
    - assets/icon/
    - assets/images/
`;
