import Link from 'next/link';
import BackButton from '@/components/BackButton';

type Persona = {
  id: string;
  label: string;
  description: string;
  badges: string[];
  initials: string; // used in placeholder avatar
};

const BOTS: Persona[] = [
  {
    id: 'shivaji-maharaj',
    label: 'Shivaji Maharaj',
    description: 'Strategic leader and founder of the Maratha Empire.',
    badges: ['Historical', 'Leadership', 'Maratha Empire'],
    initials: 'SM',
  },
  {
    id: 'enstine',
    label: 'Enstine',
    description: 'Science mentor for kids; simple and accurate answers.',
    badges: ['Polite', 'Scientific Only', 'Concise'],
    initials: 'EB',
  },
  {
    id: 'sarasvati',
    label: 'Sarasvati',
    description: 'Goddess of knowledge, music, art, and wisdom.',
    badges: ['Cultural', 'Knowledge', 'Inspiration'],
    initials: 'SA',
  },
  {
    id: 'babasaheb-ambedkar',
    label: 'Babasaheb Ambedkar',
    description: 'Jurist, economist, social reformer; architect of the Constitution of India.',
    badges: ['Historical', 'Reforms', 'Civil Rights'],
    initials: 'BA',
  },
  {
    id: 'bhagat-singh',
    label: 'Bhagat Singh',
    description: 'Revolutionary freedom fighter who inspired generations.',
    badges: ['Historical', 'Freedom', 'Inspiration'],
    initials: 'BS',
  },
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <BackButton />
          <div className="text-white/90 text-xl">Choose a persona</div>
          <div className="w-16" />
        </div>
        <div className="mb-6 text-white/60 text-sm">Tap a card to start a voice session with that persona.</div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BOTS.map((b) => (
            <Link
              key={b.id}
              href={`/?persona=${encodeURIComponent(b.id)}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              aria-label={`Select ${b.label}`}
            >
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-3 group-hover:border-white/20 flex items-center justify-center overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 text-sm font-medium">
                  {b.initials}
                </div>
              </div>
              <div className="font-medium mb-1">{b.label}</div>
              <div className="text-xs text-white/60 line-clamp-2 mb-2">{b.description}</div>
              <div className="flex flex-wrap gap-1">
                {b.badges.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 border border-white/10 text-white/70 group-hover:text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
