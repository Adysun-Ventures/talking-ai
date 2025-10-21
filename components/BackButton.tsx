'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
    >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </span>
      <span className="text-sm">Back</span>
    </button>
  );
}


