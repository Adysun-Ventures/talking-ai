'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeaderBarProps {
  left?: ReactNode;
  title?: string;
  right?: ReactNode;
  className?: string;
}

export default function HeaderBar({ left, title, right, className }: HeaderBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 bg-neutral-950/50 backdrop-blur-md border-b border-white/10',
        'grid grid-cols-[auto_1fr_auto] items-center h-12 md:h-14 px-3 md:px-4',
        className
      )}
    >
      <div className="flex items-center">{left}</div>
      {title && (
        <div className="text-center text-white/90 text-sm md:text-base font-medium truncate px-2">
          {title}
        </div>
      )}
      <div className="flex items-center justify-end">{right}</div>
    </header>
  );
}

