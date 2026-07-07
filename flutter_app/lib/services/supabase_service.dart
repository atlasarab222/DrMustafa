import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/clinic_models.dart';

class SupabaseService {
  static final _supabase = Supabase.instance.client;

  static bool get isInitialized {
    try {
      // Accessing supabase instance to verify if initialized
      Supabase.instance.client;
      return true;
    } catch (_) {
      return false;
    }
  }

  // Fetch Categories/Services
  static Future<List<Category>> getCategories() async {
    if (!isInitialized) return _getMockCategories();
    try {
      final response = await _supabase
          .from('categories')
          .select()
          .order('sort_order', ascending: true);
      return (response as List).map((x) => Category.fromJson(x)).toList();
    } catch (e) {
      return _getMockCategories();
    }
  }

  // Fetch Gallery Items / Before-After Cases
  static Future<List<GalleryItem>> getGalleryItems() async {
    if (!isInitialized) return _getMockGalleryItems();
    try {
      final response = await _supabase
          .from('gallery')
          .select()
          .order('sort_order', ascending: true);
      return (response as List).map((x) => GalleryItem.fromJson(x)).toList();
    } catch (e) {
      return _getMockGalleryItems();
    }
  }

  // Fetch Settings
  static Future<List<SettingItem>> getSettings() async {
    if (!isInitialized) return _getMockSettings();
    try {
      final response = await _supabase.from('settings').select();
      return (response as List).map((x) => SettingItem.fromJson(x)).toList();
    } catch (e) {
      return _getMockSettings();
    }
  }

  // Fetch Content Key-Values
  static Future<List<ContentItem>> getContent() async {
    if (!isInitialized) return _getMockContent();
    try {
      final response = await _supabase.from('content').select();
      return (response as List).map((x) => ContentItem.fromJson(x)).toList();
    } catch (e) {
      return _getMockContent();
    }
  }

  // Submit Appointment Inquiry
  static Future<bool> submitAppointment(Appointment appointment) async {
    if (!isInitialized) {
      // Simulate successful local submission
      await Future.delayed(const Duration(seconds: 1));
      return true;
    }
    try {
      await _supabase.from('appointments').insert(appointment.toJson());
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- MOCK DATA FALLBACKS ---
  static List<Category> _getMockCategories() {
    return [
      Category(
        id: 'c1',
        title: 'Dental Implants',
        titleAr: 'زراعة الأسنان',
        description: 'Permanent solutions for missing teeth with Swiss systems.',
        descriptionAr: 'استعد ثقتك بابتسامتك مع زراعة الأسنان السويسرية والألمانية الفورية ثلاثية الأبعاد، حلول دائمة لتعويض الأسنان المفقودة بمظهر طبيعي.',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800',
        sortOrder: 1,
        active: true,
      ),
      Category(
        id: 'c2',
        title: 'Smile Design',
        titleAr: 'تصميم الابتسامة',
        description: 'Perfect custom digital smiles tailored to your facial aesthetics.',
        descriptionAr: 'ابتكر ابتسامة هوليوود المتكاملة والرقمية التي تليق بتميزك، مصممة خصيصاً لتتناسب بشكل مثالي مع ملامح وجهك.',
        image: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?q=80&w=800',
        sortOrder: 2,
        active: true,
      ),
      Category(
        id: 'c3',
        title: 'Teeth Whitening',
        titleAr: 'تبييض الأسنان',
        description: 'Professional whitening sessions using FLASH and laser.',
        descriptionAr: 'جلسات تبييض احترافية متطورة باستخدام تقنية الفلاش والليزر الآمن لطبقة المينا، تعيد لأسنانك بياضها الطبيعي الناصع.',
        image: 'https://images.unsplash.com/photo-1598256989800-fea5f95ac909?q=80&w=800',
        sortOrder: 3,
        active: true,
      ),
      Category(
        id: 'c4',
        title: 'Cosmetic Dentistry',
        titleAr: 'تجميل الأسنان',
        description: 'Artistic dental enhancements, gum contouring and fillings.',
        descriptionAr: 'نجمع بين العلم والفن لإبراز جمال ابتسامتك الطبيعية من خلال الحشوات التجميلية المتطورة، وإعادة تشكيل اللثة بالليزر والترميمات الخزفية.',
        image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=800',
        sortOrder: 4,
        active: true,
      ),
    ];
  }

  static List<GalleryItem> _getMockGalleryItems() {
    return [
      GalleryItem(
        id: 'a1',
        title: 'ابتسامة هوليوود المتكاملة',
        description: 'حالة تجميل كاملة باستخدام عدسات الفينير الخزفية فائقة الرقة.',
        mediaType: 'before_after',
        fileUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1000',
        beforeImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1000',
        afterImage: 'https://images.unsplash.com/photo-1606811841660-1b5168c8139d?q=80&w=1000',
        sortOrder: 1,
        featured: true,
        active: true,
      ),
      GalleryItem(
        id: 'a2',
        title: 'زراعة فورية للأسنان الأمامية',
        description: 'تعويض الأسنان الأمامية المفقودة بزراعة سويسرية فورية.',
        mediaType: 'before_after',
        fileUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000',
        beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000',
        afterImage: 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?q=80&w=1000',
        sortOrder: 2,
        featured: true,
        active: true,
      ),
    ];
  }

  static List<SettingItem> _getMockSettings() {
    return [
      SettingItem(id: '1', key: 'primary_color', value: '#7A8F6A'),
      SettingItem(id: '2', key: 'secondary_color', value: '#A5B58D'),
      SettingItem(id: '3', key: 'accent_color', value: '#E8E2D6'),
      SettingItem(id: '4', key: 'phone', value: '07508585140'),
      SettingItem(id: '5', key: 'whatsapp', value: '07508585140'),
    ];
  }

  static List<ContentItem> _getMockContent() {
    return [
      ContentItem(id: '1', key: 'clinic_name', title: 'اسم العيادة', type: 'text', value: 'عيادات الدكتور مصطفى الرفاعي لطب الأسنان', category: 'general', language: 'ar', active: true),
      ContentItem(id: '2', key: 'doctor_name', title: 'اسم الطبيب', type: 'text', value: 'الدكتور مصطفى الرفاعي', category: 'general', language: 'ar', active: true),
      ContentItem(id: '3', key: 'doctor_title', title: 'لقب الطبيب', type: 'text', value: 'أخصائي زراعة وتجميل الأسنان', category: 'general', language: 'ar', active: true),
      ContentItem(id: '4', key: 'home_title', title: 'عنوان البداية', type: 'text', value: 'نبتكر ابتسامات تليق بتميزك', category: 'home', language: 'ar', active: true),
      ContentItem(id: '5', key: 'home_description', title: 'وصف البداية', type: 'html', value: 'مرحباً بكم في عيادتنا المتقدمة لطب وتجميل الأسنان، حيث يلتقي الفن مع العلم لتقديم تجربة استثنائية ونخبوية في رعاية ابتسامتك.', category: 'home', language: 'ar', active: true),
      ContentItem(id: '6', key: 'about_doctor', title: 'حول الطبيب', type: 'html', value: 'الدكتور مصطفى الرفاعي هو أخصائي رائد في زراعة وتجميل الأسنان، يمتلك خبرة سريرية تمتد لأكثر من 15 عاماً في تصميم الابتسامات الرقمية المتكاملة وزراعة الأسنان الفورية بأحدث الأنظمة السويسرية المعتمدة عالمياً.', category: 'about', language: 'ar', active: true),
    ];
  }
}
