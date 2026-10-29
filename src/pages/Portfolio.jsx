import { useEffect, useId, useRef, useState } from "react";
import PieceScreen from "../components/PieceScreen.jsx";
import { artists } from "../data/artists.js";
import { portfolioPhotos } from "../data/portfolio-photos.js";
import {
  artistName,
  filterPieces,
  locations,
  pieceCaption,
  portfolio,
  portfolioFacets,
  portfolioSorts,
  sizes,
  sortPieces,
} from "../data/portfolio.js";

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function Chip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 border px-3 text-left font-sans text-sm transition-colors duration-300 ${
        pressed
          ? "border-mystic-gold bg-mystic-bg text-mystic-gold"
          : "border-mystic-bg bg-transparent text-mystic-text/80 hover:border-mystic-gold/40 hover:text-mystic-gold"
      }`}
    >
      {children}
    </button>
  );
}

function Facet({ legend, children }) {
  return (
    <fieldset>
      <legend className="font-serif text-xs uppercase tracking-[0.18em] text-mystic-muted">
        {legend}
      </legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

function StyleOptions({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) =>
        option.children ? (
          <div key={option.id} className="basis-full">
            <Chip pressed={selected.includes(option.id)} onClick={() => onToggle(option.id)}>
              {option.label}
            </Chip>
            <div className="mt-2 border-l border-mystic-gold/30 pl-3">
              <StyleOptions
                options={option.children}
                selected={selected}
                onToggle={onToggle}
              />
            </div>
          </div>
        ) : (
          <Chip
            key={option.id}
            pressed={selected.includes(option.id)}
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </Chip>
        ),
      )}
    </div>
  );
}

function ChoiceRow({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option.id}
          pressed={selected.includes(option.id)}
          onClick={() => onToggle(option.id)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <circle cx="11" cy="11" r="6" strokeWidth="1.6" />
      <path d="M16 16l5 5" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <path d="M4 6h16M7 12h10M10 18h4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <path d="M8 5v14M8 5L5 8M8 5l3 3M16 19V5M16 19l-3-3M16 19l3-3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Portfolio() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [artistIds, setArtistIds] = useState([]);
  const [tags, setTags] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [sizeIds, setSizeIds] = useState([]);
  const [menu, setMenu] = useState("");
  const [openId, setOpenId] = useState("");
  const toolsRef = useRef(null);
  const searchRef = useRef(null);
  const popRef = useRef(null);
  const searchId = useId();

  const visible = sortPieces(
    filterPieces(portfolio, { query, artistIds, tags, placements, sizes: sizeIds }),
    sort,
  );
  const openPiece = visible.find((piece) => piece.id === openId) ?? null;
  const filtering =
    query.trim() !== "" ||
    artistIds.length > 0 ||
    tags.length > 0 ||
    placements.length > 0 ||
    sizeIds.length > 0;

  useEffect(() => {
    if (openId && !visible.some((piece) => piece.id === openId)) setOpenId("");
  }, [openId, visible]);

  useEffect(() => {
    if (!menu) return undefined;
    function onPointer(event) {
      if (!toolsRef.current?.contains(event.target)) setMenu("");
    }
    function onKey(event) {
      if (event.key === "Escape") setMenu("");
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    if (menu === "search") searchRef.current?.focus();
  }, [menu]);

  useEffect(() => {
    if (!menu) return undefined;
    const pop = popRef.current;
    if (!pop) return undefined;
    function fit() {
      const top = pop.getBoundingClientRect().top;
      const room = window.innerHeight - top - 12;
      pop.style.maxHeight = `${Math.max(0, Math.min(room, 544))}px`;
    }
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("scroll", fit, true);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("scroll", fit, true);
    };
  }, [menu]);

  function clearFilters() {
    setQuery("");
    setArtistIds([]);
    setTags([]);
    setPlacements([]);
    setSizeIds([]);
  }

  function openMenu(name) {
    setMenu((current) => (current === name ? "" : name));
  }

  const countLabel =
    visible.length === portfolio.length
      ? `${portfolio.length} pieces`
      : `${visible.length} of ${portfolio.length}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 animate-fadeIn md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl uppercase tracking-widest text-mystic-text md:text-4xl">
          Portfolio
        </h1>
        <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mystic-text/70 md:text-base">
          Finished tattoos from the studio. The film on the home page is a
          short selection of these.
        </p>
      </header>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="font-sans text-sm text-mystic-muted">{countLabel}</p>
        <div ref={toolsRef} className="portfolio-tools">
          {filtering ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mr-2 min-h-11 font-serif text-xs uppercase tracking-[0.16em] text-mystic-gold"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            className={query.trim() || menu === "search" ? "portfolio-tool is-on" : "portfolio-tool"}
            aria-label="Search"
            aria-expanded={menu === "search"}
            aria-controls="portfolio-search"
            onClick={() => openMenu("search")}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className={
              artistIds.length || tags.length || placements.length || sizeIds.length || menu === "filter"
                ? "portfolio-tool is-on"
                : "portfolio-tool"
            }
            aria-label="Filter"
            aria-expanded={menu === "filter"}
            aria-controls="portfolio-filter"
            onClick={() => openMenu("filter")}
          >
            <FilterIcon />
          </button>
          <button
            type="button"
            className={sort !== "newest" || menu === "sort" ? "portfolio-tool is-on" : "portfolio-tool"}
            aria-label="Sort"
            aria-expanded={menu === "sort"}
            aria-controls="portfolio-sort"
            onClick={() => openMenu("sort")}
          >
            <SortIcon />
          </button>

          {menu === "search" ? (
            <div id="portfolio-search" ref={popRef} className="portfolio-pop">
              <label htmlFor={searchId} className="font-serif text-xs uppercase tracking-[0.18em] text-mystic-muted">
                Search
              </label>
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Artist, style, keyword, placement, or size"
                className="mt-3 w-full min-h-11 border border-mystic-bg bg-mystic-bg px-3 font-sans text-sm text-mystic-text placeholder:text-mystic-muted focus:border-mystic-gold focus:outline-none"
              />
            </div>
          ) : null}

          {menu === "filter" ? (
            <div id="portfolio-filter" ref={popRef} className="portfolio-pop space-y-6">
              <Facet legend="Artist">
                <ChoiceRow
                  options={artists.map((artist) => ({ id: artist.id, label: artist.name }))}
                  selected={artistIds}
                  onToggle={(id) => setArtistIds((current) => toggle(current, id))}
                />
              </Facet>
              {portfolioFacets.map((facet) => (
                <Facet key={facet.id} legend={facet.label}>
                  {facet.id === "style" ? (
                    <StyleOptions
                      options={facet.options}
                      selected={tags}
                      onToggle={(id) => setTags((current) => toggle(current, id))}
                    />
                  ) : (
                    <ChoiceRow
                      options={facet.options}
                      selected={tags}
                      onToggle={(id) => setTags((current) => toggle(current, id))}
                    />
                  )}
                </Facet>
              ))}
              <Facet legend="Location">
                <ChoiceRow
                  options={locations}
                  selected={placements}
                  onToggle={(id) => setPlacements((current) => toggle(current, id))}
                />
              </Facet>
              <Facet legend="Size">
                <ChoiceRow
                  options={sizes}
                  selected={sizeIds}
                  onToggle={(id) => setSizeIds((current) => toggle(current, id))}
                />
              </Facet>
            </div>
          ) : null}

          {menu === "sort" ? (
            <div id="portfolio-sort" ref={popRef} className="portfolio-pop" role="radiogroup" aria-label="Sort">
              <div className="flex flex-col">
                {portfolioSorts.map((option) => {
                  const selected = sort === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setSort(option.id);
                        setMenu("");
                      }}
                      className={`min-h-11 px-1 text-left font-sans text-sm ${
                        selected ? "text-mystic-gold" : "text-mystic-text/80 hover:text-mystic-gold"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 font-sans text-sm font-light text-mystic-text/70">
          No pieces match.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {visible.map((piece) => {
            const name = artistName(piece.artistId);
            const caption = pieceCaption(piece);
            return (
              <li key={piece.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(piece.id)}
                  className="w-full text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-mystic-gold"
                >
                  <img
                    src={portfolioPhotos[piece.id]}
                    alt={piece.alt}
                    width={piece.width}
                    height={piece.height}
                    className="block h-auto w-full bg-mystic-card"
                    style={{ aspectRatio: `${piece.width} / ${piece.height}` }}
                  />
                  <span className="mt-3 block font-serif text-sm tracking-wide text-mystic-text">
                    {piece.title}
                  </span>
                  {name ? (
                    <span className="mt-1 block font-sans text-xs tracking-wide text-mystic-gold">
                      {name}
                    </span>
                  ) : null}
                  {caption ? (
                    <span className="mt-1 block font-sans text-xs text-mystic-muted">
                      {caption}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <PieceScreen
        open={openPiece !== null}
        src={openPiece ? portfolioPhotos[openPiece.id] : ""}
        alt={openPiece?.alt || ""}
        onClose={() => setOpenId("")}
      />
    </div>
  );
}
