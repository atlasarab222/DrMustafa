class Category {
  final String id;
  final String? parentId;
  final String title;
  final String titleAr;
  final String description;
  final String descriptionAr;
  final String? icon;
  final String? image;
  final int sortOrder;
  final bool active;

  Category({
    required this.id,
    this.parentId,
    required this.title,
    required this.titleAr,
    required this.description,
    required this.descriptionAr,
    this.icon,
    this.image,
    required this.sortOrder,
    required this.active,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      parentId: json['parent_id'],
      title: json['title'] ?? '',
      titleAr: json['title_ar'] ?? '',
      description: json['description'] ?? '',
      descriptionAr: json['description_ar'] ?? '',
      icon: json['icon'],
      image: json['image'],
      sortOrder: json['sort_order'] ?? 1,
      active: json['active'] ?? true,
    );
  }
}

class GalleryItem {
  final String id;
  final String? categoryId;
  final String title;
  final String? description;
  final String mediaType; // 'image', 'video', 'before_after'
  final String fileUrl;
  final String? thumbnail;
  final String? beforeImage;
  final String? afterImage;
  final int sortOrder;
  final bool featured;
  final bool active;

  GalleryItem({
    required this.id,
    this.categoryId,
    required this.title,
    this.description,
    required this.mediaType,
    required this.fileUrl,
    this.thumbnail,
    this.beforeImage,
    this.afterImage,
    required this.sortOrder,
    required this.featured,
    required this.active,
  });

  factory GalleryItem.fromJson(Map<String, dynamic> json) {
    return GalleryItem(
      id: json['id'] ?? '',
      categoryId: json['category_id'],
      title: json['title'] ?? '',
      description: json['description'],
      mediaType: json['media_type'] ?? 'image',
      fileUrl: json['file_url'] ?? '',
      thumbnail: json['thumbnail'],
      beforeImage: json['before_image'],
      afterImage: json['after_image'],
      sortOrder: json['sort_order'] ?? 1,
      featured: json['featured'] ?? false,
      active: json['active'] ?? true,
    );
  }
}

class SettingItem {
  final String id;
  final String key;
  final String value;
  final String? description;

  SettingItem({
    required this.id,
    required this.key,
    required this.value,
    this.description,
  });

  factory SettingItem.fromJson(Map<String, dynamic> json) {
    return SettingItem(
      id: json['id'] ?? '',
      key: json['key'] ?? '',
      value: json['value'] ?? '',
      description: json['description'],
    );
  }
}

class ContentItem {
  final String id;
  final String key;
  final String title;
  final String type;
  final String value;
  final String category;
  final String language;
  final bool active;

  ContentItem({
    required this.id,
    required this.key,
    required this.title,
    required this.type,
    required this.value,
    required this.category,
    required this.language,
    required this.active,
  });

  factory ContentItem.fromJson(Map<String, dynamic> json) {
    return ContentItem(
      id: json['id'] ?? '',
      key: json['key'] ?? '',
      title: json['title'] ?? '',
      type: json['type'] ?? 'text',
      value: json['value'] ?? '',
      category: json['category'] ?? 'general',
      language: json['language'] ?? 'ar',
      active: json['active'] ?? true,
    );
  }
}

class Appointment {
  final String? id;
  final String type; // 'appointment', 'message', 'feedback'
  final String fullName;
  final String phone;
  final String? whatsapp;
  final int? age;
  final String? gender;
  final String? city;
  final String? categoryId;
  final String? subject;
  final String? message;
  final String? preferredDate;
  final String? preferredTime;
  final String status; // 'new', 'completed'
  final String? notes;

  Appointment({
    this.id,
    required this.type,
    required this.fullName,
    required this.phone,
    this.whatsapp,
    this.age,
    this.gender,
    this.city,
    this.categoryId,
    this.subject,
    this.message,
    this.preferredDate,
    this.preferredTime,
    required this.status,
    this.notes,
  });

  Map<String, dynamic> toJson() => {
    if (id != null) 'id': id,
    'type': type,
    'full_name': fullName,
    'phone': phone,
    if (whatsapp != null) 'whatsapp': whatsapp,
    if (age != null) 'age': age,
    if (gender != null) 'gender': gender,
    if (city != null) 'city': city,
    if (categoryId != null) 'category_id': categoryId,
    if (subject != null) 'subject': subject,
    if (message != null) 'message': message,
    if (preferredDate != null) 'preferred_date': preferredDate,
    if (preferredTime != null) 'preferred_time': preferredTime,
    'status': status,
    if (notes != null) 'notes': notes,
  };
}
