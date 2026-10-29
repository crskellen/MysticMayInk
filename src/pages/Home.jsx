import SocialFeed from '../components/SocialFeed';
import WorkFilmstrip from '../components/WorkFilmstrip';
import { artists } from '../data/artists';
import { useFeed } from '../feed/useFeed.js';

export default function Home() {
  
  // Shop styles named in public captions from the studio accounts.
  const shopStyles = [
    {
      title: "Botanical & Floral",
      desc: "Ferns, florals, woodland botanicals, and small animals.",
    },
    {
      title: "Fine Line",
      desc: "Fine line pieces, including bookish flash.",
    },
    {
      title: "Black & Grey",
      desc: "Black and grey, including shaded pieces.",
    },
    {
      title: "Blackwork",
      desc: "Blackwork, including anime pieces.",
    },
    {
      title: "Fantasy & Anime",
      desc: "Bookish and fantasy pieces, and anime.",
    },
    {
      title: "Cover-Ups",
      desc: "Cover-up work, including a posted leg piece.",
    },
  ];

  const catalog = useFeed();

  return (
    <div className="animate-fadeIn">
      
      <WorkFilmstrip />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SocialFeed
          posts={catalog.posts}
          artists={artists}
          platforms={['tiktok', 'instagram', 'facebook']}
          includeShop
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-mystic-text">
            Specialized Disciplines
          </h2>
          <span className="block h-[1px] w-12 bg-mystic-gold mx-auto mt-4 shadow-gold-glow" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopStyles.map((style) => (
            <div
              key={style.title}
              className="rounded border border-mystic-bg bg-mystic-card p-6 shadow-sm transition-all duration-500 hover:border-mystic-gold/30 hover:shadow-gold-glow"
            >
              <h3 className="font-serif text-lg tracking-wide text-mystic-text">
                {style.title}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-mystic-text/60">
                {style.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
