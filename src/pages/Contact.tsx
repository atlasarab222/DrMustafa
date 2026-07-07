import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Phone, MapPin, MessageCircle, Send, Clock, Calendar as CalendarIcon, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Category, SettingItem, ContentItem } from '../types';

export default function ContactPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  
  const [formData, setFormData] = useState({
    type: 'appointment',
    full_name: '',
    phone: '',
    whatsapp: '',
    category_id: '',
    subject: '',
    message: '',
    preferred_date: '',
    preferred_time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle'|'success'|'error'>('idle');

  useEffect(() => {
    async function fetchContactData() {
      if (!supabase) return;
      try {
        const [cats, sets, conts] = await Promise.all([
          supabase.from('categories').select('*').eq('active', true).order('sort_order'),
          supabase.from('settings').select('*'),
          supabase.from('content').select('*').eq('active', true)
        ]);

        if (cats.data) setCategories(cats.data);
        if (sets.data) setSettings(sets.data);
        if (conts.data) setContent(conts.data);
      } catch (err) {
        console.error('Error fetching contact page data:', err);
      }
    }
    fetchContactData();
  }, []);

  const getValue = (key: string, def: string) => {
    const s = settings.find(x => x.key === key);
    if (s) return s.value;
    const c = content.find(x => x.key === key);
    if (c) return c.value;
    return def;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    if (!supabase) {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({
          type: 'appointment',
          full_name: '',
          phone: '',
          whatsapp: '',
          category_id: '',
          subject: '',
          message: '',
          preferred_date: '',
          preferred_time: ''
        });
      }, 1000);
      return;
    }

    try {
      const payload = {
        type: formData.type,
        full_name: formData.full_name,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        category_id: formData.category_id || null,
        subject: formData.subject || 'Consultation Request',
        message: formData.message,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || null,
        status: 'new'
      };

      const { error } = await supabase
        .from('appointments')
        .insert([payload]);

      if (error) throw error;
      setSubmitStatus('success');
      setFormData({
        type: 'appointment',
        full_name: '',
        phone: '',
        whatsapp: '',
        category_id: '',
        subject: '',
        message: '',
        preferred_date: '',
        preferred_time: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone1 = getValue('phone1', getValue('phone', '07508585140'));
  const phone2 = getValue('phone2', '07825268404');
  const whatsappNumber = getValue('whatsapp', '07508585140');
  const addressText = getValue('address', 'Erbil - Near Majidi Mall');
  const workingHours = getValue('working_hours', '09:00 AM - 09:00 PM');

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <Header title="اتصل بنا" />
      
      {/* Hero */}
      <div className="px-4 mt-2">
        <div className="bg-surface-dim rounded-[40px] overflow-hidden relative aspect-[4/3]">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop" 
            alt="Clinic Reception" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">تواصل معنا الآن</h2>
            <p className="text-white/90 text-xs">احصل على الابتسامة التي طالما حلمت بها في عيادتنا المتكاملة.</p>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="px-6 mt-8 space-y-4">
        {[
          { icon: Phone, title: 'اتصل بنا مباشر', desc: `${phone1} / ${phone2}` },
          { icon: MapPin, title: 'عنوان العيادة', desc: addressText },
          { icon: MessageCircle, title: 'راسلنا واتساب', desc: `متاح للتواصل: ${whatsappNumber}` },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-black/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface text-sm">{item.title}</h4>
              <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="px-6 mt-12 relative">
        <h3 className="text-xl font-bold text-primary mb-6">احجز موعدك أو أرسل استفسارك</h3>
        
        {/* Tab Selection */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl border border-black/[0.03]">
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, type: 'appointment' })}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${formData.type === 'appointment' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            طلب حجز موعد
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, type: 'message' })}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${formData.type === 'message' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant'}`}
          >
            استفسار عام
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">الاسم الكامل</label>
            <input 
              required
              type="text" 
              placeholder="أدخل اسمك الكريم"
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-white border border-black/[0.03] rounded-[24px] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface placeholder:text-on-surface-variant/40 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">رقم الهاتف</label>
              <input 
                required
                type="tel" 
                placeholder="0750XXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white border border-black/[0.03] rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface placeholder:text-on-surface-variant/40 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">رقم الواتساب (اختياري)</label>
              <input 
                type="tel" 
                placeholder="0750XXXXXXX"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full bg-white border border-black/[0.03] rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface placeholder:text-on-surface-variant/40 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">الخدمة المطلوبة</label>
            <div className="relative">
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value, subject: categories.find(c => c.id === e.target.value)?.title || ''})}
                className="w-full bg-white border border-black/[0.03] rounded-[24px] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface appearance-none shadow-sm"
              >
                <option value="">اختر الخدمة أو القسم</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-on-surface-variant absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {formData.type === 'appointment' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">التاريخ المفضل</label>
                <input 
                  type="date" 
                  value={formData.preferred_date}
                  onChange={e => setFormData({...formData, preferred_date: e.target.value})}
                  className="w-full bg-white border border-black/[0.03] rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">الوقت المفضل</label>
                <input 
                  type="time" 
                  value={formData.preferred_time}
                  onChange={e => setFormData({...formData, preferred_time: e.target.value})}
                  className="w-full bg-white border border-black/[0.03] rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface shadow-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant mb-2 mr-2">الرسالة أو تفاصيل الحالة</label>
            <textarea 
              required
              placeholder="اكتب استفسارك أو تفاصيل حالتك وسوف نتواصل معك في أقرب وقت."
              rows={4}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white border border-black/[0.03] rounded-[24px] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs text-on-surface placeholder:text-on-surface-variant/40 resize-none shadow-sm"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white rounded-[24px] py-5 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-md shadow-primary/10 disabled:opacity-70 mt-4"
          >
            <span className="font-bold text-xs tracking-wider">
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}
            </span>
            {!isSubmitting && <Send className="w-4 h-4" />}
          </button>

          {submitStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-primary bg-primary/5 rounded-2xl py-3 px-4 border border-primary/10">
              <Check className="w-4 h-4" />
              <p className="text-center text-xs font-bold">تم إرسال رسالتك بنجاح وسنتصل بك قريباً!</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <p className="text-center text-xs font-bold text-red-600 mt-2">فشل إرسال الطلب. يرجى التحقق من الاتصال وإعادة المحاولة.</p>
          )}
        </form>
      </div>

      {/* Map Graphic Section (Placeholder matching design) */}
      <div className="px-4 mt-16">
         <div className="bg-[#f0ebe1] rounded-[32px] overflow-hidden p-2 relative h-48">
            <div className="w-full h-full border border-black/10 rounded-[24px] bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center opacity-70">
                <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                    <MapPin className="w-6 h-6" />
                </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <a 
                  href={`https://maps.google.com/?q=${getValue('map_latitude', '36.1911')},${getValue('map_longitude', '44.0092')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-on-surface font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 shadow-sm whitespace-nowrap border border-black/[0.03]"
                >
                    <MapPin className="w-4 h-4 text-primary" /> الاتجاهات على الخريطة
                </a>
            </div>
         </div>
      </div>

      {/* Clinic Hours */}
      <div className="px-6 mt-16 mb-8 relative">
         <div className="flex items-center gap-3 mb-6">
             <Clock className="w-6 h-6 text-primary" />
             <h3 className="text-xl font-bold text-on-surface">أوقات العمل</h3>
         </div>
         
         <div className="bg-white rounded-3xl p-6 border border-black/[0.03] shadow-sm relative z-10">
            <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-on-surface">ساعات العمل الرسمية</span>
                <span className="text-xs text-on-surface-variant font-medium">
                    {workingHours}
                </span>
            </div>
         </div>

         {/* Decorative watermark */}
         <div className="absolute top-10 right-4 w-32 h-32 opacity-5 pointer-events-none text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 22v-9m0 0C7 13 4 8 4 5c4 0 8 2 8 8zm0 0c5 0 8-5 8-8-4 0-8 2-8 8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
         </div>
      </div>
    </div>
  );
}
