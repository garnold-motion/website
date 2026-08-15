import { useState } from 'react';
import { showreel, videoWork } from '../data/site.js';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import Modal from './Modal.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import Thumb from './Thumb.jsx';
import Carousel from './Carousel.jsx';

/**
 * The showreel leads the rail, then everything in `videoWork`.
 *
 * Normalising them into one list up front keeps the card markup single-source:
 * the showreel is just the first item wearing an accent label, not a special
 * case with its own layout.
 */
function buildSlides() {
  return [
    // `role` doubles as the secondary caption line on every card, so the reel
    // uses it too rather than adding an eyebrow above the title — an extra
    // line there would push its title out of alignment with the rest.
    { ...showreel, id: 'showreel', role: 'Latest reel', featured: true },
    ...videoWork,
  ];
}

export default function Work() {
  const [active, setActive] = useState(null);
  const slides = buildSlides();

  return (
    <section id="work" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="01 — Film & Motion"
          title="Selected work"
          note="Commercials, brand films and motion pieces. Cut, designed and finished."
        />
      </div>

      {/* Full-bleed rail. Left padding matches the page gutter so the first
          card lines up with the heading, while cards run off the right edge to
          signal there's more sideways. */}
      <Reveal className="mt-12 md:mt-16">
        <div className="mx-auto max-w-[1400px] pl-6 md:pl-10">
          <Carousel label="Video work" controlsClassName="pr-6 md:pr-10">
            {slides.map((item) => (
              <article
                key={item.id}
                className="w-[80%] shrink-0 snap-start sm:w-[58%] md:w-[calc(46%-0.75rem)]"
              >
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="group block w-full text-left"
                >
                  <Thumb
                    src={item.poster}
                    alt={item.title}
                    label={`Add ${item.poster}`}
                    ringed={item.featured}
                  />

                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display truncate text-lg font-600 md:text-xl">
                        {item.title}
                      </h3>
                      {item.role && (
                        <p
                          className={`mt-1 truncate text-[0.82rem] ${
                            item.featured ? 'text-accent' : 'text-bone-dim'
                          }`}
                        >
                          {item.role}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[0.82rem] text-bone-dim">
                      {item.year ?? 'Watch'}
                    </span>
                  </div>
                </button>
              </article>
            ))}

            {/* Trailing spacer so the last card can snap clear of the edge
                instead of jamming against it. */}
            <div aria-hidden="true" className="w-6 shrink-0 md:w-10" />
          </Carousel>
        </div>
      </Reveal>

      <Modal open={!!active} onClose={() => setActive(null)} label={active?.title ?? 'Video'}>
        <div className="aspect-video w-full max-w-[1200px] overflow-hidden bg-black shadow-2xl">
          {active && <VideoPlayer item={active} />}
        </div>
      </Modal>
    </section>
  );
}
