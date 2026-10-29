import { useEffect, useState } from "react";
import RouteLink from "../components/RouteLink";
import { shopSmsHref } from "../data/brand";
import { careSections, careSources } from "../data/care";

export default function Care({ navigate }) {
  const [activeId, setActiveId] = useState(careSections[0].id);

  useEffect(() => {
    const chip = document.querySelector(`[data-chip="${activeId}"]`);
    const scroller = chip?.parentElement;
    if (!chip || !scroller) return;
    const left =
      chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16 animate-fadeIn">
      <header className="max-w-2xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-mystic-gold">
          Client guide
        </p>
        <h1 className="mt-3 font-serif text-3xl uppercase tracking-widest text-mystic-text md:text-4xl">
          Care Guide
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-mystic-text/80 md:text-base">
          How to get ready, what safe work looks like in the studio, how to
          care for a fresh tattoo, and how to look after it once the skin has
          healed.
        </p>
        <p className="mt-4 border-l border-mystic-sage/50 pl-4 text-xs leading-relaxed text-mystic-muted">
          Your artist’s written aftercare comes first. If a doctor or other
          clinician tells you something different, follow that. This is general
          information for clients, not personal medical advice.
        </p>
      </header>

      <div className="mt-8 md:mt-12 md:grid md:grid-cols-[11.5rem_minmax(0,1fr)] md:gap-12">
        <div
          role="tablist"
          aria-label="Care guide sections"
          className="sticky top-20 z-40 -mx-6 border-b border-mystic-card bg-mystic-bg px-6 py-3 md:top-24 md:mx-0 md:self-start md:border-0 md:bg-transparent md:px-0 md:py-0"
        >
          <p className="mb-3 hidden font-serif text-[10px] uppercase tracking-[0.22em] text-mystic-muted md:block">
            On this page
          </p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
            {careSections.map((section) => {
              const selected = activeId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  id={`care-tab-${section.id}`}
                  data-chip={section.id}
                  aria-selected={selected}
                  aria-controls={`care-panel-${section.id}`}
                  onClick={() => setActiveId(section.id)}
                  className={`shrink-0 rounded-full border bg-transparent px-3 py-2 text-left font-serif text-[11px] uppercase tracking-[0.16em] transition-colors min-h-[44px] md:w-full md:rounded-none md:border-0 md:border-l md:px-3 md:py-2 md:min-h-0 ${
                    selected
                      ? "border-mystic-gold text-mystic-gold md:border-mystic-gold"
                      : "border-mystic-card text-mystic-muted hover:text-mystic-gold md:border-mystic-card"
                  }`}
                >
                  {section.chip}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          {careSections.map((section) => {
            const selected = activeId === section.id;
            return (
              <section
                key={section.id}
                role="tabpanel"
                id={`care-panel-${section.id}`}
                hidden={!selected}
                aria-labelledby={`care-tab-${section.id}`}
              >
                <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-mystic-gold">
                  {section.number}
                </p>
                <h2 className="mt-2 font-serif text-2xl uppercase tracking-wide text-mystic-text">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mystic-text/80">
                  {section.summary}
                </p>

                <div className="mt-5 space-y-8">
                  {section.groups.map((group) => (
                    <div key={group.heading || section.id}>
                      {group.heading && (
                        <p className="mb-3 font-serif text-xs uppercase tracking-[0.2em] text-mystic-gold">
                          {group.heading}
                        </p>
                      )}
                      <div className="rounded border border-mystic-bg bg-mystic-card px-4 md:px-6">
                        {group.items.map((item) => (
                          <article
                            key={item.title}
                            className="border-b border-white/5 py-4 last:border-b-0 md:py-5"
                          >
                            <h3 className="font-serif text-base tracking-wide text-mystic-text">
                              {item.title}
                            </h3>
                            <p className="mt-1.5 text-sm font-light leading-relaxed text-mystic-text/80">
                              {item.body}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="mt-14 space-y-14">
          <section className="scroll-mt-36 rounded border border-mystic-gold/30 bg-mystic-card px-5 py-6 shadow-gold-glow md:px-8">
            <h3 className="font-serif text-xl uppercase tracking-wide text-mystic-text">
              If you are unsure
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mystic-text/80">
              Text the studio about the piece itself: how the covering should
              come off, what they asked you to put on it, or whether the way
              it looks matches what they expect. For a rash, a fever, or
              anything that feels like an infection, contact a clinician.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={shopSmsHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded bg-mystic-gold px-5 font-serif text-xs uppercase tracking-[0.18em] text-mystic-bg transition-colors hover:bg-mystic-text"
              >
                Text the studio
              </a>
              <RouteLink
                href="/book"
                onNavigate={navigate}
                className="inline-flex min-h-[48px] items-center justify-center rounded border border-mystic-sage px-5 font-serif text-xs uppercase tracking-[0.18em] text-mystic-text transition-colors hover:bg-mystic-bg"
              >
                Request a session
              </RouteLink>
            </div>
          </section>

          <footer className="border-t border-mystic-card pt-6">
            <p className="font-serif text-[10px] uppercase tracking-[0.22em] text-mystic-muted">
              Sources
            </p>
            <ul className="mt-3 space-y-2">
              {careSources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs leading-relaxed text-mystic-muted underline decoration-mystic-sage/40 underline-offset-2 transition-colors hover:text-mystic-gold"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
