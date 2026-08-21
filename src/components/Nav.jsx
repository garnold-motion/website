import { useEffect, useState } from 'react';
import { site } from '../data/site.js';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Interactive', href: '#interactive' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      // Once scrolled the bar is fully opaque, not translucent. On phones the
      // backdrop blur can fail to composite, and a semi-transparent bar then
      // lets the page show through — which reads as the header going clear.
      // Solid also guarantees the strip behind the status bar stays dark.
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-ink-line bg-ink backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
      // Keeps the links clear of the notch when the page runs edge to edge
      // (viewport-fit=cover in index.html).
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <a
          href="#top"
          className="font-display text-[0.95rem] font-600 tracking-tight text-bone transition-colors hover:text-accent"
        >
          {site.name}
        </a>

        {/* Desktop links. On mobile the page is short enough to just scroll,
            so we show a single Contact affordance instead of a burger menu. */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.8rem] font-500 text-bone-dim transition-colors hover:text-bone"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="rounded-full border border-ink-line px-4 py-1.5 text-[0.75rem] font-500 text-bone transition-colors hover:border-accent hover:text-accent md:hidden"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
