import { services } from '../data/site.js';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';

export default function Services() {
  return (
    <section id="services" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading eyebrow="03 — Services" title="What I do" />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <div className="hairline pt-6">
                <h3 className="font-display text-xl font-600">{service.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-bone-dim">{service.body}</p>
                <ul className="mt-6 space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[0.85rem] text-bone-dim">
                      <span aria-hidden="true" className="h-px w-3 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
