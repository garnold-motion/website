import { ArrowUpRight } from 'lucide-react';
import { site } from '../data/site.js';
import Reveal from './Reveal.jsx';

export default function Contact() {
  const { email, socials, bookingUrl } = site.contact;

  return (
    <section id="contact" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="hairline pt-6 md:pt-8">
            <p className="text-eyebrow text-accent">04 — Contact</p>

            <h2 className="font-display text-section mt-5 max-w-4xl font-600 md:mt-7">
              Got something you need cut, animated,
              <br className="hidden md:block" /> or made interactive?
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

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 md:mt-20">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[0.85rem] font-500 text-bone-dim transition-colors hover:text-bone"
                >
                  {social.label}
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
