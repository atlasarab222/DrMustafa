import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../models/clinic_models.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Form controllers
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _messageController = TextEditingController();
  
  String _selectedType = 'appointment'; // appointment or inquiry
  String? _selectedCategory; // Treatment category
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  
  List<Category> _categories = [];
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    try {
      final cats = await SupabaseService.getCategories();
      setState(() {
        _categories = cats;
      });
    } catch (_) {}
  }

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 16, minute: 0),
    );
    if (picked != null) {
      setState(() => _selectedTime = picked);
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _submitting = true);

    final String preferredDateStr = _selectedDate != null 
        ? "${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}" 
        : '';
        
    final String preferredTimeStr = _selectedTime != null 
        ? "${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}" 
        : '';

    final appointment = Appointment(
      type: _selectedType,
      fullName: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      whatsapp: _phoneController.text.trim(),
      categoryId: _selectedCategory,
      subject: _selectedCategory != null 
          ? _categories.firstWhere((c) => c.id == _selectedCategory).titleAr 
          : 'استشارة عامة',
      message: _messageController.text.trim(),
      preferredDate: preferredDateStr.isNotEmpty ? preferredDateStr : null,
      preferredTime: preferredTimeStr.isNotEmpty ? preferredTimeStr : null,
      status: 'new',
    );

    final success = await SupabaseService.submitAppointment(appointment);

    setState(() => _submitting = false);

    if (success) {
      _nameController.clear();
      _phoneController.clear();
      _messageController.clear();
      setState(() {
        _selectedDate = null;
        _selectedTime = null;
        _selectedCategory = null;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تم إرسال طلبك بنجاح! سنتواصل معك قريباً لتأكيد الحجز.', textAlign: TextAlign.right),
          backgroundColor: Color(0xFF7A8F6A),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('حدث خطأ أثناء الإرسال. يرجى مراجعة الاتصال وإعادة المحاولة.', textAlign: TextAlign.right),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF7A8F6A);
    final accentColor = const Color(0xFFF3EFE9);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'طلب حجز واستشارة فورية',
          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Intro Card
            Container(
              decoration: BoxDecoration(
                color: accentColor,
                borderRadius: BorderRadius.circular(28),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'تواصل معنا مباشرة',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1B1C19)),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'احصل على خطتك العلاجية والاستشارة المخصصة مباشرة من الدكتور مصطفى الرفاعي. أرسل تفاصيل حالتك وسنقوم بالرد المباشر.',
                    textAlign: TextAlign.right,
                    textDirection: TextDirection.rtl,
                    style: TextStyle(fontSize: 11, height: 1.6, color: Color(0xFF5A5C54)),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      _buildQuickContactButton('اتصال مباشر', Icons.phone, () => _launchURL('tel:07508585140'), primaryColor),
                      const SizedBox(width: 12),
                      _buildQuickContactButton('واتساب', Icons.chat, () => _launchURL('https://wa.me/07508585140'), Colors.green),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Form container
            Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Request Type Selector Tabs
                  Row(
                    children: [
                      Expanded(
                        child: _buildTypeSelectorTab('استفسار عام', 'inquiry'),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildTypeSelectorTab('طلب حجز موعد', 'appointment'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Name Field
                  _buildLabel('الاسم الكامل للمريض'),
                  TextFormField(
                    controller: _nameController,
                    textAlign: TextAlign.right,
                    textDirection: TextDirection.rtl,
                    validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال الاسم' : null,
                    decoration: _buildInputDecoration('مثال: أحمد عبد الله'),
                  ),

                  const SizedBox(height: 20),

                  // Phone Field
                  _buildLabel('رقم الهاتف للتواصل'),
                  TextFormField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    textAlign: TextAlign.right,
                    validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال رقم الهاتف' : null,
                    decoration: _buildInputDecoration('مثال: 07508585140'),
                  ),

                  const SizedBox(height: 20),

                  // Treatment Field (Dropdown)
                  if (_categories.isNotEmpty) ...[
                    _buildLabel('القسم أو العلاج المطلوب'),
                    DropdownButtonFormField<String>(
                      value: _selectedCategory,
                      alignment: Alignment.centerRight,
                      onChanged: (val) => setState(() => _selectedCategory = val),
                      items: _categories.map((c) {
                        return DropdownMenuItem<String>(
                          value: c.id,
                          alignment: Alignment.centerRight,
                          child: Text(c.titleAr, textDirection: TextDirection.rtl),
                        );
                      }).toList(),
                      decoration: _buildInputDecoration('اختر القسم العلاجي'),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Date and Time selectors (Only shown for Appointments)
                  if (_selectedType == 'appointment') ...[
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              _buildLabel('الوقت المفضل'),
                              InkWell(
                                onTap: _selectTime,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, py: 14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.black.withOpacity(0.06)),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Icon(Icons.access_time, color: primaryColor, size: 18),
                                      Text(
                                        _selectedTime != null ? _selectedTime!.format(context) : 'اختر الوقت',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: _selectedTime != null ? FontWeight.bold : FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              _buildLabel('التاريخ المفضل'),
                              InkWell(
                                onTap: _selectDate,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, py: 14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.black.withOpacity(0.06)),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Icon(Icons.calendar_month, color: primaryColor, size: 18),
                                      Text(
                                        _selectedDate != null 
                                            ? "${_selectedDate!.year}/${_selectedDate!.month}/${_selectedDate!.day}" 
                                            : 'اختر التاريخ',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: _selectedDate != null ? FontWeight.bold : FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Message/Inquiry details Field
                  _buildLabel(_selectedType == 'appointment' ? 'ملاحظات إضافية / تفاصيل الحالة' : 'تفاصيل الاستفسار والرسالة'),
                  TextFormField(
                    controller: _messageController,
                    maxLines: 4,
                    textAlign: TextAlign.right,
                    textDirection: TextDirection.rtl,
                    decoration: _buildInputDecoration('اكتب هنا أي تفاصيل تود مشاركتها مع طبيبنا المباشر...'),
                  ),

                  const SizedBox(height: 32),

                  // Submit Button
                  ElevatedButton(
                    onPressed: _submitting ? null : _submitForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 2,
                    ),
                    child: _submitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text(
                            _selectedType == 'appointment' ? 'إرسال طلب موعد الحجز' : 'إرسال الاستفسار المباشر',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickContactButton(String label, IconData icon, VoidCallback onTap, Color color) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 14),
      label: Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.08),
        foregroundColor: color,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 16, py: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _buildTypeSelectorTab(String label, String value) {
    final isSelected = _selectedType == value;
    final primaryColor = const Color(0xFF7A8F6A);

    return InkWell(
      onTap: () => setState(() => _selectedType = value),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? primaryColor : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? primaryColor : Colors.black.withOpacity(0.06),
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF1B1C19),
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0, right: 4.0),
      child: Text(
        text,
        textAlign: TextAlign.right,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Color(0xFF5A5C54),
        ),
      ),
    );
  }

  InputDecoration _buildInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.grey, fontSize: 11),
      fillColor: Colors.white,
      filled: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, py: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.black.withOpacity(0.06)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: Colors.black.withOpacity(0.06)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFF7A8F6A), width: 1.5),
      ),
    );
  }
}
