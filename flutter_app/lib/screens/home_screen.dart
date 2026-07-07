import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../models/clinic_models.dart';
import 'package:url_launcher/url_launcher.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, String> _content = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    try {
      final items = await SupabaseService.getContent();
      final map = {for (var x in items) x.key: x.value};
      setState(() {
        _content = map;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  String _getVal(String key, String fallback) {
    return _content[key] ?? fallback;
  }

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF7A8F6A); // Soft Olive Green
    final accentColor = const Color(0xFFF3EFE9); // Elegant stone background
    
    return Scaffold(
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF7A8F6A)))
          : SafeArea(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Top Hero Banner
                    Container(
                      padding: const EdgeInsets.fromLTRB(24, 32, 24, 40),
                      decoration: BoxDecoration(
                        color: accentColor,
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(40),
                          bottomRight: Radius.circular(40),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, py: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: primaryColor.withOpacity(0.15)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.star, size: 14, color: primaryColor),
                                const SizedBox(width: 6),
                                Text(
                                  'مركز تجميل وزراعة الأسنان الرقمي',
                                  style: TextStyle(
                                    color: primaryColor,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _getVal('clinic_name', 'عيادات الدكتور مصطفى الرفاعي لطب الأسنان'),
                            textAlign: TextAlign.center,
                            textDirection: TextDirection.rtl,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              height: 1.4,
                              color: Color(0xFF1B1C19),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _getVal('home_description', 'نبتكر ابتسامات تليق بتميزك، تجربة علاجية نخبوية ترقى لتطلعاتك.'),
                            textAlign: TextAlign.center,
                            textDirection: TextDirection.rtl,
                            style: const TextStyle(
                              fontSize: 12,
                              height: 1.6,
                              color: Color(0xFF5A5C54),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Stats Dashboard Grid
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildStatCard('15+ سنة', 'خبرة سريرية متخصصة', Icons.badge_outlined),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildStatCard('100%', 'زراعة سويسرية معتمدة', Icons.verified_user_outlined),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Doctor Spotlight Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          border: Border.all(color: Colors.black.withOpacity(0.04)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.015),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            )
                          ],
                        ),
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              radius: 54,
                              backgroundColor: primaryColor.withOpacity(0.1),
                              child: const CircleAvatar(
                                radius: 50,
                                backgroundImage: NetworkImage('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400'),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _getVal('doctor_name', 'الدكتور مصطفى الرفاعي'),
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1B1C19),
                              ),
                            ),
                            Text(
                              _getVal('doctor_title', 'أخصائي زراعة وتجميل الأسنان'),
                              style: TextStyle(
                                fontSize: 11,
                                color: primaryColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            const Divider(height: 1, color: Color(0xFFF2EFE9)),
                            const SizedBox(height: 12),
                            Text(
                              _getVal('about_doctor', 'أخصائي رائد ومتميز في مجال زراعة وتصميم ابتسامة هوليوود الرقمية بأحدث التقنيات السويسرية الخالية من الألم والمثبتة علمياً.'),
                              textAlign: TextAlign.center,
                              textDirection: TextDirection.rtl,
                              style: const TextStyle(
                                fontSize: 11,
                                height: 1.7,
                                color: Color(0xFF5A5C54),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Quick Actions / CTA Button Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        children: [
                          ElevatedButton.icon(
                            onPressed: () => _launchURL('tel:07508585140'),
                            icon: const Icon(Icons.phone, size: 18),
                            label: const Text('اتصال مباشر للحجز الاستشاري'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryColor,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                              minimumSize: const Size.fromHeight(56),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                              elevation: 2,
                            ),
                          ),
                          const SizedBox(height: 12),
                          OutlinedButton.icon(
                            onPressed: () => _launchURL('https://wa.me/07508585140'),
                            icon: const Icon(Icons.chat, size: 18, color: Colors.green),
                            label: const Text('مراسلة مباشرة عبر واتساب العيادة'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF1B1C19),
                              side: BorderSide(color: Colors.black.withOpacity(0.1)),
                              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                              minimumSize: const Size.fromHeight(56),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 100), // Spacing for safe navigation padding
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatCard(String val, String title, IconData icon) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.black.withOpacity(0.03)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(icon, color: const Color(0xFF7A8F6A), size: 28),
          const SizedBox(height: 12),
          Text(
            val,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: Color(0xFF1B1C19),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            textAlign: TextAlign.center,
            textDirection: TextDirection.rtl,
            style: const TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: Color(0xFF8C8C8C),
            ),
          ),
        ],
      ),
    );
  }
}
