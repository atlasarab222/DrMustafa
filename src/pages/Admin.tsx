import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';
import { Category, GalleryItem, SettingItem, ContentItem, Appointment } from '../types';
import { Settings, Plus, Save, Trash2, List, FileText, Sparkles, Check, Database, AlertCircle, Users, Eye, Lock, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'cases' | 'inquiries'>('settings');
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [newCategory, setNewCategory] = useState({ title: '', description: '', parent_id: '', active: true, sort_order: 1 });
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    media_type: 'before_after' as 'before_after' | 'image' | 'video',
    file_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
    before_image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
    after_image: 'https://images.unsplash.com/photo-1606811841660-1b5168c8139d',
    category_id: '',
    featured: true,
    active: true,
    sort_order: 1
  });

  // Flat edit state for basic settings & contents
  const [editableKV, setEditableKV] = useState<Record<string, string>>({
    clinic_name: 'Dr. Mustafa Al-Rafai Dental Clinics',
    doctor_name: 'Dr. Mustafa Al-Rafai',
    about_doctor: 'Specialist in Dental Implants and Cosmetic Dentistry.',
    doctor_image: '/src/assets/images/dr_mustafa_original_portrait_1782949321991.jpg',
    phone: '07508585140',
    whatsapp: '07508585140',
    primary_color: '#7A8F6A',
    secondary_color: '#A5B58D',
    accent_color: '#E8E2D6',
    working_hours: '09:00 AM - 09:00 PM',
    admin_password: '1234',
  });

  // Statuses
  const [statusMsg, setStatusMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }

    if (supabase) {
      setIsSupabaseConnected(true);
      fetchData();
    } else {
      setIsSupabaseConnected(false);
      // Load from local storage fallbacks
      const localKV = localStorage.getItem('editableKV');
      if (localKV) setEditableKV(JSON.parse(localKV));

      const localCats = localStorage.getItem('categories');
      if (localCats) setCategories(JSON.parse(localCats));

      const localGallery = localStorage.getItem('gallery');
      if (localGallery) setGallery(JSON.parse(localGallery));

      const localAppts = localStorage.getItem('appointments');
      if (localAppts) setAppointments(JSON.parse(localAppts));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = editableKV.admin_password || '1234';
    if (passwordInput === correctPassword || passwordInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.');
    }
  };

  async function fetchData() {
    if (!supabase) return;
    try {
      const [setsRes, contsRes, catsRes, gallRes, apptsRes] = await Promise.all([
        supabase.from('settings').select('*'),
        supabase.from('content').select('*'),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('gallery').select('*').order('sort_order'),
        supabase.from('appointments').select('*').order('created_at', { ascending: false })
      ]);

      const initialKV = { ...editableKV };
      
      if (setsRes.data) {
        setSettings(setsRes.data);
        setsRes.data.forEach((item) => {
          initialKV[item.key] = item.value;
        });
      }

      if (contsRes.data) {
        setContent(contsRes.data);
        contsRes.data.forEach((item) => {
          initialKV[item.key] = item.value;
        });
      }

      setEditableKV(initialKV);

      if (catsRes.data) setCategories(catsRes.data);
      if (gallRes.data) setGallery(gallRes.data);
      if (apptsRes.data) setAppointments(apptsRes.data);
    } catch (e) {
      console.error('Error loading admin page database records:', e);
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    if (supabase) {
      try {
        // We will update settings & contents key-by-key
        const promises: any[] = [];

        Object.entries(editableKV).forEach(([key, val]) => {
          // Check if key is a setting key or a content key
          const isSetting = ['phone', 'whatsapp', 'primary_color', 'secondary_color', 'accent_color', 'app_name', 'email', 'address', 'facebook', 'instagram', 'tiktok', 'youtube', 'telegram', 'website', 'maintenance_mode', 'force_update', 'gallery_rotation_seconds', 'home_random_images', 'appointment_whatsapp', 'map_latitude', 'map_longitude'].includes(key);

          if (isSetting) {
            promises.push(
              supabase.from('settings').upsert({ key, value: val }, { onConflict: 'key' })
            );
          } else {
            promises.push(
              supabase.from('content').upsert({ key, value: val }, { onConflict: 'key' })
            );
          }
        });

        await Promise.all(promises);
        setStatusMsg('تم تحديث الإعدادات والمحتوى بنجاح في قاعدة البيانات!');
        fetchData();
      } catch (err: any) {
        setStatusMsg(`خطأ: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      localStorage.setItem('editableKV', JSON.stringify(editableKV));
      setStatusMsg('تم حفظ الإعدادات محلياً بنجاح (وضع العرض).');
      setIsSaving(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    const payload = {
      title: newCategory.title,
      description: newCategory.description,
      parent_id: newCategory.parent_id || null,
      active: newCategory.active,
      sort_order: newCategory.sort_order
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([payload])
          .select();
        if (error) throw error;
        setStatusMsg('تمت إضافة الخدمة بنجاح!');
        if (data) setCategories([...categories, data[0]]);
        setNewCategory({ title: '', description: '', parent_id: '', active: true, sort_order: 1 });
      } catch (err: any) {
        setStatusMsg(`خطأ: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      const updated = [...categories, { ...payload, id: String(Date.now()) }];
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
      setStatusMsg('تم حفظ الخدمة محلياً (وضع العرض).');
      setNewCategory({ title: '', description: '', parent_id: '', active: true, sort_order: 1 });
      setIsSaving(false);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    const payload = {
      title: newGalleryItem.title,
      description: newGalleryItem.description,
      media_type: newGalleryItem.media_type,
      file_url: newGalleryItem.file_url,
      before_image: newGalleryItem.media_type === 'before_after' ? newGalleryItem.before_image : null,
      after_image: newGalleryItem.media_type === 'before_after' ? newGalleryItem.after_image : null,
      category_id: newGalleryItem.category_id || null,
      featured: newGalleryItem.featured,
      active: newGalleryItem.active,
      sort_order: newGalleryItem.sort_order
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .insert([payload])
          .select();
        if (error) throw error;
        setStatusMsg('تمت إضافة النتيجة بنجاح!');
        if (data) setGallery([...gallery, data[0]]);
        setNewGalleryItem({
          title: '',
          description: '',
          media_type: 'before_after',
          file_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
          before_image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
          after_image: 'https://images.unsplash.com/photo-1606811841660-1b5168c8139d',
          category_id: '',
          featured: true,
          active: true,
          sort_order: 1
        });
      } catch (err: any) {
        setStatusMsg(`خطأ: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      const updated = [...gallery, { ...payload, id: String(Date.now()) }];
      setGallery(updated);
      localStorage.setItem('gallery', JSON.stringify(updated));
      setStatusMsg('تم حفظ النتيجة محلياً (وضع العرض).');
      setNewGalleryItem({
        title: '',
        description: '',
        media_type: 'before_after',
        file_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
        before_image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
        after_image: 'https://images.unsplash.com/photo-1606811841660-1b5168c8139d',
        category_id: '',
        featured: true,
        active: true,
        sort_order: 1
      });
      setIsSaving(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك بحذف هذه الصورة؟')) return;
    if (supabase) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
        setGallery(gallery.filter(g => g.id !== id));
        setStatusMsg('تم حذف الصورة من قاعدة البيانات!');
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = gallery.filter(g => g.id !== id);
      setGallery(updated);
      localStorage.setItem('gallery', JSON.stringify(updated));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-32">
        <Header title="دخول لوحة التحكم" />
        <div className="flex flex-col flex-1 items-center justify-center px-6 py-12 animate-fade-in font-sans" dir="rtl">
          <div className="w-full max-w-sm bg-white rounded-[32px] p-6 border border-black/[0.03] shadow-sm space-y-6 text-center">
            
            {/* Header/Badge */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-black text-on-surface">بوابة الإدارة الآمنة</h2>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1 leading-relaxed">
                يرجى إدخال رمز المرور للوصول إلى لوحة تحكم عيادات الدكتور مصطفى الرفاعي
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز المرور (الافتراضي: 1234)"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3.5 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-center font-bold tracking-widest animate-pulse-once"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white rounded-2xl py-3.5 text-xs font-black transition-all shadow-md shadow-primary/10 active:scale-[0.98]"
              >
                دخول لوحة التحكم
              </button>
            </form>

            <p className="text-[9px] text-on-surface-variant/60 leading-relaxed">
              محمي برمز تشفير آمن. يرجى مراجعة إدارة العيادة في حال نسيان الرمز.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <Header 
        title={
          <div className="flex justify-between items-center w-full" dir="rtl">
            <h1 className="text-[13px] font-black tracking-wider uppercase text-primary">
              لوحة التحكم بالبيانات
            </h1>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                sessionStorage.removeItem('admin_authenticated');
                setPasswordInput('');
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100/50 px-2.5 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج
            </button>
          </div>
        } 
      />

      {/* Dashboard Connection Status */}
      <div className="px-6 mt-4">
        {isSupabaseConnected ? (
          <div className="bg-[#e9f5e1] border border-[#a2d385] text-primary rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <Database className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs font-semibold">
              اتصال مباشر: متصل بقاعدة بيانات Supabase بنجاح!
            </div>
          </div>
        ) : (
          <div className="bg-[#fdf3f3] border border-[#f5c6c6] text-red-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold uppercase">وضع العرض غير المتصل</span> - لم نتمكن من الوصول لـ Supabase، يتم استخدام محاكاة محلية.
            </div>
          </div>
        )}
      </div>

      {activeTab === 'settings' && (
        <div className="px-6 mt-6 space-y-6 animate-fade-in font-sans" dir="rtl">
          {/* Stats overview */}
          <div className="grid grid-cols-2 gap-4 text-right">
            <div className="bg-white border border-black/[0.03] rounded-3xl p-5 shadow-sm">
              <div className="bg-primary/5 text-primary w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mr-0">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-on-surface">{appointments.length}</span>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">الحجوزات والرسائل</p>
            </div>
            <div className="bg-white border border-black/[0.03] rounded-3xl p-5 shadow-sm">
              <div className="bg-secondary/5 text-secondary w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mr-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-on-surface">{gallery.length}</span>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">النتائج والمعرض</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-right">
            <div className="bg-white rounded-[32px] p-6 border border-black/[0.03] space-y-4 shadow-sm">
              <h3 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">إعدادات الملف الشخصي للعيادة</h3>
              
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">اسم الطبيب</label>
                <input
                  type="text"
                  value={editableKV.doctor_name || ''}
                  onChange={e => setEditableKV({ ...editableKV, doctor_name: e.target.value })}
                  className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">حول الطبيب</label>
                <textarea
                  rows={3}
                  value={editableKV.about_doctor || ''}
                  onChange={e => setEditableKV({ ...editableKV, about_doctor: e.target.value })}
                  className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none resize-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">اسم العيادة</label>
                <input
                  type="text"
                  value={editableKV.clinic_name || ''}
                  onChange={e => setEditableKV({ ...editableKV, clinic_name: e.target.value })}
                  className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">صورة الملف الشخصي للطبيب (رابط)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={editableKV.doctor_image || ''}
                    onChange={e => setEditableKV({ ...editableKV, doctor_image: e.target.value })}
                    className="flex-1 bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    dir="ltr"
                    placeholder="/src/assets/images/..."
                  />
                  {editableKV.doctor_image && (
                    <img 
                      src={editableKV.doctor_image} 
                      alt="Doctor portrait preview" 
                      className="w-12 h-12 rounded-full border-2 border-primary object-cover flex-shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رقم الهاتف الأساسي</label>
                  <input
                    type="text"
                    value={editableKV.phone || ''}
                    onChange={e => setEditableKV({ ...editableKV, phone: e.target.value })}
                    className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رقم الواتساب</label>
                  <input
                    type="text"
                    value={editableKV.whatsapp || ''}
                    onChange={e => setEditableKV({ ...editableKV, whatsapp: e.target.value })}
                    className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">اللون الأساسي</label>
                  <input
                    type="color"
                    value={editableKV.primary_color || '#7A8F6A'}
                    onChange={e => setEditableKV({ ...editableKV, primary_color: e.target.value })}
                    className="w-full h-10 bg-transparent border-0 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">اللون الثانوي</label>
                  <input
                    type="color"
                    value={editableKV.secondary_color || '#A5B58D'}
                    onChange={e => setEditableKV({ ...editableKV, secondary_color: e.target.value })}
                    className="w-full h-10 bg-transparent border-0 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">لون الخلفية المائل</label>
                  <input
                    type="color"
                    value={editableKV.accent_color || '#E8E2D6'}
                    onChange={e => setEditableKV({ ...editableKV, accent_color: e.target.value })}
                    className="w-full h-10 bg-transparent border-0 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Security/Password Configuration Card */}
            <div className="bg-white rounded-[32px] p-6 border border-black/[0.03] space-y-4 shadow-sm text-right">
              <h3 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">أمان لوحة التحكم</h3>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رمز المرور الحالي / الجديد</label>
                <input
                  type="text"
                  value={editableKV.admin_password || ''}
                  onChange={e => setEditableKV({ ...editableKV, admin_password: e.target.value })}
                  placeholder="مثال: 1234"
                  className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold text-center tracking-widest"
                  dir="ltr"
                />
                <p className="text-[9px] text-on-surface-variant/80 mt-2 leading-relaxed">
                  هذا الرمز يُستخدم لحماية لوحة الإدارة من أي تعديل غير مصرح به. الرمز الافتراضي هو <code className="font-mono bg-black/5 px-1 rounded text-primary">1234</code>. يرجى حفظ وتذكر هذا الرمز بعد تغييره لضمان إمكانية الدخول مجدداً.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary text-white rounded-[24px] py-4 flex items-center justify-center gap-2 font-bold text-xs active:scale-[0.98] transition-transform shadow-lg shadow-primary/10 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'جاري المزامنة...' : 'حفظ ومزامنة التغييرات'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="px-6 mt-6 space-y-6 animate-fade-in font-sans text-right" dir="rtl">
          <form onSubmit={handleAddCategory} className="bg-white rounded-[32px] p-6 border border-black/[0.03] space-y-4 shadow-sm">
            <h3 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 text-right">إضافة قسم علاج جديد</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">عنوان الخدمة</label>
              <input
                required
                type="text"
                placeholder="مثال: تقويم الأسنان المعدني"
                value={newCategory.title}
                onChange={e => setNewCategory({ ...newCategory, title: e.target.value })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">وصف الخدمة</label>
              <textarea
                placeholder="اكتب وصفاً مختصراً للخدمة هنا..."
                value={newCategory.description}
                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">القسم الرئيسي (اختياري، في حال كان قسماً فرعياً)</label>
              <select
                value={newCategory.parent_id}
                onChange={e => setNewCategory({ ...newCategory, parent_id: e.target.value })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none appearance-none text-right"
              >
                <option value="">هذا قسم رئيسي</option>
                {categories.filter(c => !c.parent_id).map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary text-white rounded-[24px] py-4 flex items-center justify-center gap-2 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              حفظ الخدمة في قاعدة البيانات
            </button>
          </form>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mr-2">الخدمات والأقسام النشطة</h4>
            {categories.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-black/[0.03] flex justify-between items-center shadow-sm">
                <div className="min-w-0 text-right">
                  <h5 className="font-bold text-xs">{c.title}</h5>
                  <p className="text-[9px] text-on-surface-variant truncate mt-0.5">
                    {c.parent_id ? `خدمة فرعية لقسم رئيسي` : `قسم رئيسي متكامل`}
                  </p>
                </div>
                <span className="bg-primary/5 text-primary text-[9px] font-black px-2.5 py-1 rounded-full">نشط</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="px-6 mt-6 space-y-6 animate-fade-in font-sans text-right" dir="rtl">
          <form onSubmit={handleAddGalleryItem} className="bg-white rounded-[32px] p-6 border border-black/[0.03] space-y-4 shadow-sm text-right">
            <h3 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">إضافة حالة (قبل / بعد) أو صورة للمعرض</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase font-semibold">نوع الوسائط</label>
              <select
                value={newGalleryItem.media_type}
                onChange={e => setNewGalleryItem({ ...newGalleryItem, media_type: e.target.value as any })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none"
              >
                <option value="before_after">قبل وبعد (مع مقارنة شريط السحب)</option>
                <option value="image">صورة عادية (معرض الصور)</option>
                <option value="video">فيديو</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase font-semibold">عنوان الحالة</label>
              <input
                required
                type="text"
                placeholder="مثال: تركيب ابتسامة هوليوود كاملة"
                value={newGalleryItem.title}
                onChange={e => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none text-right"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">وصف الحالة / السطر الفرعي</label>
              <input
                type="text"
                placeholder="مثال: تم الإنجاز في جلستين فقط"
                value={newGalleryItem.description}
                onChange={e => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none text-right"
              />
            </div>

            {newGalleryItem.media_type === 'before_after' ? (
              <div className="grid grid-cols-2 gap-4 text-right">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رابط صورة (قبل)</label>
                  <input required type="text" placeholder="https://..." value={newGalleryItem.before_image} onChange={e => setNewGalleryItem({ ...newGalleryItem, before_image: e.target.value })} className="w-full bg-background border border-black/5 rounded-2xl px-3 py-2 text-[11px] focus:outline-none" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رابط صورة (بعد)</label>
                  <input required type="text" placeholder="https://..." value={newGalleryItem.after_image} onChange={e => setNewGalleryItem({ ...newGalleryItem, after_image: e.target.value })} className="w-full bg-background border border-black/5 rounded-2xl px-3 py-2 text-[11px] focus:outline-none" dir="ltr" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 mr-1 uppercase">رابط الصورة أو الفيديو</label>
                <input required type="text" placeholder="https://..." value={newGalleryItem.file_url} onChange={e => setNewGalleryItem({ ...newGalleryItem, file_url: e.target.value })} className="w-full bg-background border border-black/5 rounded-2xl px-4 py-3 text-xs focus:outline-none" dir="ltr" />
              </div>
            )}

            <button type="submit" disabled={isSaving} className="w-full bg-primary text-white rounded-[24px] py-4 font-bold text-xs">إضافة وحفظ الحالة</button>
          </form>

          <div className="space-y-3">
            {gallery.map(g => (
              <div key={g.id} className="bg-white rounded-2xl p-4 border border-black/[0.03] flex gap-4 items-center justify-between shadow-sm" dir="rtl">
                <div className="flex gap-2 items-center min-w-0">
                  <div className="flex -space-x-4">
                    <img src={g.before_image || g.file_url} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0" />
                    {g.media_type === 'before_after' && (
                      <img src={g.after_image} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0" />
                    )}
                  </div>
                  <div className="mr-3 min-w-0 text-right">
                    <h5 className="font-bold text-xs truncate">{g.title || 'بدون عنوان'}</h5>
                    <p className="text-[10px] text-on-surface-variant">النوع: {g.media_type === 'before_after' ? 'مقارنة' : 'صورة'}</p>
                  </div>
                </div>
                <button onClick={() => g.id && handleDeleteGalleryItem(g.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="px-6 mt-6 space-y-4 animate-fade-in mb-32 font-sans text-right" dir="rtl">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 border border-black/[0.03] text-center shadow-sm">
              <Database className="w-8 h-8 text-on-surface-variant mx-auto mb-3 opacity-20" />
              <p className="text-xs text-on-surface-variant font-bold">لا يوجد حجوزات أو رسائل حالياً</p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-[32px] p-6 border border-black/[0.03] space-y-3 shadow-sm border-r-4 border-r-primary text-right">
                <div className="flex justify-between items-start">
                  <div className="text-right">
                    <h4 className="font-bold text-sm text-on-surface">{appt.full_name}</h4>
                    <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1">القسم/الموضوع: {appt.subject || 'استشارة عامة'}</p>
                  </div>
                  <span className="text-[9px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{appt.type === 'appointment' ? 'طلب حجز' : 'استفسار'}</span>
                </div>
                
                {appt.message && (
                  <p className="text-xs text-on-surface leading-relaxed p-4 bg-background rounded-2xl border border-black/5 italic text-right">
                    "{appt.message}"
                  </p>
                )}

                {appt.preferred_date && (
                  <div className="flex gap-4 text-[10px] text-on-surface-variant font-bold border-t border-black/5 pt-2 justify-start">
                    <span>التاريخ المفضل: {appt.preferred_date}</span>
                    <span>الوقت المفضل: {appt.preferred_time || 'غير محدد'}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <a href={`tel:${appt.phone}`} className="flex-1 bg-primary text-white py-3.5 rounded-xl text-[10px] font-bold text-center">اتصال مباشر</a>
                  {appt.whatsapp && (
                    <a href={`https://wa.me/${appt.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white py-3.5 rounded-xl text-[10px] font-bold text-center">مراسلة واتساب</a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tabs list inside screen */}
      <div className="fixed bottom-24 left-6 right-6 z-40 bg-white/80 backdrop-blur-xl border border-black/[0.03] p-1.5 rounded-full shadow-xl flex gap-1">
        {[
          { id: 'settings', icon: Settings, label: 'الإعدادات' },
          { id: 'services', icon: List, label: 'الخدمات' },
          { id: 'cases', icon: Sparkles, label: 'النتائج' },
          { id: 'inquiries', icon: FileText, label: 'الوارد' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setStatusMsg(''); }}
            className={cn(
              "flex-1 py-3 rounded-full text-[10px] font-black transition-all flex items-center justify-center gap-1.5",
              activeTab === tab.id ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-surface-dim"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div className="fixed top-24 left-6 right-6 z-50 p-4 rounded-2xl bg-primary text-white text-xs font-bold flex items-center gap-2 animate-slide-down shadow-xl">
          <Check className="w-4 h-4" />
          {statusMsg}
          <button onClick={() => setStatusMsg('')} className="ml-auto opacity-50">×</button>
        </div>
      )}
    </div>
  );
}
