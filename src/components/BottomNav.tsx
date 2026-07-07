import React from 'react';
import { NavLink } from 'react-router';
import { Home, Grid, Sparkles, Phone, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { name: 'الرئيسية', path: '/', icon: Home },
  { name: 'الخدمات', path: '/services', icon: Grid },
  { name: 'النتائج', path: '/results', icon: Sparkles },
  { name: 'اتصل بنا', path: '/contact', icon: Phone },
  { name: 'المزيد', path: '/admin', icon: MoreHorizontal },
];

export function BottomNav() {
  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto w-full max-w-sm px-6 z-50">
      <nav className="bg-white/90 backdrop-blur-xl rounded-[32px] px-2 py-2 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/[0.03]">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center flex-1 h-[60px] rounded-2xl transition-all duration-300',
                isActive ? 'text-primary' : 'text-[#8E8E93]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 mb-1 stroke-[1.5]", isActive && "stroke-[2]")} />
                <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/5 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
