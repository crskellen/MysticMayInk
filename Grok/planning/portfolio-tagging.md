# Tagging dumped portfolio photos

Status: proposed. Nothing here is built. This replaces the "publish the dump folder as-is" rule in `Grok/planning/filmstrip-dump.md`. The copy job, the Blob store, the Hobby daily cron, the Drive variables, and the web-sized JPEG rules in that file still stand.

Checked 2026-10-29 against `src/data/portfolio.js`, `src/data/artists.js`, and `src/pages/Booking.jsx`. No email address is stored anywhere in the site source. The shop contact on the site is the text line 315-775-3727.

## What has to be known about a photo

A piece in the catalog can carry a title, an artist, a filmstrip style, tags, keywords, a placement, and a size. Search already matches the title, the artist name, the style line, the tag labels, the keywords, the placement, and the size. Width and height come from the file.

The homepage strip does not print the artist. It prints one of the six style names under the active photo: Botanical & Floral, Fine Line, Black & Grey, Blackwork, Fantasy & Anime, Cover-Ups. Artist names stay on `/portfolio` and `/artists`.

The artist is the person who knows which of those apply. Guessing from the file name, or from a folder name, gets the style wrong often enough that the dump should not publish itself.

Keywords are the field that hurts. An artist does not think in keywords. The words they would type are a name ("fern") and a place ("forearm"). Those already feed search when they are the title and the placement. The form does not ask for keywords. It derives them from the title, the style, and the placement.

## Why the answers should not come back by email

The notification can be an email. The filled-in answers should not be a reply that the site reads.

Mail clients do not submit a form that was placed in the message. Gmail, Apple Mail, and Outlook drop or disable form controls. A message can show the photos and a link. It cannot contain the working form.

A reply the artist types has no stable shape. Phones quote the original message, attach a signature, and change the subject. A watcher that keys off a subject line, or off "this is a reply to the message we sent," cannot tell a finished batch from "I'll do it tonight." Reading that mailbox is a second connection: a shop inbox, a Gmail watch or a poller, and a parser. The site has no shop email to watch. The Gmail account available in this workspace is not that inbox.

Hobby cron runs the copy once a day. A reply would sit until the next run unless a separate inbound webhook existed. A tap on a page writes the piece at that moment.

Sending the email is still worth doing. It is how the shop hears that new photos are waiting. The body is the count and one link. A reply is ignored. The link stays valid, so a missed message does not lose the batch.

Outbound text would match the shop's habit, and this site does not send texts. Booking only opens the phone's message app. Sending the text from the server would be a new paid SMS service. The notice is email until that exists. The address is `PORTFOLIO_TAG_EMAIL`, set later with the Drive values. The page is also a stable address the shop can bookmark, so the queue is reachable when the mail is buried.

## The path

1. The daily job copies new JPEG, PNG, and WebP files out of the dump into a private inbox. PNG and WebP are stored as JPEG, longest side 1600, as in the dump plan. HEIC and video are skipped and named in the job result. Nothing in the inbox is on the site.

2. Each new file is a row with status `needs-tags`. The same file id is not queued twice. A file that leaves the dump before anyone tags it leaves the queue. A file that is already a piece is left alone.

3. When the queue gained rows, one email goes to `PORTFOLIO_TAG_EMAIL`. Subject: `Photos to tag (N)`. Body: the number still waiting, and the link. No photo bytes in the mail. No second mail on a day when the queue did not grow. With the address unset, the job still fills the inbox and sends nothing.

4. The link opens a page that is not in the nav. One photo at a time, the questions under it. Saving one photo does not require the rest of the batch. The next visit continues where it stopped.

5. Save writes the piece into the catalog and copies that JPEG to the public portfolio path. Skip marks the file `not-a-piece` and does not publish it. Either way the row leaves `needs-tags`.

The inbox images are private. The tag page is the only place they are shown, and only with the token in the link. The page sends `Referrer-Policy: no-referrer` so the token is not handed to the font host. After publish, the public JPEG is the one the portfolio and the filmstrip use.

## What the page asks

The lists come from the catalog, not from names written on the page. A new artist in `artists.js` becomes a chip. The style chips are the six shop names. Placement and size use the lists already in `portfolio.js`.

Under the photo:

- Not a piece. Room, stencil, wrap, and ink-cap shots stop here.
- Artist. One chip, or "No artist recorded". The fox stand-in is the case with no artist. Blank is allowed.
- Style. One of the six, or none. This is the line under the photo on the homepage.
- Placement. Optional.
- Size. Optional.
- On the homepage. On when a style was chosen, off when it was not. One tap flips it.
- A name. Optional, one line. Empty uses the file name with the extension removed.

Saving a piece requires nothing but the decision that it is a piece. Style, artist, placement, size, and name can all be empty. An empty style stays off the homepage, because the strip would have a blank line.

The style they tap sets the starting tags, so the filters work without a second row of questions:

| Style | Tags stored |
|---|---|
| Botanical & Floral | botanical |
| Fine Line | fine-line, linework |
| Black & Grey | black-grey |
| Blackwork | black, blackwork |
| Fantasy & Anime | fantasy |
| Cover-Ups | cover-up |

Color, shading, and the narrower subjects (floral, fern, anime, and the rest) are not on this page. They can be added later. Search for the style name still matches through the style line.

One file is one piece. A before, a during, and an after of the same tattoo are three files. The extra shots get skipped, or they publish as their own pieces. Grouping them under one cover is a later change. The catalog's piece model already allows that set. This form does not ask it.

## What the site shows after a save

`/portfolio` reads the saved catalog. A new piece appears there with whatever was tapped. The hand-written list in `portfolio.js` remains the stand-in when no catalog has been saved, the same way the newsfeed keeps samples until a platform is connected.

The homepage strip shows the eight newest pieces that were saved with homepage on and a style set. Older homepage pieces stay in the portfolio. The strip still does not print the artist name. The frame, the peek, and the centered style line stay as they are.

Both pages load that catalog in the browser. The prerendered HTML keeps the stand-ins until a catalog exists. Once it does, the build leaves those slots empty and the browser fills them, so the stand-in tattoos do not flash in front of the shop's photos. A daily change cannot be baked into the HTML, because the HTML changes only on a new build.

## What is left for later

The Drive folder id, the service-account JSON, and `PORTFOLIO_TAG_EMAIL` are the values to paste in. None of them go in the repo. Until the Drive values are set, the copy does not run. Until the email is set, the queue still fills and no message is sent.

The first build, when this is approved, is the copy into the private inbox and the queue. The tag page is second. The email is third, and it stays a link.
