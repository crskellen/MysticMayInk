import { shopName } from "../data/brand";

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl animate-fadeIn px-6 py-12 md:py-20">
      <h1 className="text-center font-serif text-3xl uppercase tracking-widest text-mystic-text">
        Terms of Service
      </h1>
      <p className="mt-3 text-center font-sans text-xs uppercase tracking-[0.25em] text-mystic-gold">
        {shopName}
      </p>

      <div className="mt-12 space-y-8 font-sans text-sm font-light leading-relaxed text-mystic-text/80">
        <p>
          This website describes Mystic May Tattoo, the artists who work
          there, and how to request a session. Using the site means you have
          read these terms.
        </p>
        <p>
          A booking request opens a text to the studio. It is not a confirmed
          appointment until the studio replies and agrees to a time.
        </p>
        <p>
          Covers shown from TikTok, Instagram, and Facebook are still images.
          Playback, likes, and comments stay on that platform, and a tap
          takes you there. Sample covers are placeholders for layout. They
          are marked Sample and are not studio work.
        </p>
        <p>
          The studio may change what this site shows, including which posts
          appear, as accounts post or remove posts on TikTok, Instagram, and
          Facebook.
        </p>
      </div>
    </div>
  );
}
