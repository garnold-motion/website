import { motion } from 'framer-motion';
import { site } from '../data/site.js';

const rise = {
  hidden: { opacity: 0, y: '0.15em' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32"
    >
      {/* Soft accent bloom behind the type — keeps the black from reading dead. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13] blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
      />

      <div className="relative flex flex-1 flex-col justify-center">
        <motion.p
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="text-eyebrow mb-6 text-bone-dim md:mb-8"
        >
          {site.location}
        </motion.p>

        <h1 className="font-display text-hero font-600">
          {site.disciplines.map((word, i) => (
            <motion.span
              key={word}
              custom={i + 1}
              variants={rise}
              initial="hidden"
              animate="show"
              className="block"
            >
              {/* The last discipline gets the accent so the eye lands somewhere. */}
              <span className={i === site.disciplines.length - 1 ? 'text-accent' : undefined}>
                {word}
              </span>
            </motion.span>
          ))}
        </h1>

        <motion.p
          custom={site.disciplines.length + 1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-xl text-[1rem] leading-relaxed text-bone-dim md:mt-10 md:text-[1.15rem]"
        >
          {site.tagline}
        </motion.p>
      </div>

      <motion.div
        custom={site.disciplines.length + 2}
        variants={rise}
        initial="hidden"
        animate="show"
        className="relative flex items-end justify-between gap-6"
      >
        <a
          href="#work"
          className="group inline-flex items-center gap-3 text-[0.8rem] font-500 text-bone-dim transition-colors hover:text-bone"
        >
          <span
            aria-hidden="true"
            className="inline-block h-8 w-px bg-ink-line transition-colors group-hover:bg-accent"
          />
          Scroll to work
        </a>

        <a
          href={`mailto:${site.contact.email}`}
          className="hidden text-[0.8rem] font-500 text-bone-dim transition-colors hover:text-accent md:inline"
        >
          {site.contact.email}
        </a>
      </motion.div>
    </section>
  );
}
