'use client';

import { ReactNode } from 'react';
import BackButton from '@/components/BackButton';
import { cn } from '@/lib/utils';

interface HeaderBarProps {
  left?: ReactNode;
  title?: string;
  right?: ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export default function HeaderBar({ left, title, right, className, showBackButton }: HeaderBarProps) {
  const leftContent = left ?? (showBackButton ? <BackButton /> : null);
  return (
    <header
      className={cn(
        'sticky top-0 z-20 bg-neutral-950/50 backdrop-blur-md border-b border-white/10',
        'grid grid-cols-[auto_1fr_auto] items-center h-12 md:h-14 px-3 md:px-4',
        className
      )}
    >
      <div className="flex items-center">{leftContent}</div>
      {title && (
        <div className="text-center text-white/90 text-sm md:text-base font-medium truncate px-2">
          {title}
        </div>
      )}
      <div className="flex items-center justify-end">{right}</div>
    </header>
  );
}

