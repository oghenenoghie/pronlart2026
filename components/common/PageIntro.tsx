import { Reveal } from "@/components/motion/Reveal";

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="grid gap-8 border-b border-ink/15 pb-9 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl">
          <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-8 text-ink/60 sm:text-lg">{description}</p>
        </div>
        {aside ? <div className="md:pb-1">{aside}</div> : null}
      </div>
    </Reveal>
  );
}
