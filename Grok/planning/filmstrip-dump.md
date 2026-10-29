# Homepage filmstrip from a dump folder

Status: proposed, and partly superseded on 2026-10-29. Nothing in this file is built. The homepage still reads the eight stand-ins.

The dump still copies into Blob on the Hobby daily cron, with the same Drive variables, file types, and 1600-pixel JPEGs described below. A new file is not published, and folder names are not the style line. Tagging, the queue, and what reaches the filmstrip and `/portfolio` are in `Grok/planning/portfolio-tagging.md`.

Checked 2026-10-29 against the repo and against Vercel's Hobby, cron, and Blob docs (cron page last updated 15 Jul 2026, Hobby page 14 Sep 2026, Blob pricing 23 Sep 2026).

## What the filmstrip does today

`WorkFilmstrip.jsx` builds its frames once, at load, from `openingPieces()` in `src/data/portfolio.js` and the matching imports in `src/data/portfolio-photos.js`. Those imports are the JPEGs in `src/assets/feed-samples/`. `opening` greater than 0 puts a piece on the strip, in that order. The eight are peony, fox, blackwork, olive, fern, dagger, coverup, moth. `test/portfolio.test.js` locks that order.

Each frame needs an id, an image address, a width and height (the frame uses the ratio), a style line, and alt text. The style line is the six shop names: Botanical & Floral, Fine Line, Black & Grey, Blackwork, Fantasy & Anime, Cover-Ups. A piece with no `filmStyle` is not on the strip today.

`npm run build` copies those imported files into the published site. Vercel serves that build. A function cannot change those files. It can write to `/tmp`, and that directory disappears when the invocation ends.

## Where the new photos live

The shop keeps dropping files in one Google Drive folder, or one Dropbox folder. That folder is the dump. It stays in their account.

The site reads a copy in the Blob store this project already depends on (`@vercel/blob`, the same store as `feed/catalog.json` and `covers/{platform}/{id}.jpg`). The daily job writes web-sized JPEGs into a private inbox. Publishing those files, and the lists the filmstrip and `/portfolio` read, happens after tagging. That flow is `Grok/planning/portfolio-tagging.md`.

With no dump configured, and on `npm run dev` where the API routes do not exist, the strip stays the eight stand-ins. That is the same shape as `useFeed()`: the page has the stand-ins, and it replaces them only when a real catalog is there.

A directory in the repo, such as `public/film/` or `src/assets/film/`, cannot be that copy. The schedule would have to commit the photos and trigger a new deploy to change them. Every photo would stay in git history, and each new file would rebuild the site. This plan does not do that.

`portfolio.js` stays the stand-in catalog until a tagged piece is saved. A dropped file has no artist, style, placement, or size, so the copy job does not put it on the site.

The film-stock frame, the peek, the centered style line, drag and swipe, and the absence of autoplay stay as they are.

## What the shop puts in the folder

The configured folder is the inbox, not the public set. The job does not watch the rest of the Drive or Dropbox account. A person marks each file as a piece or skips it on the tag page.

Accepted types are JPEG, PNG, and WebP. PNG and WebP are stored as JPEG. HEIC, video, and anything else are skipped, and the sync result names them. iPhone photos are often HEIC. The shop saves JPEGs (Camera formats set to Most Compatible, or share as JPEG).

Order:

- A leading integer in the file name sets the position. `01 peony.jpg` comes before `2-fern.jpg`.
- Files with no leading integer come after the numbered ones, oldest modified time first, so a new file appends.
- The same number on two files breaks the tie by file name.

Style, artist, placement, and the homepage line are not taken from folder names or file names. Those are the taps on the tag page. A child folder is still copied. It does not decide the style.

A constant caps the strip at 24 frames. Files past the cap are not copied. The shop chooses the set by which files are in the folder and by the leading numbers. Twenty-four is the proposed safety cap so a camera roll cannot become the homepage.

Removing a file from the dump removes its frame on the next sync. Renaming it updates the order or the style line. Replacing its bytes replaces the JPEG. The Drive file id, or the Dropbox content id, is the stable id. A rename does not upload the bytes again when the checksum is unchanged.

The stored JPEG's longest side is 1600 pixels. The manifest records the width and height the filmstrip uses for the frame ratio. Originals stay in the dump. Phone-sized originals would fill the Hobby Blob allowance and make each visit download several megabytes per photo.

## Schedule, on Hobby

`vercel.json` already runs three daily jobs: TikTok at 08:00 UTC, Instagram at 09:00 UTC, Facebook at 10:00 UTC. This adds `GET /api/film/sync` at `0 11 * * *`.

Vercel Hobby cron runs at most once per day, and the run starts somewhere inside that hour. An expression that fires more than once a day fails the deploy. A couple of times a day is a Pro schedule. The docs page for this was last updated 15 Jul 2026.

The route itself is an ordinary URL. Vercel Cron is what is limited to one call a day. Calling `/api/film/sync` again with `Authorization: Bearer <CRON_SECRET>` runs another pass. That is how a first dump larger than one batch gets caught up the same day, and it is how a second daily pass would be added later without Pro. This plan does not add an outside scheduler.

One pass copies at most 8 new or changed files, then writes the manifest. The route keeps `maxDuration` at 60, matching the social sync routes. Hobby allows 300 seconds. A larger first dump finishes by calling the URL again until the result says it is caught up. After that, the daily run is enough for a few new photos.

The job does not run from a homepage visit. `/api/feed` re-syncs when its catalog is older than an hour. A film sync downloads and resizes photos, so it stays on the cron route and on the manual call.

`cronAuthorized` in `src/feed/server.js` is the check. No `CRON_SECRET` means 401, as with the other three routes.

Until the provider and its secrets are set, the sync returns `not-configured` and does not call Drive or Dropbox. The strip keeps the eight stand-ins.

## Account and folder, pasted in later

Nothing about the account is written in the repo. The values are Vercel environment variables. Switching accounts later is replacing those variables. The filmstrip and the manifest do not change.

Google Drive is the adapter to build first. A service account has its own empty Drive. Sharing the dump folder with the service account's email, as Viewer, is the access. No one repeats an Allow click. The folder id is the last segment of `https://drive.google.com/drive/folders/FOLDER_ID`. The list call uses `supportsAllDrives=true` and `includeItemsFromAllDrives=true`, so a My Drive folder and a shared-drive folder both work once that email is a Viewer. A personal Gmail account can share a My Drive folder this way. Domain-wide delegation is not required.

```
PORTFOLIO_DUMP_PROVIDER=google-drive
GOOGLE_SERVICE_ACCOUNT_JSON=<contents of the key file>
PORTFOLIO_DUMP_FOLDER_ID=<folder id>
```

The key also needs the Drive API enabled on its Google Cloud project. Scope is `https://www.googleapis.com/auth/drive.readonly`.

Dropbox uses the same provider switch and a different adapter. Build that adapter when the dump is a Dropbox folder. The values would be `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`, and `PORTFOLIO_DUMP_PATH`.

The public Blob token is the one the feed already uses: `BLOB_PUBLIC_READ_WRITE_TOKEN` or `BLOB_READ_WRITE_TOKEN`. This job does not need the private store. The service-account JSON stays in the environment. It is not written to Blob or to git.

`GET /api/film` is public. It returns the manifest with a one-hour cache when a dump is configured, and the stand-ins with a 60-second cache when it is not. `robots.txt` already disallows `/api/`.

## First paint

The eight stand-ins are in the prerendered homepage today, so the strip is present before JavaScript runs. A list that changes every day cannot be baked into that HTML. The HTML changes only when the site is built again.

While the dump is unset, the prerender keeps the eight, and a failed `/api/film` leaves them in place. `npm run dev` looks like today.

Once `PORTFOLIO_DUMP_PROVIDER` is set at build time, the prerender leaves the stage empty. The browser fills it from `/api/film`. The stand-in tattoos do not flash in front of the shop's photos. There is a short empty black film, then the frames.

## Hobby limits that bound this

From the Blob pricing page (23 Sep 2026), Hobby includes 1 GB of Blob storage, 10,000 simple operations, 2,000 advanced operations, and 10 GB of Blob data transfer a month. Past a limit, Blob is blocked until 30 days have passed. Hobby does not bill the overage.

A `list` and a `put` are advanced operations. Delete is free. A daily list plus a few new photos is a small fraction of 2,000. Web JPEGs at 1600 pixels on the long side keep a 24-frame strip far under 1 GB. Public blob URLs are cached for a year, the same as the feed covers. A cache hit is not a simple operation. Blob data transfer still applies when the bytes are downloaded. The 10 GB transfer allowance is the limit a busy month would meet first if the stored files were full phone photos. The resize is what keeps the strip inside it.

Cron jobs on Hobby: 100 per project, once per day, starting any time in the scheduled hour. This project would have four.

Function max duration on Hobby is 300 seconds. This route stays at 60.

The Hobby plan page (14 Sep 2026) says the plan is for non-commercial personal use, under the fair-use guidelines. This site is a studio site. The numbers above are the free-tier limits. Using them for the shop is a terms question separate from how the sync works.

## What gets built when this is approved

- A pure function that turns a file list into ordered frames: leading number, then modified time, style from the parent folder, cap at 24, skip of other folders and other types. Tests cover that function. No network.
- `GET /api/film` and `GET /api/film/sync`, the manifest paths, and the cron entry at 11:00 UTC.
- The Drive adapter behind `PORTFOLIO_DUMP_PROVIDER`. It refuses to call Drive when the JSON or the folder id is missing.
- `WorkFilmstrip` reads `/api/film` and falls back to the eight when the request fails or the source is the stand-in list.
- The Dropbox adapter waits until the dump is a Dropbox folder.
