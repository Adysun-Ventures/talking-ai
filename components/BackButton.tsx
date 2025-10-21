'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
    >
      <span className="inline-flex items-center justify-center w-8 h-8">
        <ArrowLeft className="w-4 h-4" />
      </span>
    </button>
  );
}


