# Instagram feed on the Mystic May site

Status: the parts that do not need Instagram or the account holders are built. Real posts are not. The site has not been deployed. This file matches the TikTok plan's split: the copier is in the repo, and the Allow step is still ahead.

The rail, the arrows, the card chrome, and the sample mark are the ones in `Grok/planning/tiktok-feed.md`. This file is the Instagram difference: which accounts, which API, which token, and who does what.

Checked with `npm test` (37 tests) and `npm run build` on 2026-10-29. Both succeeded.

## What has been built

- Home Instagram is one merged rail: shop `@mysticmaytattoo`, Meagan `@capriceink`, and Brittany `@inksbybritt`, newest first. An artist page shows only that artist's Instagram. There is no Facebook tab on an artist page.
- `src/feed/instagram-sync.js` copies a new still once, updates a caption without downloading the still again, skips stories, stores a video or reel thumbnail instead of the video file, uses the first image of a carousel, keeps stored posts when a list page does not finish, and drops a post only after a finished list omits it. With no token it returns `no-token` and does not call Instagram. With no `INSTAGRAM_APP_ID` or `INSTAGRAM_APP_SECRET` it returns `no-app-credentials` and does not call Instagram.
- A long-lived token is refreshed when it is at least 24 hours old and expires within 10 days. A token younger than 24 hours is not sent to the refresh endpoint. Business Login says a refresh requires the token to already be 24 hours old. The new token is saved. The app secret is not sent on the refresh call.
- A finished Instagram list drops only that handle's Instagram posts. A TikTok post with the same @handle stays. `@inksbybritt` is both platforms.
- The still is stored in the public Blob store at `covers/instagram/{id}.jpg`. The token file is `instagram/tokens.json` in the private store. The catalog is the shared `feed/catalog.json`. A successful Instagram sync adds `instagram` to `syncedPlatforms`. Until that happens, the Instagram tab keeps the labeled samples, even if TikTok has already synced.
- `GET /api/instagram/sync` is the daily job at 09:00 UTC. It answers 401 until `CRON_SECRET` is set and the request sends `Authorization: Bearer <that secret>`.
- When `/api/feed` sees a catalog older than an hour, it runs the TikTok sync, then the Instagram sync, then the Facebook sync. That is the check that finds a post made today. Hobby cron cannot run it every hour.
- The link stored for a real post is the `permalink` Instagram returns. A reel stays a `/reel/` address. Desktop opens it in a new tab. iPhone stays on that address in the same tab. Android uses an intent for `com.instagram.android` with the website as the fallback. No `instagram://` link.

The route that receives the Allow redirect and stores the token is not built. It is the same gap as TikTok. Build it after the Meta app exists, and before anyone is asked to tap Allow.

## What appears on the site

The card is a still, not the Instagram post. The whole card is the link. It shows the Instagram mark, the @handle, the posted time in America/New_York, and one caption line. It does not show likes, comments, or a player. Sample cards say Sample.

Instagram cards are 2:3. TikTok cards stay 9:16.

A video or reel uses `thumbnail_url`. The copier does not download `media_url` for those, because that address is the video file. A carousel uses the album's own image when Instagram sends one, and otherwise the first child's still. The link is the parent post, not a slide. A story is ignored. Stories expire and are a different API edge.

If Instagram omits the caption, the card still has the still, the handle, and the time. The caption line is empty. The IG Media reference (updated 20 Oct 2026) says the caption field is returned for Facebook Login. This copier uses Instagram Login and still requests the caption. A missing caption is not a failed sync.

## Which accounts, and where

| Place | Whose posts | Order |
|---|---|---|
| Home, Instagram tab | `@mysticmaytattoo`, `@capriceink`, `@inksbybritt` | Newest post first |
| Artists, Meagan | `@capriceink` only | Same rail |
| Artists, Brittany | `@inksbybritt` only | Same rail |

Shop Instagram is its own account. It is not Meagan's Instagram, and it is not the shop TikTok. The shop TikTok is `@capriceink_`, which is Meagan's TikTok, and that account is included once on the TikTok tab. Do not merge `@mysticmaytattoo` into Meagan's artist tab.

Home reads the artist list and adds the shop Instagram account. A new artist's Instagram joins Home when two things are true: they are on the artist list with an Instagram handle, and that account has a token in `instagram/tokens.json`.

## What the copier stores

Each catalog row:

- Instagram media id
- `platform: "instagram"`
- the @handle from the token record
- our Blob URL for the still
- `pageUrl`, the permalink Instagram returned
- the caption line, which may be empty
- `createTime`, unix seconds from Instagram's `timestamp`

Do not store `media_url` or `thumbnail_url` as the address the page displays. Those are CDN links. Instagram's platform overview (updated 28 Sep 2026) says a CDN URL does not return the media once the content is deleted or the link has expired. Meta does not publish a fixed lifetime. Copy the bytes on the same pass that received the link. Do not store like counts or comment counts.

The catalog file is cached for one hour. Cover files are cached for a year. The path includes the media id, and those bytes are not replaced to refresh them.

## Tokens

This copier speaks the Instagram API with Instagram Login.

| Item | Value |
|---|---|
| Host | `graph.instagram.com` |
| Version pinned in the copier | `v26.0` |
| Permission | `instagram_business_basic` only |
| Media | `GET /me/media` |
| Refresh | `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token` |

Do not request publish, comments, or messages.

Business Login (updated 13 Mar 2026) says a short-lived token lasts about an hour, and the long-lived token lasts about 60 days. The response includes `expires_in`. Read that number. Do not hardcode 60 days. The sample in that guide is 5183944 seconds. A long-lived token can be refreshed for another 60 days only when it is at least 24 hours old, it has not expired, and the account granted `instagram_business_basic`. A token that is not refreshed before it expires cannot be refreshed. That person has to tap Allow again.

The daily job exists so a quiet week still refreshes the token. The copier refreshes when expiry is inside 10 days and the token is already 24 hours old. Ten days is our lead time, not Meta's. Meta's rule is the 24 hours and the unexpired token.

The app secret stays in Vercel as `INSTAGRAM_APP_SECRET`. It is used for the code exchange, which is not built yet. The refresh call does not send it. The copier still refuses to run when the id or the secret is missing, so a half-configured server does not call Instagram.

Tokens live in the private Blob store, keyed by handle. They are not written to the catalog, the client, or git.

## Deleted posts

A finished media list is treated as that account's posts. An Instagram id for that handle that is missing from the finished list is removed from the catalog. The stored still can remain in Blob. The card is gone.

If a page of the list fails, or the list does not end, nothing is removed. A dead token or a failed list must not blank the tab.

## Opening the app

Desktop: the permalink, new tab. iPhone: the same https address, same tab, so iOS can open the Instagram app. Android:

```
intent://www.instagram.com/p/{shortcode}/#Intent;scheme=https;package=com.instagram.android;S.browser_fallback_url={encoded permalink};end
```

The real path comes from the permalink, so a reel uses `/reel/` rather than `/p/`. If the app is not installed, the fallback is the website. Do not use `instagram://`.

## Before any of this can run

The account must be an Instagram professional account, Business or Creator. A personal account cannot connect. The Instagram platform overview (updated 28 Sep 2026) says that. This plan does not know whether `@mysticmaytattoo`, `@capriceink`, or `@inksbybritt` are already professional. The person who can log into that account is the one who switches it, if it is still personal.

Meta's overview recommends the Instagram API with Unified Login for a new integration. Unified Login uses a business portfolio and a different token. This copier does not speak that token. Instagram Login is the path that is built, because each account can log in with Instagram and no Facebook Page is required. The migration guide (updated 1 Oct 2026) says existing Instagram Login integrations have no announced end date.

When the app is created, open the dashboard and see which setup it offers. If a new app is offered only Unified Login, stop. Do not store that token in `instagram/tokens.json`. Change the copier first.

## Who does what, and when

There is one Meta app, owned by the person building the site. It is not the TikTok app. TikTok stays on developers.tiktok.com. The same Meta app also covers the Facebook page, in `Grok/planning/facebook-feed.md`. Meagan and Brittany do not create developer accounts, do not create the app, and never see a token.

### What can be done now

This needs no Instagram account and no one at the shop. It is built. See "What has been built" at the top.

Until a real token exists, the Instagram tab shows the labeled samples. It cannot show the shop's or the artists' actual posts.

### What the site builder does

1. **Deploy the site.** No Instagram login. The Privacy Policy and Terms of Service at `/privacy` and `/terms` have to be on the public site before Meta reviews the app. They are on the local site now. They describe the tokens as stored only after an account is connected.

2. **Open one Meta developer account.** Go to [developers.facebook.com](https://developers.facebook.com) and create one app. The site builder's Facebook login owns it. It does not have to be the shop page. Add the Instagram product and set up Instagram API with Instagram Login. The app name on the consent screen should match the studio and must not be named after Instagram.

3. **Ask for one permission.** `instagram_business_basic`. Register one https redirect address, a fixed path, no query string. The dashboard shows an Instagram App ID and an Instagram App Secret. Put them in Vercel as `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`. The secret never goes in the page, in git, or to the artists.

4. **Confirm the dashboard still offers Instagram Login.** See the warning above. Do this before review, while changing the copier is still cheap.

5. **Ask Meta for Advanced Access.** The overview says Standard Access is for professional accounts the developer owns or manages and has added in the dashboard. Advanced Access is required when the app serves professional accounts the developer does not own or manage, and it requires App Review and Business Verification. The studio accounts are not the site builder's unless that person is later made a manager of them. Plan on Advanced Access and Business Verification. If the site builder is made a manager of an account, that account can be used under Standard Access for testing. Brittany's account still needs her own Allow, and it needs Advanced Access unless the site builder also manages it.

6. **Submit the app for review** with the public site URL, the privacy policy, and a description of the one permission: reading the account's own media so the studio site can show stills that link back to Instagram. Meta does not promise a review timeline in the pages read for this plan. Do not invent one.

7. **After the app is approved, build the Allow handler, then send one link per account.** The handler is not in the repo. It has to do this, on the server:

   1. Send the person to `https://www.instagram.com/oauth/authorize` with the app id, the redirect URI, `response_type=code`, and `scope=instagram_business_basic`.
   2. Take the `code` from the redirect. It lasts one hour and works once. Strip the `#_` Instagram appends. If the redirect has `error=access_denied`, stop and show a plain failure. Do not call the API.
   3. `POST https://api.instagram.com/oauth/access_token` with the app id, the app secret, `grant_type=authorization_code`, the same redirect URI, and the code. That returns a short-lived token.
   4. `GET https://graph.instagram.com/access_token` with `grant_type=ig_exchange_token`, the app secret, and the short-lived token. Store the long-lived token, `expires_in`, and the time it was stored.
   5. Read `username` from `GET /me` and save the record under that handle in `instagram/tokens.json`. The handle has to be `@mysticmaytattoo`, `@capriceink`, or `@inksbybritt`, or the artist list's Instagram handle for a later artist. A handle the site does not show is not stored.

   Do this once per account. The daily job and the hourly catalog check take over after the token is stored.

### What the account holders do

Nothing during the build. Nothing during the developer signup. Nothing during review.

After the app is approved and the Allow link exists, each account is one task for the person who can log into it:

1. If the account is still personal, switch it to a professional account.
2. Open the link.
3. Log in to that Instagram. Someone else cannot approve `@capriceink` from the shop login, or the shop from Meagan's login, unless that person actually has that login.
4. Tap Allow for the basic account permission.

The three logins are `@mysticmaytattoo`, `@capriceink`, and `@inksbybritt`. This plan does not say that one person holds more than one of them. Shop TikTok and Meagan's TikTok are the same login. These Instagram accounts are not.

They do not copy a code, do not create a password for the site, and do not manage a token. They repeat this only if the token expires without a refresh, or if they remove the app from Instagram's connected apps. A new artist later does the same single approval after being added to the artist list.

### What the tokens are

| Item | Who it belongs to | How long it lasts | Where it lives |
|---|---|---|---|
| Instagram App ID and secret | The Meta app | Until they are rotated | Secret only on the Vercel server |
| Allow | That Instagram professional account | Until they revoke it | Instagram's consent screen |
| Long-lived access token | That account, via the app | About 60 days, from `expires_in` | Private Blob store |

The docs read for this login do not list a charge for reading the account's own media. That is not a promise that Meta will never bill for it.
