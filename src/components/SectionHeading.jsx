import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, note }) {
  return (
    <Reveal>
      <div className="hairline pt-6 md:pt-8">
        <p className="text-eyebrow text-accent">{eyebrow}</p>
        <div className="mt-5 flex flex-col justify-between gap-4 md:mt-7 md:flex-row md:items-end">
          <h2 className="font-display text-section max-w-4xl font-600">{title}</h2>
          {note && (
            <p className="max-w-xs text-[0.9rem] leading-relaxed text-bone-dim md:text-right">
              {note}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
