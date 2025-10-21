import VoiceChat from '@/components/VoiceChat';

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Real-time Voice AI
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience natural voice conversations with AI using OpenAI's Realtime API. 
            Choose from multiple voices and enjoy seamless, low-latency interactions.
          </p>
        </div>

        {/* Main Voice Chat Interface */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
          <VoiceChat />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p className="text-sm">
            Built with Next.js, OpenAI Realtime API, and modern web technologies
          </p>
        </div>
      </div>
    </main>
  );
}
