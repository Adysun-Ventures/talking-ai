'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Persona } from './personas';

type PersonaAvatarProps = {
  persona: Persona;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const sizeMap = {
  xs: 'w-10 h-10 sm:w-12 sm:h-12',
  sm: 'w-12 h-12',
  md: 'w-16 h-16 sm:w-20 sm:h-20',
  lg: 'w-24 h-24 sm:w-32 sm:h-32',
  xl: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
  '2xl': 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64',
} as const;

export default function PersonaAvatar({ persona, size = 'md' }: PersonaAvatarProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`${sizeMap[size]} aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center`}
    >
      {persona.image && !imageError ? (
        <Image
          src={persona.image}
          alt={persona.name}
          width={128}
          height={128}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 text-sm font-medium">
          {persona.initials}
        </div>
      )}
    </div>
  );
}

