export interface Category {
  id: string;
  parent_id?: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  icon?: string;
  image?: string;
  sort_order?: number;
  active?: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  category_id?: string;
  title?: string;
  description?: string;
  media_type: 'image' | 'video' | 'before_after';
  file_url: string;
  thumbnail?: string;
  before_image?: string;
  after_image?: string;
  sort_order?: number;
  featured?: boolean;
  active?: boolean;
  created_at?: string;
}

export interface ContentItem {
  id: string;
  key: string;
  title?: string;
  type?: string;
  value: string;
  category?: string;
  language?: string;
  active?: boolean;
}

export interface SettingItem {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface Appointment {
  id: string;
  type: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  age?: number;
  gender?: string;
  city?: string;
  service_id?: string;
  category_id?: string;
  subject?: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  status?: string;
  notes?: string;
  created_at?: string;
}

// Deprecated or legacy types for compatibility if needed elsewhere
export type CaseStudy = GalleryItem;
export type ContactInquiry = Appointment;
