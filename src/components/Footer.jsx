import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="px-6 pb-10 pt-8 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-ink-line pt-8 text-[0.78rem] text-bone-dim/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} — {site.location}
        </p>
        <a href="#top" className="transition-colors hover:text-bone md:text-right">
          Back to top
        </a>
      </div>
    </footer>
  );
}
