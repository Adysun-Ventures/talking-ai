import VoiceChat from '@/components/VoiceChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <VoiceChat />
        </div>
      </div>
    </main>
  );
}
