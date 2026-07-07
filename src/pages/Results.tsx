import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';
import { GalleryItem } from '../types';
import { cn } from '../lib/utils';
import { ChevronsUpDown, Sparkles } from 'lucide-react';

const FILTERS = ['الكل', 'فينير', 'تبييض', 'زراعة'];

export default function ResultsPage() {
  const [cases, setCases] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('الكل');

  useEffect(() => {
    async function fetchCases() {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('active', true);
          
        if (data && !error && data.length > 0) {
          setCases(data);
        }
      } catch (err) {
        console.error('Error fetching cases:', err);
      }
    }
    
    fetchCases();
  }, []);

  // Filter cases based on selected chip filter
  const filteredCases = cases.filter(c => {
    if (activeFilter === 'الكل') return true;
    const filterTerm = activeFilter.toLowerCase();
    const titleMatch = c.title?.toLowerCase().includes(filterTerm);
    const descMatch = c.description?.toLowerCase().includes(filterTerm);
    return titleMatch || descMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <Header title="النتائج والابتسامات" variant="back" />
      
      {/* Filters */}
      <div className="px-6 py-4 overflow-x-auto no-scrollbar flex gap-2">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
              activeFilter === filter 
                ? "bg-primary text-on-primary" 
                : "bg-white text-on-surface hover:bg-surface-dim border border-black/[0.03]"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Cases List */}
      <div className="px-6 mt-4 space-y-8">
        {filteredCases.map(caseStudy => (
          <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
        ))}
      </div>
    </div>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: GalleryItem; key?: any }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left mouse button drag
      handleMove(e.clientX);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const beforeImage = caseStudy.before_image || caseStudy.file_url;
  const afterImage = caseStudy.after_image || caseStudy.file_url;

  return (
    <div className="bg-white rounded-[32px] p-3 shadow-sm border border-black/[0.03] select-none">
      <div 
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="relative aspect-square w-full rounded-[24px] overflow-hidden flex bg-surface-dim cursor-ew-resize select-none"
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <img src={afterImage} alt="After" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 bg-black/35 backdrop-blur-[2px] border border-white/10 px-2 py-0.5 rounded-md z-10 select-none">
            <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">بعد العلاج</span>
          </div>
        </div>

        {/* Before Image (Overlay clipped width) */}
        <div 
          className="absolute inset-0 overflow-hidden" 
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={beforeImage} 
            alt="Before" 
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width || '400px' }}
          />
          <div className="absolute bottom-2 left-2 bg-black/35 backdrop-blur-[2px] border border-white/10 px-2 py-0.5 rounded-md z-10 select-none">
            <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">قبل العلاج</span>
          </div>
        </div>

        {/* Center Draggable Bar Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-7 h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-black/5">
            <ChevronsUpDown className="w-4 h-4 text-primary rotate-90" />
          </div>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 flex justify-between items-center mt-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-on-surface leading-tight truncate">{caseStudy.title || 'ابتسامة هوليوود'}</h3>
          <p className="text-xs text-on-surface-variant mt-1 truncate">{caseStudy.description || 'تجميل فوري وعلاجي متكامل.'}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
          {caseStudy.media_type === 'before_after' ? 'قبل / بعد' : 'معرض الصور'}
        </div>
      </div>
    </div>
  );
}
