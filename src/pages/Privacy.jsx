import { shopName } from "../data/brand";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl animate-fadeIn px-6 py-12 md:py-20">
      <h1 className="text-center font-serif text-3xl uppercase tracking-widest text-mystic-text">
        Privacy Policy
      </h1>
      <p className="mt-3 text-center font-sans text-xs uppercase tracking-[0.25em] text-mystic-gold">
        {shopName}
      </p>

      <div className="mt-12 space-y-8 font-sans text-sm font-light leading-relaxed text-mystic-text/80">
        <p>
          Mystic May Tattoo is at 23239 NY 342, Watertown, NY 13601. To reach
          the studio, text 315-775-3727.
        </p>
        <p>
          This site does not ask you to create an account. The booking form
          builds a text message and opens the messaging app on your phone. The
          studio does not store that form on the website.
        </p>
        <p>
          When an artist connects a TikTok account, the site's server stores
          that connection's access token and refresh token. Those tokens stay
          on the server. Visitors do not receive them. The server copies the
          public cover image of each video so the site can show it, and stores
          the caption line and the link back to that video. A tap on a cover
          opens TikTok. Private TikTok videos are not requested.
        </p>
        <p>
          When someone connects an Instagram professional account, or the
          studio Facebook page, the server stores that connection's access
          token the same way. It copies a still of each public post and the
          caption line. A tap opens that post. Private posts are not requested.
        </p>
        <p>
          Until an account is connected, that section shows sample covers. A
          sample cover is labeled Sample. It is not a post from the studio. A
          tap opens that platform.
        </p>
        <p>
          The studio does not sell personal information. This page describes
          what the site itself does with information.
        </p>
      </div>
    </div>
  );
}
