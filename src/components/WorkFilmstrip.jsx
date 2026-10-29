import { useEffect, useLayoutEffect, useRef, useState } from "react";
import peony from "../assets/feed-samples/meagan-peony.jpg";
import fox from "../assets/feed-samples/facebook-fox.jpg";
import blackwork from "../assets/feed-samples/britt-blackwork.jpg";
import olive from "../assets/feed-samples/britt-olive.jpg";
import fern from "../assets/feed-samples/meagan-fern.jpg";
import dagger from "../assets/feed-samples/britt-dagger.jpg";
import coverup from "../assets/feed-samples/meagan-coverup.jpg";
import moth from "../assets/feed-samples/britt-moth.jpg";
import { shopName } from "../data/brand";

const pieces = [
  { src: peony, style: "Botanical & Floral", alt: "Botanical and floral tattoo", width: 720, height: 1280 },
  { src: fox, style: "Black & Grey", alt: "Black and grey tattoo", width: 832, height: 1248 },
  { src: blackwork, style: "Blackwork", alt: "Blackwork tattoo", width: 720, height: 1280 },
  { src: olive, style: "Fine Line", alt: "Fine line tattoo", width: 720, height: 1280 },
  { src: fern, style: "Botanical & Floral", alt: "Botanical and floral tattoo", width: 720, height: 1280 },
  { src: dagger, style: "Fine Line", alt: "Fine line tattoo", width: 832, height: 1248 },
  { src: coverup, style: "Cover-Ups", alt: "Cover-up tattoo", width: 720, height: 1280 },
  { src: moth, style: "Fine Line", alt: "Fine line tattoo", width: 720, height: 1280 },
];

function framesOf(film) {
  return Array.from(film.querySelectorAll("[data-piece]"));
}

function nearest(film, frames) {
  const origin = film.scrollLeft + film.clientWidth / 2;
  let best = frames[0];
  let bestDist = Infinity;
  for (const frame of frames) {
    const point = frame.offsetLeft + frame.offsetWidth / 2;
    const dist = Math.abs(point - origin);
    if (dist < bestDist) {
      bestDist = dist;
      best = frame;
    }
  }
  return best;
}

function targetLeft(film, frame) {
  return frame.offsetLeft - (film.clientWidth - frame.offsetWidth) / 2;
}

function applyLayout(film) {
  const availW = film.clientWidth;
  const availH = film.clientHeight;
  const frames = framesOf(film);
  if (availW < 40 || availH < 40 || frames.length === 0) return false;
  const rail = Number.parseFloat(getComputedStyle(film).getPropertyValue("--rail")) || 32;
  const rebate = Number.parseFloat(getComputedStyle(film).getPropertyValue("--rebate")) || 10;
  const innerH = Math.max(80, availH - rail * 2);
  // A short sliver of the neighbor, or empty film when a side has no piece.
  const desiredPeek = Math.round(Math.min(88, Math.max(48, availW * 0.06)));
  const maxW = Math.max(120, availW - desiredPeek * 2 - rebate * 2);
  const widest = Math.max(...frames.map((frame) => Number(frame.dataset.aspect)));
  let bandH = innerH;
  if (bandH * widest > maxW) bandH = Math.round(maxW / widest);
  for (const frame of frames) {
    const aspect = Number(frame.dataset.aspect);
    const width = Math.round(bandH * aspect);
    frame.style.width = `${width + rebate * 2}px`;
    frame.style.height = `${bandH}px`;
  }
  const side = Math.max(0, (availW - frames[0].offsetWidth) / 2);
  const peek = Math.min(desiredPeek, side);
  film.style.setProperty("--lead", `${frames[0].offsetWidth}px`);
  film.style.setProperty("--tail", `${frames[frames.length - 1].offsetWidth}px`);
  film.style.setProperty("--peek", `${Math.round(peek)}px`);
  film.style.setProperty("--fade", `${Math.min(20, Math.round(peek / 2))}px`);
  const stock = film.querySelector(".work-film-stock");
  if (stock) {
    const top = Math.max(0, (availH - bandH) / 2 - rail);
    stock.style.top = `${top}px`;
    stock.style.height = `${bandH + rail * 2}px`;
    stock.style.bottom = "auto";
    stock.style.width = `${film.scrollWidth}px`;
  }
  return true;
}

export default function WorkFilmstrip() {
  const filmRef = useRef(null);
  const styleRef = useRef(null);
  const indexRef = useRef(0);
  const dragging = useRef(false);
  const layoutKey = useRef("");
  const [active, setActive] = useState(0);
  const [hint, setHint] = useState("Drag");
  const [hintOn, setHintOn] = useState(true);

  function placeStyle(film) {
    const node = styleRef.current;
    const frames = framesOf(film);
    const frame = frames[indexRef.current];
    if (!node || !frame) return;
    film.style.setProperty("--focus", `${frame.offsetWidth}px`);
    const center = frame.offsetLeft - film.scrollLeft + frame.offsetWidth / 2;
    node.style.left = `${center}px`;
  }

  useLayoutEffect(() => {
    const film = filmRef.current;
    if (!film || !applyLayout(film)) return;
    film.classList.toggle("is-dragging", dragging.current);
    const frames = framesOf(film);
    const key = `${film.clientWidth}x${film.clientHeight}:${frames[0].offsetWidth}`;
    if (!dragging.current && layoutKey.current !== key) {
      layoutKey.current = key;
      const frame = frames[Math.min(indexRef.current, frames.length - 1)];
      film.scrollLeft = targetLeft(film, frame);
    }
    placeStyle(film);
  });

  useEffect(() => {
    const film = filmRef.current;
    if (!film) return undefined;
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showHint = () => setHint(coarse.matches ? "Swipe" : "Drag");
    showHint();
    coarse.addEventListener("change", showHint);

    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;
    let wheelLock = false;
    let settling = false;
    let touchMoved = false;

    const reduced = () => reduce.matches;

    function goTo(frame) {
      const frames = framesOf(film);
      indexRef.current = frames.indexOf(frame);
      setActive(indexRef.current);
      settling = true;
      film.scrollTo({
        left: targetLeft(film, frame),
        behavior: reduced() ? "auto" : "smooth",
      });
      window.setTimeout(() => {
        settling = false;
      }, reduced() ? 0 : 480);
    }

    function onPointerDown(event) {
      if (event.pointerType === "touch") {
        touchMoved = true;
        return;
      }
      if (event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = film.scrollLeft;
      moved = 0;
      dragging.current = true;
      film.classList.add("is-dragging");
      film.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      film.scrollLeft = startScroll - dx;
    }

    function onPointerUp(event) {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      dragging.current = false;
      film.classList.remove("is-dragging");
      if (moved > 6) {
        setHintOn(false);
        goTo(nearest(film, framesOf(film)));
      }
    }

    function onWheel(event) {
      const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      if (Math.abs(dominant) < 4) return;
      const frames = framesOf(film);
      const index = frames.indexOf(nearest(film, frames));
      const nextIndex = index + (dominant > 0 ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= frames.length) return;
      event.preventDefault();
      if (wheelLock) return;
      goTo(frames[nextIndex]);
      setHintOn(false);
      wheelLock = true;
      window.setTimeout(() => {
        wheelLock = false;
      }, reduced() ? 0 : 420);
    }

    function onScroll() {
      if (touchMoved) {
        touchMoved = false;
        setHintOn(false);
      }
      if (!dragging.current && !settling) {
        const frames = framesOf(film);
        const index = frames.indexOf(nearest(film, frames));
        if (index >= 0 && index !== indexRef.current) {
          indexRef.current = index;
          setActive(index);
        }
      }
      placeStyle(film);
    }

    function onKeyDown(event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const frames = framesOf(film);
      const index = frames.indexOf(nearest(film, frames));
      const nextIndex = index + (event.key === "ArrowRight" ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= frames.length) return;
      event.preventDefault();
      setHintOn(false);
      goTo(frames[nextIndex]);
    }

    function onResize() {
      if (!applyLayout(film) || dragging.current) return;
      const frames = framesOf(film);
      const frame = frames[Math.min(indexRef.current, frames.length - 1)];
      film.scrollLeft = targetLeft(film, frame);
      placeStyle(film);
    }

    film.addEventListener("keydown", onKeyDown);
    film.addEventListener("pointerdown", onPointerDown);
    film.addEventListener("pointermove", onPointerMove);
    film.addEventListener("pointerup", onPointerUp);
    film.addEventListener("pointercancel", onPointerUp);
    film.addEventListener("wheel", onWheel, { passive: false });
    film.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(film);

    return () => {
      coarse.removeEventListener("change", showHint);
      film.removeEventListener("keydown", onKeyDown);
      film.removeEventListener("pointerdown", onPointerDown);
      film.removeEventListener("pointermove", onPointerMove);
      film.removeEventListener("pointerup", onPointerUp);
      film.removeEventListener("pointercancel", onPointerUp);
      film.removeEventListener("wheel", onWheel);
      film.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="work-stage" aria-labelledby="home-title">
      <h1 id="home-title" className="sr-only">{shopName}</h1>
      <div
        ref={filmRef}
        className="work-film is-wide"
        tabIndex={0}
        role="region"
        aria-label="Selected work. Drag, or use the arrow keys."
      >
        <div className="work-film-stock" aria-hidden="true" />
        {pieces.map((piece) => (
          <figure
            key={piece.src}
            data-piece=""
            data-style={piece.style}
            data-aspect={piece.width / piece.height}
            className="work-frame"
            style={{ "--ratio": `${piece.width} / ${piece.height}` }}
          >
            <img src={piece.src} alt={piece.alt} draggable="false" />
          </figure>
        ))}
      </div>
      <div className="work-film-meta">
        <p ref={styleRef} className="work-film-style" aria-live="polite">{pieces[active].style}</p>
        <p className={hintOn ? "work-film-hint" : "work-film-hint is-hidden"}>{hint}</p>
      </div>
    </section>
  );
}
