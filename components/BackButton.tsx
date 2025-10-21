'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const computeCanGoBack = (): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        const nav: any = (window as any).navigation;
        if (nav?.entries && nav?.currentEntry) {
          const entries = nav.entries();
          const idx = entries.findIndex((e: any) => e.id === nav.currentEntry.id);
          return idx > 0;
        }
        const ref = document.referrer;
        const sameOrigin = !!ref && new URL(ref).origin === window.location.origin;
        return sameOrigin || window.history.length > 1;
      } catch {
        return false;
      }
    };

    const update = () => setCanGoBack(computeCanGoBack());
    update();

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', update);
      const nav: any = (window as any).navigation;
      nav?.addEventListener?.('navigate', update);
      return () => {
        window.removeEventListener('popstate', update);
        nav?.removeEventListener?.('navigate', update);
      };
    }
  }, []);

  if (!canGoBack) return null;
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


