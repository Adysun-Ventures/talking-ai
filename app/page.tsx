import VoiceChat from '@/components/VoiceChat';
import Link from 'next/link';
import { PERSONA_BY_ID, DEFAULT_PERSONA_ID } from '@/components/persona/personas';
import PersonaAvatar from '@/components/persona/PersonaAvatar';
import PersonaBadges from '@/components/persona/PersonaBadges';
import PersonaPicker from '@/components/persona/PersonaPicker';

type HomeProps = {
  searchParams: { persona?: string };
};

export default function Home({ searchParams }: HomeProps) {
  const personaId = searchParams.persona || DEFAULT_PERSONA_ID;
  const persona = PERSONA_BY_ID[personaId] || PERSONA_BY_ID[DEFAULT_PERSONA_ID];

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
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
          <PersonaPicker selectedId={persona.id} />
          
          {/* Two-column layout: 40% left (avatar/info), 60% right (VoiceChat) */}
          <div className="flex flex-col md:grid md:grid-cols-[2fr_3fr] md:gap-6">
            {/* Left column: Persona info */}
            <div className="flex flex-col items-center md:items-start space-y-4 mb-6 md:mb-0">
              <PersonaAvatar persona={persona} size="xl" />
              <div className="text-center md:text-left">
                <h2 className="text-white text-2xl font-semibold mb-2">{persona.name}</h2>
                <p className="text-white/60 text-sm mb-3">{persona.description}</p>
                <PersonaBadges badges={persona.badges} />
                <div className="mt-2 text-xs text-white/50">
                  Voice: <span className="capitalize text-white/70">{persona.defaultVoice || '—'}</span>
                </div>
              </div>
            </div>
            
            {/* Right column: VoiceChat UI */}
            <div className="w-full">
              <VoiceChat personaId={persona.id} defaultVoice={persona.defaultVoice} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
