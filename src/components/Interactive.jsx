import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';

/**
 * Placeholder state for the interactive section.
 *
 * The Rive machinery is all still in the repo — RiveCanvas.jsx, PhoneFrame.jsx,
 * and the `interactiveWork` entries in site.js. Nothing imports them right now,
 * so Vite leaves them out of the bundle; wiring the carousel back in when the
 * pieces are ready is a revert, not a rebuild.
 */
export default function Interactive() {
  return (
    <section id="interactive" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="02 — Interactive"
          title="Interactive design"
          note="Rive animation and playable pieces for apps and the web."
        />

        <Reveal className="mt-12 md:mt-16">
          <div className="flex min-h-[13rem] flex-col items-start justify-center rounded-2xl border border-ink-line bg-ink-soft px-7 py-12 md:min-h-[16rem] md:px-12">
            <span className="relative flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-eyebrow text-accent">Coming soon</span>
            </span>

            <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-bone-dim md:text-[1.1rem]">
              Playable Rive work is being put together now. In the meantime, get in touch if
              interactive animation is what you're after.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
