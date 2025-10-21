export type Persona = {
  id: string;
  name: string;
  description: string;
  badges: string[];
  initials: string;
  gender: 'male' | 'female';   // Used for voice selection
  image?: string;              // e.g. "/personas/enstine.png"
  defaultVoice?: string;       // e.g. "sage"
  instructionKey?: string;     // future: map to instruction text
};

export const PERSONAS: Persona[] = [
  {
    id: 'shivaji-maharaj',
    name: 'Shivaji Maharaj',
    description: 'Strategic leader and founder of the Maratha Empire.',
    badges: ['Historical', 'Leadership', 'Maratha Empire'],
    initials: 'SM',
    gender: 'male',
    image: '/personas/shivaji-maharaj.jpg',
    defaultVoice: 'cedar',
  },
  {
    id: 'enstine',
    name: 'Enstine',
    description: 'Science mentor for kids; simple and accurate answers.',
    badges: ['Polite', 'Scientific Only', 'Concise'],
    initials: 'EB',
    gender: 'male',
    image: '/personas/albert-einstein.jpg',
    defaultVoice: 'sage',
  },
  {
    id: 'sarasvati',
    name: 'Sarasvati',
    description: 'Goddess of knowledge, music, art, and wisdom.',
    badges: ['Cultural', 'Knowledge', 'Inspiration'],
    initials: 'SA',
    gender: 'female',
    image: '/personas/sarasvati.jpg',
    defaultVoice: 'shimmer',
  },
  {
    id: 'babasaheb-ambedkar',
    name: 'Babasaheb Ambedkar',
    description: 'Jurist, economist, social reformer; architect of the Constitution of India.',
    badges: ['Historical', 'Reforms', 'Civil Rights'],
    initials: 'BA',
    gender: 'male',
    image: '/personas/br-ambedkar.jpg',
    defaultVoice: 'ballad',
  },
  {
    id: 'bhagat-singh',
    name: 'Bhagat Singh',
    description: 'Revolutionary freedom fighter who inspired generations.',
    badges: ['Historical', 'Freedom', 'Inspiration'],
    initials: 'BS',
    gender: 'male',
    image: '/personas/bhagat-singh.jpg',
    defaultVoice: 'echo',
  },
];

export const PERSONA_BY_ID = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p])
);

export const DEFAULT_PERSONA_ID = 'enstine';

