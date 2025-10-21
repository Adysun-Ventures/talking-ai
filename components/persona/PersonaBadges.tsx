type PersonaBadgesProps = {
  badges: string[];
};

export default function PersonaBadges({ badges }: PersonaBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1 justify-center md:justify-center lg:justify-start">
      {badges.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 rounded-full text-xs bg-white/12 border border-white/10 text-white/80"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

