# Facebook feed on the Mystic May site

Status: the parts that do not need Facebook or a page role are built. Real posts are not. The site has not been deployed. This file matches the TikTok plan's split: the copier is in the repo, and the Allow step is still ahead.

The rail, the arrows, the card chrome, and the sample mark are the ones in `Grok/planning/tiktok-feed.md`. This file is the Facebook difference. There is one page, and it is only on the home screen.

Checked with `npm test` (37 tests) and `npm run build` on 2026-10-29. Both succeeded.

## What has been built

- The home Facebook tab shows the shop page, Mystic May Tattoo. The page id is `100092596201830`. The address in `src/data/socials.js` is `https://www.facebook.com/p/Mystic-May-Tattoo-100092596201830/`. An artist page has no Facebook tab. An artist filter returns no Facebook posts.
- `src/feed/facebook-sync.js` reads `GET /v26.0/{page-id}/published_posts` and copies a new still once. A later pass can update the caption without downloading the picture again. A text-only post with no `full_picture` is not a card. The video file is not requested. With no token it returns `no-token` and does not call Facebook. A token stored under any other page id returns `wrong-page` and does not call Facebook. With no `FACEBOOK_APP_ID` or `FACEBOOK_APP_SECRET` it returns `no-app-credentials` and does not call Facebook.
- The list is not the whole page. The published-posts reference says the API returns about 600 ranked posts a year, and at most 100 per request. The copier follows the next page until the list ends. It does not delete a stored post older than the oldest post in that list. An empty list does not wipe stored posts. A stored post inside the returned time window, missing from a finished list, is removed. An Instagram or TikTok post is never removed by this sync.
- The still is stored at `covers/facebook/{id}.jpg` in the public Blob store. The token file is `facebook/tokens.json` in the private store, keyed by the page id. The catalog is the shared `feed/catalog.json`. A successful Facebook sync adds `facebook` to `syncedPlatforms`. Until that happens, the Facebook tab keeps the labeled samples.
- `GET /api/facebook/sync` is the daily job at 10:00 UTC. It answers 401 until `CRON_SECRET` is set and the request sends `Authorization: Bearer <that secret>`. The page token is not refreshed by this job. The job exists so a day with no visitors still looks for new posts.
- When `/api/feed` sees a catalog older than an hour, it runs this sync after TikTok and Instagram. That is the check that finds a post made today.
- The card handle is `Mystic May Tattoo`, not an @handle. The link is `permalink_url` when Facebook sends an https address. Desktop opens a new tab. iPhone stays on that address in the same tab. Android uses an intent for `com.facebook.katana` with the website as the fallback. No `fb://` link.

The route that receives the Allow redirect and stores the page token is not built. Build it after the Meta app exists, and before the page role is asked to tap Allow. The same Meta app is the one in `Grok/planning/instagram-feed.md`. Do not create a second app for Facebook.

## What appears on the site

The card is a still. The whole card is the link. It shows the Facebook mark, the page name, the posted time in America/New_York, and one caption line from the post message. It does not show likes, comments, shares, or a player. Sample cards say Sample.

Facebook cards are 2:3. The Post reference says `full_picture` is resized so its longest side is 720 pixels when the original is larger. That is the still we copy. No page read for this plan states a fixed lifetime for that URL. Copy the bytes on the same pass that received the link, and do not display Facebook's URL.

A post with no picture is skipped. The rest of the list still syncs.

## What the copier stores

Each catalog row:

- the post id Facebook returned
- `platform: "facebook"`
- handle `Mystic May Tattoo`
- our Blob URL for the still
- `pageUrl`, the permalink
- the message, as the caption line
- `createTime`, unix seconds from `created_time`

Do not store like counts, comment counts, or share counts. The catalog cache is one hour. The picture cache is one year.

The endpoint is `published_posts`, not `feed`. `feed` includes visitor posts and tags. This site shows posts the page published.

## Tokens

| Item | Value |
|---|---|
| Host | `graph.facebook.com` |
| Version pinned in the copier | `v26.0` |
| Permissions | `pages_show_list` and `pages_read_engagement` |
| Read | `GET /{page-id}/published_posts?fields=id,message,created_time,permalink_url,full_picture&limit=100` |

Do not request `pages_manage_posts`. That permission publishes. Do not request `pages_read_user_content`. That permission reads visitor posts. Do not request Page Public Content Access. That feature is for reading pages the app does not manage.

The long-lived token guide (updated 30 Jun 2026) says a long-lived Page access token does not have an expiration date, and that it expires or is invalidated under the conditions on the token debugging page. That page's examples are a person logging out, changing their password, or removing the app. Facebook does not send a notice. The copier learns the token is dead when a list call fails, and it keeps the stills already stored. The person with the page role taps Allow again after that.

The same guide says to create the page token from a long-lived user token by calling `GET /{user-id}/accounts`. The user token itself generally lasts about 60 days. The page token is what the copier uses for the read. The Allow handler stores that page token. The built copier does not read a user token. `pages_read_engagement` is on Meta's list of permissions that do not expire (Authentication Versus Data Access, updated 30 Jun 2026).

`FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` live on the Vercel server. The read call uses the page token, not the secret. The secret is for the code exchange, which is not built yet. The copier still refuses to call Facebook when either value is missing.

## Deleted posts

Inside the time window the finished list actually returned, a missing page post is removed from the catalog. Older stored posts stay, because the API did not claim to list them. An empty finished list removes nothing. A failed list removes nothing.

A deleted post can therefore remain on the site until a later list covers its time and omits it, or until the catalog is edited. The link then opens Facebook's unavailable screen if the card is still up. That is the limit of `published_posts`, not a second copy of the picture.

## Opening the app

Desktop: the permalink, new tab. iPhone: the same https address, same tab. Android: an intent to `com.facebook.katana`, website fallback, no `fb://`.

The publishing guide also says a page post URL can be `https://www.facebook.com/{page_post_id}`. The copier prefers `permalink_url` when it is an https address, and uses that form only when the permalink is missing.

## Who does what, and when

One Meta app, owned by the site builder. The Instagram plan creates that app. This page is the Facebook product on it. The person who taps Allow is whoever has a role on the Mystic May Tattoo page. The long-lived token guide says the person requesting the token must have a role on the page. This plan does not name that person. Artists are not asked to connect a Facebook account. Their pages do not have a Facebook tab.

### What can be done now

This needs no Facebook login and no one at the shop. It is built. See "What has been built" at the top.

Until the page token exists, the home Facebook tab shows the labeled samples.

### What the site builder does

1. **Deploy the site**, with `/privacy` and `/terms` public, before Meta review. Same deploy as TikTok and Instagram. One deploy covers all three.

2. **On the Meta app from the Instagram plan, add Facebook Login.** Do not create a second app. Ask for `pages_show_list` and `pages_read_engagement` only. Register the https redirect. Put the Facebook Login app id and secret in Vercel as `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`. The Instagram App ID shown in the Instagram login settings is a separate value. It stays in `INSTAGRAM_APP_ID`. Do not copy one id into the other variable.

3. **Use the same Advanced Access and Business Verification** as the Instagram plan when the app serves a page the developer does not manage. During development, Meta's page-public-content note says a test can only see a page whose admin also has a role on the app. That is a test limit. It is not a reason to make an artist create the app.

4. **Submit the page permissions with the Instagram review** if both are ready. Describe the use as reading the studio page's own published posts so the site can show stills that link back to Facebook. No posting.

5. **After approval, build the Allow handler, then send one link to the person with the page role.** The handler is not in the repo. On the server it has to:

   1. Send that person through Facebook Login with `pages_show_list` and `pages_read_engagement`.
   2. Exchange the code for a short-lived user token, then for a long-lived user token: `GET https://graph.facebook.com/v26.0/oauth/access_token` with `grant_type=fb_exchange_token`, the app id, the app secret, and the short-lived token. Do this on the server. The secret is in the request.
   3. `GET /{user-id}/accounts` with the long-lived user token.
   4. Keep the entry whose id is `100092596201830`. Ignore every other page in that response.
   5. Store that page access token in `facebook/tokens.json` under `100092596201830`. Do not put it in the catalog. Do not keep the user token after the page token is saved.

   The next catalog check copies the stills. There is no separate shop login and no artist login for Facebook.

### What the page role does

Nothing during the build, the developer signup, or review.

After the app is approved and the link exists:

1. Open the link.
2. Log in with the Facebook account that has a role on Mystic May Tattoo.
3. Tap Allow for the two page permissions: the list of pages, and reading what the page posted.

That is the whole task. They do not copy a code and they do not see the token. They do it again only if Facebook rejects the stored page token. A password change, a logout from the app, or removing the app are the cases the debugging guide names.

### What the tokens are

| Item | Who it belongs to | How long it lasts | Where it lives |
|---|---|---|---|
| App id and secret | The Meta app | Until they are rotated | Secret only on the Vercel server |
| Allow | The person with a role on the page | Until they revoke it or Facebook invalidates the session | Facebook's consent screen |
| Page access token | The Mystic May Tattoo page, via the app | No expiration date, until invalidated | Private Blob store |

The docs read for this read do not list a charge. That is not a promise that Meta will never bill for it.
