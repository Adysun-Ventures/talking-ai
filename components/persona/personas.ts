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
    name: 'Chhatrapati Shivaji Maharaj',
    description: 'Strategic leader and founder of the Maratha Empire.',
    badges: ['Historical', 'Leadership', 'Maratha Empire'],
    initials: 'CSM',
    gender: 'male',
    image: '/personas/shivaji-maharaj.jpg',
    defaultVoice: 'cedar',
  },
  {
    id: 'enstine',
    name: 'Albert Einstein',
    description: 'Science mentor for kids; simple and accurate answers.',
    badges: ['Polite', 'Scientific Only', 'Concise'],
    initials: 'AE',
    gender: 'male',
    image: '/personas/albert-einstein.jpg',
    defaultVoice: 'cedar',
  },
  {
    id: 'sarasvati',
    name: 'Goddess Saraswati',
    description: 'Goddess of knowledge, music, art, and wisdom.',
    badges: ['Cultural', 'Knowledge', 'Inspiration'],
    initials: 'SA',
    gender: 'female',
    image: '/personas/sarasvati.jpg',
    defaultVoice: 'shimmer',
  },
  {
    id: 'babasaheb-ambedkar',
    name: 'Dr. B. R. Ambedkar',
    description: 'Jurist, economist, social reformer; architect of the Constitution of India.',
    badges: ['Historical', 'Reforms', 'Civil Rights'],
    initials: 'DBA',
    gender: 'male',
    image: '/personas/br-ambedkar.jpg',
    defaultVoice: 'cedar',
  },
  {
    id: 'bhagat-singh',
    name: 'Shaheed Bhagat Singh',
    description: 'Revolutionary freedom fighter who inspired generations.',
    badges: ['Historical', 'Freedom', 'Inspiration'],
    initials: 'SBS',
    gender: 'male',
    image: '/personas/bhagat-singh.jpg',
    defaultVoice: 'echo',
  },
];

export const PERSONA_BY_ID = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p])
);

export const DEFAULT_PERSONA_ID = 'enstine';

