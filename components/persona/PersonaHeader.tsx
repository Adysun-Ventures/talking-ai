import type { Persona } from './personas';
import PersonaAvatar from './PersonaAvatar';
import PersonaBadges from './PersonaBadges';

type PersonaHeaderProps = {
  persona: Persona;
};

export default function PersonaHeader({ persona }: PersonaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
      <PersonaAvatar persona={persona} size="md" />
      <div className="flex-1">
        <h2 className="text-white text-xl font-semibold mb-1">{persona.name}</h2>
        <p className="text-white/60 text-sm mb-2">{persona.description}</p>
        <PersonaBadges badges={persona.badges} />
      </div>
    </div>
  );
}

