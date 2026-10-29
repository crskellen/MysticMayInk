# TikTok feed on the Mystic May site

Status: the parts that do not need TikTok or the artists are built. Real posts are not. The site has not been deployed, because the Vercel CLI is not installed here and no Vercel project is linked.

Instagram and Facebook are built to the same point. Their plans are `Grok/planning/instagram-feed.md` and `Grok/planning/facebook-feed.md`.

## What has been built

Checked with `npm test` (37 tests) and `npm run build` on 2026-10-29. Both succeeded. On an earlier local check, the home rail at 1280px shows two posts and at 390px shows one post with the next older post peeking in. The arrow on the right of the posts moves one post back in time. Meagan's tab starts at her 12:15 cover-up. Britt's tab starts at the moth.

- The card is a 9:16 cover, the TikTok mark, the @handle, and one caption line. The whole card is the link. Sample cards say Sample.
- Home and each artist page use the same rail, with platform tabs in place of the old heading. Home tabs are TikTok, Instagram, and Facebook. Artist tabs are TikTok and Instagram. Facebook is the shop page.
- Home reads the artist list and shows one merged feed as a horizontal rail. The newest post is first. Swiping the rail, or the arrow on the right of the posts, moves back in time. A phone shows one post, with the next older post peeking. From the small breakpoint up, two posts are in view. The sample rail starts at Britt's next morning, then Meagan 12:15, Britt 12:00, Britt 10:00, Meagan 9:00, Meagan's previous afternoon.
- Meagan's artist section shows only `@capriceink_`, newest first: 12:15, then 9:00, then the previous afternoon. Britt's section shows only `@inksbybritt`, newest first: next morning, then 12:00, then 10:00. The old placeholder gallery is gone. A new artist is a new entry in `src/data/artists.js`, which adds their tab and includes them in the Home merge.
- Desktop links are `https://www.tiktok.com/@handle/video/{id}` and open in a new tab. That is what the rendered page uses. iPhone stays on that same address in the same tab. Android uses the `com.zhiliaoapp.musically` intent with the website as the fallback. Those two are covered by the tests, not by a phone.
- The stand-in catalog is `src/feed/stand-in.js`. The sample photographs live in `src/assets/feed-samples/` and the page swaps them in through `src/feed/sample-covers.js`. Each card still says Sample. The page shows these until `/api/feed` returns `source: "catalog"`.
- `src/feed/sync.js` copies a new cover once, updates a caption without downloading the cover again, keeps stored covers when a list page does not finish, drops a video only after a finished list omits it, and saves a rotated refresh token. With no artist token it returns `no-token` and does not call TikTok. A finished TikTok list drops only TikTok posts for that handle. An Instagram post with the same @handle stays.
- `GET /api/feed` returns the stand-in catalog when the public Blob store is not configured. A real catalog response is cached for one hour. The stand-in response is cached for 60 seconds, so a later connection is not hidden behind the hour-long catalog cache.
- `GET /api/tiktok/sync` is the TikTok daily job (`vercel.json`, 08:00 UTC). `GET /api/instagram/sync` is 09:00 UTC and `GET /api/facebook/sync` is 10:00 UTC. Each answers 401 until `CRON_SECRET` is set and the request sends `Authorization: Bearer <that secret>`. Vercel Cron sends that header when the variable exists. Hobby allows 100 cron jobs, each at most once a day, and the start can fall anywhere in that hour (Vercel cron docs, 15 Jul 2026). A schedule that runs more than once a day is rejected at deploy.
- Privacy Policy is at `/privacy`. Terms of Service is at `/terms`. Both are linked in the footer, outside the phone menu. `vercel.json` rewrites those two paths to `index.html`.
- `src/main.jsx` imported a named `React` that the installed package does not export. The import is now `StrictMode` only, which is what let the production build succeed.

The public store token is `BLOB_PUBLIC_READ_WRITE_TOKEN`, or `BLOB_READ_WRITE_TOKEN` if only one public store is connected. The private store token is `BLOB_PRIVATE_READ_WRITE_TOKEN`. TikTok's app credentials are `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`. Instagram's are `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`. Facebook's are `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`. None of these are set. The two Blob stores have not been created.

The route that receives an Allow redirect and stores the token is not built, for TikTok, Instagram, or Facebook. Build that route after the developer app exists, and before anyone is asked to tap Allow.

## Still waiting on an account

- Deploy to Vercel. Build succeeds locally. Nothing has been uploaded.
- Create the public Blob store and the private Blob store, and set the tokens above.
- Set `CRON_SECRET` so the daily job is allowed to run.
- The TikTok developer account, the app, Login Kit, the Display API, sandbox, and review. That login belongs to the site builder.
- Meagan and Britt each tapping Allow. That stays after the app is Live.

TikTok is the feed. Each video is stored as a still cover that we keep, and a tap opens that video in the TikTok app when the phone has it.

The home feed has three tabs: TikTok, Instagram, and Facebook. An artist feed has TikTok and Instagram. Facebook is the shop page, so it is not on an artist page. The hero pills and footer menus stay as links. The Instagram and Facebook copiers are built to the same point as this one. Until an account is connected, that tab keeps its labeled samples. Connecting TikTok does not remove the Instagram or Facebook samples.

## What appears on the site

The card is the opening frame of the video. That frame is the cover TikTok shows before playback.

TikTok's Display API returns that cover as a still image (`cover_image_url`). TikTok's own docs state that this link expires after 6 hours. During import we download it once and store our own copy in Vercel Blob. The page then uses our copy. That file stays until we delete it. We never ask TikTok for that image again.

The card is labeled as a TikTok post:

- TikTok's mark
- the @handle
- one short line of the caption

The card does not include:

- the like column
- comments
- the sound chip
- a player

Those only exist on TikTok. A frozen like count would be wrong, because we are not re-reading stats. The whole card is the button.

### Which accounts, and where

Each artist section shows that artist's TikTok feed and no one else's. Home shows one merged feed of every artist, in the order the posts were made.

The artist list is the only source. Home does not keep a separate account list. A TikTok account that is not on an artist does not enter the merge. Adding an artist later is how a new feed joins Home.

| Place | Whose posts | Order |
|---|---|---|
| Home | Every artist in the artist list, merged into one feed | Newest post first. Scrolling the rail goes back in time |
| Artists, Meagan | `@capriceink_` only | Same rail, her posts only |
| Artists, Britt | `@inksbybritt` only | Same rail, her posts only |
| A future artist section | That artist's TikTok only | Same rail, their posts only |

`@capriceink_` is one account with two labels in `src/data/socials.js`: the shop feed and Meagan Caprice. The shop entry is marked "Shop feed · Meagan Caprice". It is Meagan's artist feed. It is not a third source. Merging "shop" plus "Meagan" would show every one of her videos twice. The merge includes `@capriceink_` once, as Meagan.

Today the artist list is Meagan (`@capriceink_`) and Britt (`@inksbybritt`). Those two are not named in the Home layout. Home reads the list.

### Home order

Sort key is TikTok's `create_time`: UTC unix seconds for when the video was posted. Compare the timestamps. Do not sort by handle, and do not sort by a formatted clock string.

`postsForArtists` keeps that key earliest-first, then breaks ties by video id ascending. The page does not render that array from the front. `newestFirst` reverses it for the rail, so the first card is the newest post and each step along the rail is an older one. An earlier version of this plan showed the earliest post first, in a grid. That display was replaced on 2026-10-29. The sort key did not change.

The rail is horizontal. On a phone, one post fills the rail and the next older post peeks in from the right. From the `sm` breakpoint up, two posts are in view. A left arrow and a right arrow sit centered on the sides of the posts. The left arrow moves toward newer posts. The right arrow moves toward older posts. Swiping the rail does the same. There is no post count and no paragraph under the heading. The page itself still scrolls vertically past the rail.

For the four-post example, the rail shows:

| As you move along the rail | When | Who |
|---|---|---|
| First card | 12:15 | Meagan |
| Next | 12:00 | Britt |
| Next | 10:00 | Britt |
| Last | 9:00 | Meagan |

The stand-in catalog also has a post from the previous afternoon and one from the next morning, so the sample rail starts at Britt's next morning and ends at Meagan's previous afternoon.

The same reversal is used on an artist page after the other artists are filtered out. On Meagan's page the 12:15 card comes before her 9:00 card, and Britt's cards are absent.

Home shows every stored post from every artist. It is not a short row of the latest few, and it is not trimmed to the two cards that fit on screen. The rest are further along the rail. An artist page shows every stored post from that artist. The rail grows as posts are copied.

### Adding an artist later

A new artist joins the home feed by being added as an artist. No Home-only change.

1. Add them to the artist list, with their TikTok handle.
2. They authorize the TikTok app once, with `video.list`.
3. Discovery copies their covers into the same catalog, tagged with their handle.
4. The next catalog read includes them. Their posts land in the Home sequence by `create_time`, among the posts already there.
5. Their own artist section shows only their posts.

Until step 2 has happened, they have no videos to merge. The other artists' feeds keep showing.

### What stays a link

These pills stay outbound links. They are not replaced by the feed tabs:

- Home hero pills: shop Instagram `@mysticmaytattoo`, shop TikTok `@capriceink_`, shop Facebook.
- Artist pages: Meagan's Instagram `@capriceink` and TikTok `@capriceink_`; Britt's Instagram `@inksbybritt` and TikTok `@inksbybritt`.
- Footer menus: Instagram (shop, Meagan, Britt), Facebook (shop page), TikTok (shop `@capriceink_`, Britt).

The same rail shows each tab. Home Instagram is `@mysticmaytattoo` plus each artist's Instagram, newest first. An artist Instagram tab is only that artist's account: Meagan `@capriceink`, Britt `@inksbybritt`. Home Facebook is the shop page only. How those posts are copied, and who taps Allow, is in the Instagram plan and the Facebook plan. The samples stay labeled Sample until that platform has synced.

## What still runs in the background

The pictures do not expire and do not get re-downloaded. Finding a video posted this morning is a separate, small check.

### Discovery, about once an hour

A Vercel function asks TikTok for the latest video list (`POST /v2/video/list/`, newest first, public videos only, max 20 per page).

For any video id we have never stored:

1. Copy the cover immediately, while TikTok's link is still inside its 6-hour life.
2. Add a row to our catalog.

Covers we already have are left alone. Do not re-download them.

Caption text can be updated on that same pass. A caption is a few words, not the image. If the creator edits the caption on TikTok, the next discovery pass may update the one line on the card. It still does not touch the stored image.

If TikTok is unreachable, the site keeps serving the covers we already stored. A dead token or a failed list call must not blank the gallery.

### Two stores

| Store | Access | Holds |
|---|---|---|
| Public Vercel Blob | Anyone with the URL | Cover images, and the catalog the site reads |
| Private Vercel Blob | Server only | TikTok access token and refresh token |

Tokens must never be written to the public store, to the client, or into the catalog.

### Tokens

TikTok's access token lasts 24 hours (`expires_in` of 86400 seconds). The refresh token lasts 365 days (`refresh_expires_in` of 31536000 seconds). Refresh does not need the access token to still be valid. The refresh token is what we send.

TikTok sometimes returns a different refresh token when we use one. The new value has to be saved, replacing the old one. If we keep using the previous refresh token after TikTok has rotated it, the next refresh fails.

A daily job on Vercel's free (Hobby) plan is enough to keep the token alive. Hobby cron runs at most once a day, and a schedule more frequent than that is rejected at deploy. Daily is acceptable here because a missed access-token window is repaired by the refresh token, and the refresh token lasts a year.

Someone has to log in with TikTok again only if that refresh is left unused for a year.

The same function that looks for new videos should refresh the access token when it is expired or near expiry, then call the video list. Persist both tokens after every refresh.

### Catalog cache

The catalog file itself must be cached for about an hour.

Blob's default cache is up to a month. A month-long cache on the catalog would hide new posts even though the images were already copied. Set a short cache on the catalog (about an hour).

Cover images are the opposite. Each cover's path includes the video id, the bytes do not change, and the cache on those files should be long. A long image cache is safe because we never replace those bytes in order to "refresh" them.

### What we store per video

Each catalog row needs at least:

- TikTok video id
- account handle (the artist who posted it; today `@capriceink_` or `@inksbybritt`)
- our Blob URL for the cover
- the stable video address `https://www.tiktok.com/@handle/video/{id}`
- the caption line we show
- posted time (`create_time`), which is the sort key for Home and for each artist page

Do not store TikTok's `cover_image_url` as the thing the page displays. That URL is discarded after the copy succeeds. Do not store like counts, comment counts, share counts, or view counts. We are not re-reading stats, and a frozen number would be wrong.

`embed_link` and `embed_html` are for playing the video inside our page. We do not use them.

### Storage size

A cover is a still, not the video file. Hundreds of them fit in the free Blob allowance: 1 GB stored and 10 GB transferred per month on Hobby. Simple operations include the first 10,000 per month. Advanced operations (uploads) include the first 2,000 per month.

Copying the actual video is the wrong fit:

- The Display API does not give us a lasting video file.
- Playback is what the tap is for.
- Video files would spend the Hobby allowance.

If Hobby Blob limits are exceeded, Vercel pauses Blob access until the usage window resets. That is another reason to store stills only.

### Deleted videos

If a video is deleted on TikTok, our cover remains, and the link opens TikTok's unavailable screen. The next list check can drop that card when the id is no longer in the list. Dropping the card is a catalog edit. It is not a reason to re-download covers that are still listed.

## Opening the app

The link we store is TikTok's own video address:

```
https://www.tiktok.com/@handle/video/{id}
```

Build it from the handle and the video id. Do not store a `vm.tiktok.com` or `vt.tiktok.com` short link, and do not keep TikTok's `utm_*` parameters as part of the address we give the visitor. TikTok's docs say `share_url` behaves differently on a phone than on a desktop. That difference is the handoff we want, and the canonical `/@handle/video/{id}` address is the one that carries it.

### Desktop

The click opens that address in a new browser tab.

### iPhone

The click goes to that same address in the same tab. iOS can then open the TikTok app through its universal link. A new tab blocks that handoff, so `target="_blank"` must not be used on iPhone.

If TikTok is not installed, the address is the normal website, so the tap still works.

### Android

The click uses an intent aimed at TikTok's app and, if the app is missing, falls back to that same website address. The package to pin is `com.zhiliaoapp.musically`, which is the US TikTok package. The fallback is the video page, not the Play Store. Watertown visitors are in the US, so this is the package to use.

The intent shape:

```
intent://www.tiktok.com/@handle/video/{id}#Intent;scheme=https;package=com.zhiliaoapp.musically;S.browser_fallback_url=https://www.tiktok.com/@handle/video/{id};end
```

### What we cannot force

We cannot force the app to open.

- Android has a per-app setting, "open supported links". If it is off, the tap stays in the browser.
- A tap inside another app's built-in browser often stays in that browser. Instagram, Facebook, and Gmail are the usual cases. Universal links and app links are not honored from those webviews.

### Do not use a custom scheme

Do not use `snssdk1233://` (or `aweme://`) as the link. If TikTok is not installed, the tap fails. The https address is the link that still works when the app is absent.

## Before any of this can run

TikTok has to approve a developer app with Login Kit and the Display API. That approval is the long pole for real posts. The card, the galleries, and an empty catalog can be built first. Who does what, and when, is the last section of this file.

When the app is approved, each artist authorizes it once. The permission on that authorization is `video.list`. Meagan authorizes `@capriceink_` once. Britt authorizes `@inksbybritt` once. A later artist authorizes their own account once. There is no separate shop login, because the shop TikTok is Meagan's account.

Tokens from that login are stored only in the private Blob store.

## Site work after approval

Three pieces, and no more than that for this plan:

1. The card, as specified above.
2. The copier: hourly discovery, copy-once covers, catalog, token refresh, private and public stores.
3. The galleries. Home is one merged feed of every artist, newest post first, on a horizontal rail. Scrolling that rail goes back in time. Each artist section is that artist's feed only, on the same kind of rail. The merge reads the artist list, so a later artist is included without a change to Home.

The artist galleries replace the current placeholder cards (category label and title, no photograph). Home does not have a gallery today; the merged feed is new.

## Rules that are easy to lose

- Copy the cover once. Never re-download a cover we already stored.
- Download the cover during discovery, inside the 6-hour TTL. After that, our Blob URL is the only image URL.
- The catalog cache is about an hour. The image cache is long. Blob's default of up to a month applies to neither by accident: set both on purpose.
- Caption text may update on the discovery pass. The image may not.
- Do not show likes, comments, views, shares, or a player.
- The whole card is one link.
- Home is every artist, one feed. The stored order is `create_time` ascending. The rail shows the reverse: 12:15 Meagan, then 12:00 Britt, then 10:00 Britt, then 9:00 Meagan. Scrolling moves toward the older posts.
- An artist section shows only that artist's posts, newest first on the same kind of rail.
- The artist list is the source. Do not hardcode Meagan and Britt on Home. A new artist is added to the list, authorizes once, and their posts join the merge by time.
- `@capriceink_` is Meagan's account and the shop account. Include it once. Do not merge shop and Meagan as two feeds.
- Home and each artist page show every stored post in that order. Do not trim Home to a latest-few row.
- Home tabs are TikTok, Instagram, and Facebook. Artist tabs are TikTok and Instagram. Facebook is the shop page and is not on an artist page.
- Hero and footer pills stay as links. A platform's samples stay until that platform is listed in the catalog's `syncedPlatforms`.
- A TikTok sync must not delete an Instagram or Facebook post, including one that uses the same @handle.
- Desktop: new tab. iPhone: same tab, https URL. Android: intent to `com.zhiliaoapp.musically`, website fallback.
- Never `target="_blank"` on a phone. Never `snssdk1233://`.
- Access token 24 hours. Refresh token 365 days. Save the new refresh token when TikTok rotates it.
- Tokens in the private store. Covers and catalog in the public store.
- Hobby cron is daily, and that daily job is for keeping the refresh token alive. New videos come from the hourly check, which Hobby cron cannot do. The hourly check is the function running when the catalog is stale.
- If TikTok is down, serve the last stored covers.
- A deleted TikTok stays as a cover until the next list check sees the id is gone, then the card can be dropped.
- Do not copy the video file.
- The card and the galleries can be built before anyone connects TikTok. Real covers arrive only after the app is Live and each artist has authorized `video.list`. The full sequence is in the last section.

## Who does what, and when

The feed can be built before anyone connects TikTok. The site can be built and deployed now, with empty feeds, and no one at the shop has to log into anything. Real TikTok posts show up only after a later approval, and then only after each artist taps Allow once.

There is one app, owned by the person building the site. Meagan and Britt do not create developer accounts, do not create apps, and never see a token.

### What can be done now

This needs no TikTok account and no one at the shop. It is built. See "What has been built" at the top.

- The card: cover image, TikTok mark, @handle, one caption line, the whole card as the link.
- Home as one merged feed, newest post first, on a horizontal rail that scrolls back in time. Each artist section filtered to that artist, on the same kind of rail.
- The artist list as the only source, so a future artist joins Home by being added to that list.
- Desktop, iPhone, and Android click behavior.
- The catalog shape, the public and private Blob stores, and the copier that refuses to run when no token is stored.
- A stand-in catalog so the layout can be reviewed before any real cover exists.

Until a real token exists, those rails stay empty or show the stand-ins. They cannot show Meagan's or Britt's actual videos.

### What the site builder does

1. **Build and deploy the site.** No TikTok login. Vercel can host it with the feeds empty.

2. **Put two pages on that public site before asking TikTok for access.** TikTok's app review, last updated 4 August 2026, requires a finished public website, not a landing page, with a Privacy Policy and Terms of Service visible on the page without opening a menu. The links have to work. Those pages are now at `/privacy` and `/terms`, linked from the footer. They are on the local site only until the site is deployed. Review also says apps still in development are not approved, and apps for private or personal use are not approved. A public studio site fits the second rule. Approval is still a manual decision, and TikTok does not guarantee a timeline.

3. **Open one developer account.** Go to [developers.tiktok.com](https://developers.tiktok.com) and sign in with a TikTok account the site builder controls. That account owns the app. It does not have to be `@capriceink_` or `@inksbybritt`. Create one app. An organization is recommended and is not required. The app name is shown on the consent screen, must match the studio name, and must not be named after TikTok. Also upload an icon and a short description of the site.

4. **Turn on two products and nothing else.** Login Kit, and the Display API. The scopes are `user.info.basic` (name and avatar) and `video.list` (the list of that user's public videos). Posting permissions are not needed. For the web app, register one redirect address: `https`, a fixed path, no query string. TikTok gives a client key and a client secret. The secret stays in Vercel, on the server. It never goes in the page, in git, or to the artists.

5. **Optional test before review, still without the shop.** Sandbox mode lets you try the login without approval. You can attach up to 10 TikTok accounts as target users, and each one is added by logging into that account. The site builder's own TikTok is enough to prove the copier. The shop accounts can wait. Adding a target user can take up to an hour to show on the app page.

6. **Submit the app for review.** Write how Login Kit and `video.list` are used, and upload at least one demo video of the whole flow, up to five videos, 50 MB each. Verify the site URL in the portal before submitting. The review FAQ says this often takes several days to two weeks. The developer guidelines say there is no promised timeline. Production access starts when the app status is Live. Until then the production APIs stay closed. Sandbox is the only way to call them before that.

7. **After TikTok approves the app, send each artist one link.** The server catches the return, exchanges it for tokens, and stores them in the private Blob store. A daily job refreshes the 24-hour access token using the 365-day refresh token. The hourly check then copies new covers. Do this once per artist.

### What Meagan and Britt do

Nothing during the build. Nothing during the developer signup. Nothing during review, unless one of them is asked to be the sandbox account in the demo video. The site builder's own TikTok can play that part.

After the app is Live, each artist does one thing, on her own phone:

1. Open the link the site builder sends.
2. Log in to her own TikTok. Meagan logs into `@capriceink_`. Britt logs into `@inksbybritt`. Someone else cannot approve this for them.
3. Tap Allow for the two permissions: basic profile, and the list of public videos.

That is the whole task. They do not copy a code, do not create a password for the site, and do not manage a token. The videos the feed copies are public ones. A private video is not in `video.list`.

They repeat this only if the refresh token sits unused for a year, or if they remove the app from TikTok's connected-apps settings. A new artist later does the same single approval after being added to the artist list.

### What the tokens are

| Item | Who it belongs to | How long it lasts | Where it lives |
|---|---|---|---|
| Client key and client secret | The app | Until they are rotated | Secret only on the Vercel server |
| Login approval | That artist's TikTok | Until they revoke it | TikTok's consent screen |
| Access token | That artist, via the app | 24 hours | Private Blob store |
| Refresh token | That artist, via the app | 365 days | Private Blob store |

The access token is what the hourly job uses to ask for new videos. The refresh token is what the daily job uses to get a new access token without bothering the artist. If TikTok hands back a new refresh token, the server saves the new one.

The docs read for Login Kit and the Display API do not list a charge for this use. That is not a promise that TikTok will never bill for it.
