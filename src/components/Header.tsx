import React from 'react';

interface HeaderProps {
  title: React.ReactNode;
  variant?: 'default' | 'back';
}

export function Header({ title, variant = 'default' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-5 flex items-center justify-center border-b border-black/[0.03]">
      <div className="flex-1 px-4 text-center">
        {typeof title === 'string' ? (
          <h1 className="text-[16px] font-bold tracking-widest uppercase text-primary">
            {title}
          </h1>
        ) : (
          title
        )}
      </div>
    </header>
  );
}
