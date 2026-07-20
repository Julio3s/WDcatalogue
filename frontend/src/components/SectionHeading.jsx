export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
          <span className="h-px w-6 bg-gold/70" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
