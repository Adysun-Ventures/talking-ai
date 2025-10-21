import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import HeaderBar from '@/components/HeaderBar';
import { PERSONAS } from '@/components/persona/personas';
import PersonaAvatar from '@/components/persona/PersonaAvatar';
import PersonaBadges from '@/components/persona/PersonaBadges';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <HeaderBar left={<BackButton />} title="Choose your AI Companion !" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PERSONAS.map((persona) => (
            <Link
              key={persona.id}
              href={`/chat?persona=${encodeURIComponent(persona.id)}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              aria-label={`Select ${persona.name}`}
            >
              <div className="mb-3 relative w-full aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                {persona.image ? (
                  <Image src={persona.image} alt={persona.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/70 text-xl font-semibold">
                    {persona.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="font-medium mb-1">{persona.name}</div>
              <div className="text-xs text-white/60 line-clamp-2 mb-2">{persona.description}</div>
              {/* <PersonaBadges badges={persona.badges} /> */}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
