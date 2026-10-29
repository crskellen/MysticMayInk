import { useEffect, useState } from "react";
import SocialHandleLink from "../components/SocialHandleLink";
import SocialFeed from "../components/SocialFeed";
import { artistById, artists } from "../data/artists";
import { useFeed } from "../feed/useFeed.js";

function artistIdFromHash() {
  const id = window.location.hash.replace(/^#/, "");
  return artists.some((artist) => artist.id === id) ? id : "";
}

export default function Artists() {
  const catalog = useFeed();
  const [activeArtist, setActiveArtist] = useState(artists[0].id);
  const currentArtist = artistById(activeArtist);

  useEffect(() => {
    const apply = () => {
      const id = artistIdFromHash();
      if (id) setActiveArtist(id);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const selectArtist = (id) => {
    setActiveArtist(id);
    const next = `${window.location.pathname}${window.location.search}#${id}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current !== next) window.history.replaceState(window.history.state, "", next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl uppercase tracking-widest text-mystic-text md:text-4xl">
          Artists
        </h1>
        <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mystic-text/70 md:text-base">
          Meagan Caprice and Brittany Ostrander tattoo at Mystic May Tattoo
          Studios in Watertown, New York.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Artists"
        className="mb-12 -mx-6 flex overflow-x-auto border-b border-mystic-card sm:mx-0"
      >
        {artists.map((artist) => {
          const selected = currentArtist.id === artist.id;
          return (
            <button
              key={artist.id}
              type="button"
              role="tab"
              id={`artist-tab-${artist.id}`}
              aria-selected={selected}
              aria-controls={artist.id}
              onClick={() => selectArtist(artist.id)}
              className={`min-h-[48px] min-w-[10rem] flex-1 bg-transparent px-4 py-4 text-center font-serif text-sm uppercase tracking-widest transition-all duration-300
                ${
                  selected
                    ? "border-b-2 border-mystic-gold font-semibold text-mystic-gold"
                    : "border-b-2 border-transparent text-mystic-muted hover:text-mystic-gold"
                }`}
            >
              {artist.name}
            </button>
          );
        })}
      </div>

      {artists.map((artist) => {
        const selected = artist.id === activeArtist;
        return (
          <section
            key={artist.id}
            role="tabpanel"
            id={artist.id}
            hidden={!selected}
            aria-labelledby={`artist-tab-${artist.id}`}
          >
            <div className="mb-16 rounded border border-mystic-bg bg-mystic-card p-6 shadow-gold-glow md:p-10">
              <div className="max-w-2xl space-y-4">
                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-wide text-mystic-text md:text-3xl">
                    {artist.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2.5 pt-3">
                    {artist.socials.map((account) => (
                      <SocialHandleLink
                        key={account.platform}
                        account={account}
                        compact
                      />
                    ))}
                  </div>
                </div>

                <p className="font-sans text-sm font-light leading-relaxed text-mystic-text/70">
                  {artist.bio}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {artist.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-mystic-card bg-mystic-bg px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest text-mystic-sage"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <SocialFeed
        posts={catalog.posts}
        artists={[currentArtist]}
        platforms={["tiktok", "instagram"]}
      />
    </div>
  );
}
