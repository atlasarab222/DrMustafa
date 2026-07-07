import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

const PLACEHOLDER_CATEGORY: Category = {
  id: '',
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fcfaf7"/></svg>'
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('sort_order');
          
        if (data && !error && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, []);

  const mainCategories = categories.filter(c => !c.parent_id);
  const displayItems = mainCategories.length > 0 ? mainCategories : categories;

  const isArabic = (text?: string) => {
    if (!text) return false;
    return /[\u0600-\u06FF]/.test(text);
  };

  const renderTitle = (item: any, fallbackStr: string) => {
    const mainTitle = item.title_ar || (isArabic(item.title) ? item.title : fallbackStr);
    const showSub = item.title_ar && item.title !== item.title_ar && !isArabic(item.title);
    return (
      <h3 className="text-xs font-black text-[#4E5E42] mb-1 leading-tight">
        {mainTitle}
        {showSub && (
          <span className="block text-[8px] font-bold text-primary/60 mt-0.5 tracking-wider font-mono uppercase">{item.title}</span>
        )}
      </h3>
    );
  };

  const renderTitleH4 = (item: any, fallbackStr: string) => {
    const mainTitle = item.title_ar || (isArabic(item.title) ? item.title : fallbackStr);
    const showSub = item.title_ar && item.title !== item.title_ar && !isArabic(item.title);
    return (
      <h4 className="text-[11px] font-black text-[#4E5E42] mb-0.5 leading-tight">
        {mainTitle}
        {showSub && (
          <span className="block text-[8px] font-bold text-primary/60 tracking-wider font-mono uppercase">{item.title}</span>
        )}
      </h4>
    );
  };

  const getDescription = (item: any, fallbackStr: string) => {
    return item.description_ar || (isArabic(item.description) ? item.description : fallbackStr);
  };

  // We assign the 6 gorgeous custom card layouts by matching or cyclic index
  const item0 = displayItems[0] || PLACEHOLDER_CATEGORY;
  const item1 = displayItems[1] || PLACEHOLDER_CATEGORY;
  const item2 = displayItems[2] || PLACEHOLDER_CATEGORY;
  const item3 = displayItems[3] || PLACEHOLDER_CATEGORY;
  const item4 = displayItems[4] || PLACEHOLDER_CATEGORY;
  const item5 = displayItems[5] || PLACEHOLDER_CATEGORY;

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8F5] pb-32">
      <Header title="قائمة العلاج" />
      
      <div className="px-6 mt-6 relative">
        {/* Title and premium plant illustration top bar */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1 text-right" dir="rtl">
            <h2 className="text-3xl font-black text-[#4E5E42] tracking-tight leading-tight">قائمة الرعاية</h2>
            <div className="w-16 h-[2.5px] bg-[#7A8F6A] mt-2 mb-4"></div>
          </div>
          {/* Custom line art potted plant icon matching reference photo */}
          <div className="w-16 h-16 text-[#7A8F6A]/25 flex-shrink-0 animate-fade-in">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M35 55 L65 55 L61 80 L39 80 Z" />
              <path d="M31 55 L69 55" strokeWidth="3" />
              <path d="M50 55 L50 25" />
              <path d="M50 40 C65 40, 72 30, 72 18 C56 18, 50 28, 50 40" fill="currentColor" fillOpacity="0.08" />
              <path d="M50 30 C35 30, 28 20, 28 8 C44 8, 50 18, 50 30" fill="currentColor" fillOpacity="0.08" />
            </svg>
          </div>
        </div>

        {/* Premium bilingual/rich subtitle */}
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed text-right mb-12 max-w-md ml-auto" dir="rtl">
          ملاذ تلتقي فيه صحة الأسنان بالجمال الفاخر والراحة المطلقة، صُمم خصيصاً ليمنحك ابتسامة طبيعية فائقة الجمال تليق بتميزك.
        </p>

        {/* Bespoke Asymmetrical Layout Container */}
        <div className="space-y-12 max-w-md mx-auto">
          
          {/* Card Style 1: Dental Implants (Overlapping layout with Left Border) */}
          <div className="relative mb-16">
            <div className="w-[85%] aspect-[1.15/1] rounded-[32px] overflow-hidden bg-surface-dim shadow-sm relative group">
              <img 
                src={item0.image || PLACEHOLDER_CATEGORY.image} 
                alt={item0.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Plant/Leaf badge overlay inside image */}
              <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-[2px] border border-black/[0.04] flex items-center justify-center text-[#7A8F6A] shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1" strokeOpacity="0.1" />
                  <path d="M12 22V12" />
                  <path d="M12 12C12 12 16 9 18 6 C15 6 12 10 12 12" />
                  <path d="M12 12C12 12 8 9 6 6 C9 6 12 10 12 12" />
                </svg>
              </div>
            </div>
            
            {/* Overlay Text Box (shifted right) */}
            <div className="absolute bottom-[-28px] right-0 w-[64%] bg-[#F4F3EF] border-l-4 border-[#7A8F6A] rounded-[24px] p-4.5 shadow-lg border border-black/[0.03] text-right z-10" dir="rtl">
              {renderTitle(item0, 'زراعة الأسنان')}
              <p className="text-[10px] text-on-surface-variant/90 leading-relaxed font-bold">
                {getDescription(item0, 'حلول دائمة ومتكاملة لتعويض الأسنان المفقودة بمظهر طبيعي غاية في الدقة والجمال.')}
              </p>
            </div>
          </div>

          {/* Grid Layout Section 1: Smile Design (A) & Teeth Whitening (B) */}
          <div className="grid grid-cols-2 gap-4 items-start pt-4">
            
            {/* Smile Design (Left) - Square image with botanical leaf vector overlay */}
            <div className="flex flex-col text-right" dir="rtl">
              <div className="aspect-square w-full rounded-[28px] overflow-hidden bg-surface-dim shadow-sm relative group mb-2.5">
                <img 
                  src={item1.image || PLACEHOLDER_CATEGORY.image} 
                  alt={item1.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Custom Botanical Line Art Overlay */}
                <div className="absolute inset-0 pointer-events-none p-3 flex items-center justify-center opacity-45">
                  <svg className="w-full h-full text-white/60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M50 85 C50 60, 32 40, 18 30" strokeDasharray="1,1" />
                    <path d="M50 85 C50 60, 68 40, 82 30" strokeDasharray="1,1" />
                    <path d="M22 40 C28 35, 38 38, 34 48 C30 58, 18 50, 22 40 Z" fill="currentColor" fillOpacity="0.04" />
                    <path d="M78 40 C72 35, 62 38, 66 48 C70 58, 82 50, 78 40 Z" fill="currentColor" fillOpacity="0.04" />
                    <path d="M50 25 C45 15, 55 5, 60 10 C65 15, 55 20, 50 25 Z" fill="currentColor" fillOpacity="0.04" />
                  </svg>
                </div>
              </div>
              {renderTitleH4(item1, 'تصميم الابتسامة')}
              <p className="text-[9px] text-on-surface-variant/90 leading-relaxed font-bold">
                {getDescription(item1, 'رسم وتصميم ابتسامة مثالية تناسب تفاصيل وجهك بدقة متناهية ولمسة فنية.')}
              </p>
            </div>

            {/* Teeth Whitening (Right) - Taller Portrait aspect ratio */}
            <div className="flex flex-col text-right" dir="rtl">
              <div className="aspect-[3/4] w-full rounded-[28px] overflow-hidden bg-surface-dim shadow-sm relative group mb-2.5">
                <img 
                  src={item2.image || PLACEHOLDER_CATEGORY.image} 
                  alt={item2.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              {renderTitleH4(item2, 'تبييض الأسنان')}
              <p className="text-[9px] text-on-surface-variant/90 leading-relaxed font-bold">
                {getDescription(item2, 'جلسات تبييض احترافية آمنة تمنح أسنانك بريقاً وناصعاً يدوم طويلاً.')}
              </p>
            </div>
          </div>

          {/* Card Style 3: Cosmetic Dentistry (Horizontal Overlap Right with Right Border) */}
          <div className="relative mb-16 pt-6">
            <div className="w-[85%] aspect-[1.15/1] rounded-[32px] overflow-hidden bg-surface-dim shadow-sm ml-auto relative group">
              <img 
                src={item3.image || PLACEHOLDER_CATEGORY.image} 
                alt={item3.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Overlay Text Box (shifted left) */}
            <div className="absolute bottom-[-28px] left-0 w-[64%] bg-[#F4F3EF] border-r-4 border-[#7A8F6A] rounded-[24px] p-4.5 shadow-lg border border-black/[0.03] text-right z-10" dir="rtl">
              {renderTitle(item3, 'تجميل الأسنان')}
              <p className="text-[10px] text-on-surface-variant/90 leading-relaxed font-bold">
                {getDescription(item3, 'إبراز وتجميل معالم الابتسامة الطبيعية بأحدث الخامات والتقنيات العلاجية.')}
              </p>
            </div>
          </div>

          {/* Grid Layout Section 2: Orthodontics (C) & Veneers (D) */}
          <div className="grid grid-cols-2 gap-4 items-end pt-8">
            
            {/* Orthodontics (Left) - Circle layout centered */}
            <div className="flex flex-col text-center justify-center items-center pb-2">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden relative group mb-3">
                <img 
                  src={item4.image || PLACEHOLDER_CATEGORY.image} 
                  alt={item4.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              {renderTitleH4(item4, 'تقويم الأسنان')}
              <p className="text-[9px] text-on-surface-variant/90 leading-relaxed font-bold max-w-[110px] mx-auto mt-0.5">
                {getDescription(item4, 'تقويم حديث غير مرئي وحلول متطورة لتنظيم واصطفاف الأسنان بشكل مثالي.')}
              </p>
            </div>

            {/* Veneers (Right) - Fine Labeled card layout */}
            <div className="flex flex-col text-right animate-fade-in" dir="rtl">
              <span className="text-[8px] font-black text-[#7A8F6A] uppercase tracking-widest text-center mb-1 bg-[#7A8F6A]/5 py-0.5 rounded-full">
                Our Services • Veneers
              </span>
              <div className="aspect-[1.1/1] w-full rounded-[24px] overflow-hidden bg-surface-dim shadow-sm relative group mb-2.5">
                <img 
                  src={item5.image || PLACEHOLDER_CATEGORY.image} 
                  alt={item5.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              {renderTitleH4(item5, 'عدسات الفينير')}
              <p className="text-[9px] text-on-surface-variant/90 leading-relaxed font-bold">
                {getDescription(item5, 'تحول كامل وجذاب للابتسامة عبر قشور الفينير الخزفية فائقة الرقة.')}
              </p>
            </div>
          </div>

          {/* Any remaining categories are displayed beautifully below */}
          {displayItems.length > 6 && (
            <div className="mt-14 pt-10 border-t border-black/[0.04]">
              <h3 className="text-[10px] font-black tracking-widest text-[#7A8F6A] uppercase mb-6 text-center">خدمات إضافية</h3>
              <div className="grid grid-cols-2 gap-4">
                {displayItems.slice(6).map(service => (
                  <div key={service.id} className="bg-[#F4F3EF] rounded-3xl p-3.5 border border-black/[0.02] shadow-sm text-right" dir="rtl">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden mb-2.5">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                    {renderTitleH4(service, service.title)}
                    <p className="text-[8px] text-on-surface-variant/90 leading-relaxed font-bold">{getDescription(service, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Premium bottom Consultation Card styled exactly like the reference */}
        <div className="mt-20 max-w-md mx-auto">
          <div className="bg-[#4E5E42] rounded-[40px] p-8 text-center relative overflow-hidden shadow-lg border border-white/5">
            {/* Elegant botanical shadow background watermarks */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 opacity-10 text-white pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 22v-9m0 0C7 13 4 8 4 5c4 0 8 2 8 8zm0 0c5 0 8-5 8-8-4 0-8 2-8 8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-md border border-white/10 shadow-inner">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            
            <h4 className="text-white font-black text-base mb-2">هل أنت مستعد لابتسامة جديدة؟</h4>
            <p className="font-bold text-[10px] text-white/80 mb-8 leading-relaxed max-w-xs mx-auto">
              عِش تجربة النخبة في العناية الطبيعية بالأسنان مع الدكتور مصطفى الرفاعي. احجز موعدك اليوم لتنطلق نحو ابتكار ابتسامتك المثالية.
            </p>
            
            <Link 
              to="/contact"
              className="bg-white hover:bg-[#F9F8F5] text-[#4E5E42] w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs transition-all duration-300 shadow-md active:scale-95"
            >
              <span>احجز موعد الآن</span>
              <ArrowRight className="w-4 h-4 text-[#4E5E42]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

