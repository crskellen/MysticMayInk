# SEO optimization

Status: the technical search and AI-crawler work is built. The content below is not. It is the copy and photographs still to add. This file records that recommendation. It does not change the site.

Checked on 2026-10-29. `npm test` passed 45 tests, and `npm run build` prerendered all six routes. Headless Chrome against the local preview confirmed the tab behavior below. The site was not deployed from this machine, so a live Vercel response and a search-console index were not checked. A local build with no `SITE_URL` still omits the canonical URL, the Open Graph URL, and the sitemap.

These fixes make the current pages readable to a crawler. They do not make the site rank. Search and AI answers prefer a page that answers the query in plain language, with real photographs.

## What is already in place

- Routes are `/`, `/artists`, `/care`, `/book`, `/privacy`, and `/terms`. Nav and in-page links are real `<a href>` elements. `npm run build` prerenders one HTML file per route.
- Each build also writes a Markdown copy beside every page: `/index.md`, `/artists/index.md`, `/care/index.md`, `/book/index.md`, `/privacy/index.md`, and `/terms/index.md`. `public/llms.txt` links to those files and lists the six care sections, including the line that the guide is general information and not personal medical advice. Each HTML page points at its Markdown file with `rel="alternate" type="text/markdown"` and at `/llms.txt` with `rel="describedby"`.
- The document language is `en-US`, matching the structured data. The studio image in that data is an `ImageObject` for `/logo.jpg`.
- Titles, descriptions, the address and phone, the hours in the structured data, `robots.txt`, and the crawlable links were already in place.
- Artist and care tabs show one panel at a time. The other panels stay in the HTML with the `hidden` attribute, so a crawler that does not click can still read them. Artists opens on Meagan Caprice. `/artists#britt` selects Brittany Ostrander after the page loads. The Care Guide opens on “Before you book.” The “If you are unsure” note and the sources stay visible. Google’s spam policy allows tabbed content that visitors can open. The hidden text is the same text those tabs show.
- Sample feed cards are marked so Google is asked not to use them as the page snippet. Real posts should replace them by connecting the accounts.

When the site is deployed, set `SITE_URL` to the live `https` address. Submit the sitemap in Google Search Console and Bing Webmaster Tools.

## Content to add

Write this in the words a customer would search. Use only styles the studio and artist accounts actually show: botanical and floral, fine line, black and grey, blackwork, fantasy and anime, and cover-ups. Keep piercing, tarot, ornamental, micro-realism, and color out of the specialty claims. Leave review stars and map coordinates out of the page code. Skip a blog, and skip a separate page per style, until each style has its own photographs and a distinct explanation.

### Home (`/`)

Add one short paragraph under the hero.

- Say that the shop does custom tattoos in Watertown.
- Name the six styles above.
- Say that texting 315-775-3727 is a request until the studio agrees to a time.
- Keep Meagan Caprice and Brittany Ostrander off this page. Their names stay on Artists.

Put real photographs with the Specialized Disciplines cards. Alt text should describe the photograph, for example “Black and grey fern tattoo on a forearm.”

A separate homepage direction says the first screen should be a visual portfolio of finished shop work, with the address, phone, and social links appearing once further down rather than in that first screen. Reconcile this paragraph with that direction before writing it into the hero.

### Artists (`/artists`)

This is the page that should carry the longer text. Have each artist write two to four sentences.

- What they like to tattoo.
- What to put in the first text: placement, size, and reference images.
- For Brittany Ostrander, that art and tattoo design commissions are by direct message.

Use only the styles already in their bios.

- Meagan Caprice: owner. Botanical ferns and florals, black and grey, and cover-ups.
- Brittany Ostrander: tattoo artist. Fine line, blackwork, and black and grey, along with botanicals, bookish and fantasy pieces, and anime.

Add real photographs of their work. Leave out years tattooing, awards, and guest spots unless the artist supplies those facts.

### Book (`/book`)

Add one paragraph of the real sequence.

- The customer texts the shop.
- The shop sends the intake.
- The time is set when the studio agrees.

Publish a deposit or a rate only if the shop wants that number public. Leave the text message itself as it is. The drafted message still starts “Hey Meagan!”

### Care Guide (`/care`)

This is already the deepest page. Add a short note only where the shop’s own aftercare sheet differs, such as the product they tell clients to use or how long they want the covering left on. Leave the medical wording as it is. The artist’s written aftercare still comes first, and the page stays general information rather than personal medical advice.

## Off the site

These listings were not checked. If the studio does not already have them, create a Google Business Profile and a Bing Places listing with the same facts already printed in the footer.

- Name: Mystic May Tattoo Studios. Facebook’s page title is “Mystic May Tattoo.”
- Address: 23239 NY 342, Watertown, NY 13601. An older listing has used 28415 Steinhilber Rd, Evans Mills. Use the Watertown address that is on the site, on Instagram, and on the December 2025 TikTok.
- Phone: 315-775-3727.
- Hours: Tuesday through Saturday, 12:00 PM to 5:00 PM. Sunday and Monday by appointment.
- Category: tattoo shop. Instagram’s category says Tattoo & Piercing Shop. The website does not claim piercing. Confirm whether piercing is offered before adding it to a listing.
- Real photographs, and the live website URL once the site is deployed.

Ask clients to review the shop on Google. Do not copy those reviews onto the site as ratings markup.

Connect Instagram, TikTok, and Facebook so the captions on the site are real posts. Until an account is connected, that tab keeps its labeled samples.
