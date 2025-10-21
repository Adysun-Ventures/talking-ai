type PersonaBadgesProps = {
  badges: string[];
};

export default function PersonaBadges({ badges }: PersonaBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 border border-white/10 text-white/70"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

