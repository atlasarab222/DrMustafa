import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Category, GalleryItem, ContentItem, SettingItem } from '../types';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Play,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { cn } from '../lib/utils';

// Helper to get nested values from content/settings
const getValue = (data: any[], key: string, defaultValue: string = '') => {
  const item = data.find(i => i.key === key);
  return item ? item.value : defaultValue;
};

// Organic Blob Shapes for Category Cards
const BLOB_SHAPES = [
  'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
  'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]',
  'rounded-[50%_50%_20%_80%/25%_80%_20%_75%]',
  'rounded-[70%_30%_50%_50%/30%_30%_70%_70%]'
];

export default function HomePage() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Dynamic Styles from Settings
  const effectiveSettings = settings;
  const effectiveContent = content;
  const effectiveCategories = categories;
  const effectiveGallery = gallery;

  const themeStyles = useMemo(() => {
    const primary = getValue(effectiveSettings, 'primary_color', '#7A8F6A');
    const secondary = getValue(effectiveSettings, 'secondary_color', '#A5B58D');
    const accent = getValue(effectiveSettings, 'accent_color', '#E8E2D6');
    
    return {
      '--primary': primary,
      '--secondary': secondary,
      '--accent': accent,
    } as React.CSSProperties;
  }, [effectiveSettings]);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      try {
        const [
          { data: settingsData },
          { data: contentData },
          { data: categoriesData },
          { data: galleryData }
        ] = await Promise.all([
          supabase.from('settings').select('*'),
          supabase.from('content').select('*').eq('active', true),
          supabase.from('categories').select('*').eq('active', true).order('sort_order'),
          supabase.from('gallery').select('*').eq('active', true).order('sort_order')
        ]);

        if (settingsData && settingsData.length > 0) setSettings(settingsData);
        if (contentData && contentData.length > 0) setContent(contentData);
        if (categoriesData && categoriesData.length > 0) setCategories(categoriesData);
        if (galleryData && galleryData.length > 0) setGallery(galleryData);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Featured Gallery Rotation
  const featuredGallery = useMemo(() => effectiveGallery.filter(item => item.featured), [effectiveGallery]);
  const rotationSeconds = parseInt(getValue(effectiveSettings, 'gallery_rotation_seconds', '5')) || 5;

  useEffect(() => {
    if (featuredGallery.length <= 1) return;
    const interval = setInterval(() => {
      setActiveGalleryIndex(prev => (prev + 1) % featuredGallery.length);
    }, rotationSeconds * 1000);
    return () => clearInterval(interval);
  }, [featuredGallery, rotationSeconds]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-32 overflow-x-hidden selection:bg-primary/20" style={themeStyles}>
      
      {/* Hero Stone Section */}
      <section className="px-6 pt-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[320px] aspect-square flex items-center justify-center"
        >
          {/* Decorative Back Elements */}
          <div className="absolute -top-10 -right-4 w-12 h-24 bg-[#DDE2D8] rounded-full blur-2xl opacity-60" />
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#E8E2D6] rounded-full blur-2xl opacity-60" />

          {/* The "Stone" Circle */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full bg-[#fcfaf7] rounded-full shadow-[inset_0_-8px_20px_rgba(0,0,0,0.03),0_15px_45px_rgba(0,0,0,0.08)] border-8 border-white/50 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
          >
            {/* Doctor Portrait Image */}
            <div className="w-24 h-24 mb-4 rounded-full border-4 border-primary/20 shadow-md overflow-hidden flex-shrink-0 relative group">
              <img 
                src={getValue(effectiveContent, 'doctor_image', '/src/assets/images/dr_mustafa_original_portrait_1782949321991.jpg')} 
                alt={getValue(effectiveContent, 'doctor_name', 'مصطفى الرفاعي')} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <span className="text-[10px] font-bold tracking-[0.3em] text-on-surface-variant uppercase mb-1">
              {getValue(effectiveContent, 'doctor_title', 'دكتور')}
            </span>
            <h1 className="text-2xl font-bold text-on-surface leading-tight tracking-tight mb-1">
              {getValue(effectiveContent, 'doctor_name', 'مصطفى الرفاعي')}
            </h1>
            <p className="text-[11px] font-medium text-on-surface-variant opacity-70">
              {getValue(effectiveContent, 'clinic_name', 'عيادات الأسنان')}
            </p>
          </motion.div>

          {/* Small Decorative Stone */}
          <div className="absolute bottom-4 right-4 w-12 h-10 bg-[#dbdad5] rounded-full blur-[1px] shadow-lg opacity-80 rotate-12" />
        </motion.div>
      </section>

      {/* Welcome Text */}
      <section className="px-8 mt-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-on-surface leading-tight"
        >
          {getValue(effectiveContent, 'home_title', 'نبتكر ابتسامات جميلة')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-on-surface-variant mt-2 leading-relaxed opacity-80 max-w-[85%]"
          dangerouslySetInnerHTML={{ __html: getValue(effectiveContent, 'home_description', 'أهلاً بكم في عيادتنا المتخصصة.') }}
        />
      </section>

      {/* Main Services Organic Grid */}
      <section className="mt-12 px-6">
        <div className="grid grid-cols-2 gap-4">
          {effectiveCategories.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative p-6 flex flex-col items-center justify-center text-center shadow-sm transition-all",
                BLOB_SHAPES[idx % BLOB_SHAPES.length],
                idx === 0 || idx === 2 ? "bg-primary text-on-primary aspect-[4/5]" : "bg-accent text-on-surface aspect-square"
              )}
            >
              <div className="w-10 h-10 mb-3 opacity-90">
                {/* Dynamic Icon placeholder */}
                <Sparkles className="w-full h-full stroke-[1.5]" />
              </div>
              <h3 className="text-[13px] font-bold leading-tight uppercase tracking-wider">
                {cat.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Gallery / Before & After Section */}
      {featuredGallery.length > 0 && (
        <section className="mt-16">
          <div className="px-8 mb-6 flex justify-between items-end">
            <h3 className="text-lg font-bold text-on-surface">ابتسامتنا تتحدث عنا</h3>
            <Link to="/results" className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
              المزيد <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="px-6">
            <div className="relative aspect-[16/10] w-full rounded-[40px] overflow-hidden bg-white shadow-xl border border-black/[0.03]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGalleryIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  {featuredGallery[activeGalleryIndex].media_type === 'before_after' ? (
                    <div className="w-full h-full flex overflow-hidden">
                      <div className="w-1/2 h-full relative">
                        <img 
                          src={featuredGallery[activeGalleryIndex].before_image || featuredGallery[activeGalleryIndex].file_url} 
                          alt="Before" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                      <div className="w-1/2 h-full relative">
                        <img 
                          src={featuredGallery[activeGalleryIndex].after_image || featuredGallery[activeGalleryIndex].file_url} 
                          alt="After" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={featuredGallery[activeGalleryIndex].file_url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                  
                  {/* Overlay labels */}
                  <div className="absolute inset-x-6 bottom-6 flex justify-between items-center z-10">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-on-surface uppercase tracking-widest shadow-sm">
                      {featuredGallery[activeGalleryIndex].title || 'Gallery'}
                    </div>
                    {featuredGallery[activeGalleryIndex].media_type === 'video' && (
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-primary">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="absolute top-6 inset-x-12 flex gap-1.5 z-20">
                {featuredGallery.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-all duration-500",
                      activeGalleryIndex === idx ? "bg-white" : "bg-white/30"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Primary CTA */}
      <section className="px-6 mt-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/contact" 
            className="w-full h-20 bg-primary rounded-[32px] flex items-center justify-between px-8 text-on-primary shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="text-lg font-bold tracking-tight z-10">احجز استشارتك الآن</span>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center z-10">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Quick Contact FABs */}
      <div className="fixed bottom-32 right-6 z-40 flex flex-col gap-3">
        <motion.a 
          href={`https://wa.me/${getValue(effectiveSettings, 'whatsapp', '07508585140')}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary border border-black/[0.03]"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>
        <motion.a 
          href={`tel:${getValue(effectiveSettings, 'phone', '07508585140')}`}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary border border-black/[0.03]"
        >
          <Phone className="w-6 h-6" />
        </motion.a>
      </div>

    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-12 animate-pulse">
      <div className="flex justify-between">
        <div className="w-12 h-12 bg-surface rounded-2xl" />
        <div className="w-12 h-12 bg-surface rounded-2xl" />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-64 h-64 bg-surface rounded-full shadow-inner" />
      </div>
      <div className="space-y-3 px-4">
        <div className="h-8 bg-surface rounded-lg w-3/4" />
        <div className="h-4 bg-surface rounded-lg w-full" />
        <div className="h-4 bg-surface rounded-lg w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square bg-surface rounded-[40%]" />
        <div className="aspect-square bg-surface rounded-[40%]" />
      </div>
    </div>
  );
}
