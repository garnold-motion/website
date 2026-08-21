import { ArrowUpRight, FileText } from 'lucide-react';
import { site } from '../data/site.js';
import Reveal from './Reveal.jsx';

export default function Contact() {
  const { email, rates, cvUrl, bookingUrl } = site.contact;

  return (
    <section id="contact" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="hairline pt-6 md:pt-8">
            <p className="text-eyebrow text-accent">04 — Contact</p>

            <h2 className="font-display text-section mt-5 max-w-4xl font-600 md:mt-7">
              Got something you need cut or animated?
            </h2>

            {/* The email is the primary action — big, unmissable, no form to fill. */}
            <a
              href={`mailto:${email}`}
              className="group mt-10 inline-flex flex-wrap items-baseline gap-x-4 gap-y-2 md:mt-14"
            >
              <span className="font-display text-[clamp(1.5rem,5vw,3.5rem)] font-600 text-bone underline decoration-ink-line decoration-[0.06em] underline-offset-[0.18em] transition-colors duration-300 group-hover:text-accent group-hover:decoration-accent">
                {email}
              </span>
              <ArrowUpRight
                size={28}
                strokeWidth={1.5}
                className="text-bone-dim transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
              />
            </a>

            {/* Appears automatically once you put a booking URL in site.js. */}
            {bookingUrl && (
              <div className="mt-10">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-line px-6 py-3 text-[0.85rem] font-500 transition-colors hover:border-accent hover:text-accent"
                >
                  Check availability
                  <ArrowUpRight size={15} strokeWidth={1.75} />
                </a>
              </div>
            )}

            {rates?.length > 0 && (
              <p className="mt-12 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.9rem] text-bone-dim md:mt-16">
                <span className="text-eyebrow mr-1 text-bone-dim/60">Estimate rates</span>
                {rates.map((rate, i) => (
                  <span key={rate.unit} className="whitespace-nowrap">
                    {i > 0 && <span aria-hidden="true" className="mr-2 text-bone-dim/30">·</span>}
                    <span className="text-bone">{rate.amount}</span> {rate.unit}
                  </span>
                ))}
              </p>
            )}

            {cvUrl && (
              <div className="mt-6">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 text-[0.85rem] font-500 text-bone-dim transition-colors hover:text-accent"
                >
                  <FileText size={15} strokeWidth={1.75} />
                  Download CV
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
