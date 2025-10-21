import VoiceChat from '@/components/VoiceChat';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-end mb-2">
            <Link href="/explore" aria-label="Explore" title="explore other bots !" className="transition duration-200 ease-out">
              <span className="grid place-items-center hover:scale-110 hover:-rotate-3 transition duration-200 ease-out">
                <svg className="w-[18px] h-[18px] text-white/80 block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16 8 14 14 8 16 10 10 16 8" />
                </svg>
              </span>
            </Link>
          </div>
          <VoiceChat />
        </div>
      </div>
    </main>
  );
}
