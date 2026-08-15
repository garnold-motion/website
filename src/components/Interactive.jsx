import { lazy, Suspense, useState } from 'react';
import { Hand } from 'lucide-react';
import { interactiveWork } from '../data/site.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import Modal from './Modal.jsx';
import PhoneFrame from './PhoneFrame.jsx';
import Carousel from './Carousel.jsx';

// The Rive runtime is ~186KB and nobody needs it until they open a piece.
// Splitting it out keeps the initial page load light.
const RiveCanvas = lazy(() => import('./RiveCanvas.jsx'));

const RiveFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="text-eyebrow text-bone-dim/50">Loading</span>
  </div>
);

export default function Interactive() {
  const [active, setActive] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <section id="interactive" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="02 — Interactive"
          title="Things you can play with"
          note="Built in Rive. Tap one to open it — these are live, not videos."
        />
      </div>

      <Reveal className="mt-12 md:mt-16">
        <div className="mx-auto max-w-[1400px] pl-6 md:pl-10">
          <Carousel label="Interactive work" controlsClassName="pr-6 md:pr-10">
            {interactiveWork.map((item) => (
              <article
                key={item.id}
                className="w-[80%] shrink-0 snap-start sm:w-[58%] md:w-[calc(46%-0.75rem)]"
              >
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="group relative flex h-full min-h-[19rem] w-full flex-col justify-between overflow-hidden rounded-2xl border border-ink-line bg-ink-soft p-7 text-left transition-colors duration-500 hover:border-bone-dim/30 md:min-h-[21rem] md:p-9"
                >
                  {/* Per-project accent glow. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.16] blur-[70px] transition-opacity duration-700 group-hover:opacity-[0.34]"
                    style={{ background: item.accent }}
                  />

                  <div className="relative">
                    <p className="text-eyebrow text-bone-dim">{item.client}</p>
                    <h3 className="font-display mt-4 text-2xl font-600 md:text-[2rem]">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-bone-dim">
                      {item.description}
                    </p>
                  </div>

                  <span className="relative mt-8 inline-flex items-center gap-2.5 text-[0.8rem] font-500 text-bone">
                    <Hand
                      size={15}
                      strokeWidth={1.75}
                      className="transition-transform duration-500 group-hover:-translate-y-0.5"
                    />
                    {isDesktop ? 'Open in phone' : 'Tap to play'}
                    <span
                      aria-hidden="true"
                      className="ml-1 h-px w-8 transition-all duration-500 group-hover:w-14"
                      style={{ backgroundColor: item.accent }}
                    />
                  </span>
                </button>
              </article>
            ))}

            <div aria-hidden="true" className="w-6 shrink-0 md:w-10" />
          </Carousel>
        </div>
      </Reveal>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        label={active?.title ?? 'Interactive piece'}
      >
        {active &&
          (isDesktop ? (
            <div className="flex items-center gap-14">
              <PhoneFrame>
                <Suspense fallback={<RiveFallback />}>
                  <RiveCanvas
                    src={active.src}
                    artboard={active.artboard}
                    stateMachine={active.stateMachine}
                  />
                </Suspense>
              </PhoneFrame>

              <div className="max-w-xs">
                <p className="text-eyebrow text-bone-dim">{active.client}</p>
                <h3 className="font-display mt-4 text-3xl font-600">{active.title}</h3>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-bone-dim">
                  {active.description}
                </p>
                <p className="mt-8 text-[0.78rem] leading-relaxed text-bone-dim/60">
                  Running live in the browser. Click and drag inside the phone to interact.
                </p>
              </div>
            </div>
          ) : (
            /* On a phone, the device is the frame — go edge to edge. */
            <div className="h-[82svh] w-full overflow-hidden rounded-2xl bg-ink-soft">
              <Suspense fallback={<RiveFallback />}>
                <RiveCanvas
                  src={active.src}
                  artboard={active.artboard}
                  stateMachine={active.stateMachine}
                />
              </Suspense>
            </div>
          ))}
      </Modal>
    </section>
  );
}
