# Status

> **Every session (Claude, Codex or human) updates this file before ending.** Change "Last updated", move finished items out of Next steps, and add anything new you found.

**Last updated:** 2026-11-21, Claude Code (Opus 5.5)

## Current state

- **Sanity CMS is built but not live yet.** On branch `sanity-cms` (not pushed): the site is now an Astro site that builds from Sanity; Studio in `studio/`; GitHub Actions workflow in `.github/workflows/deploy.yml`.
- Sanity project `x7xjqilb` ("Shoyaib Portfolio", in the user's own personal Sanity organization) holds all current content: 4 articles, 8 work samples (videos/images uploaded to Sanity), 5 pages and site settings. All 18 documents pass validation.
- Verified locally (2026-11-21): all 9 pages rebuilt from Sanity have **word-for-word identical text and identical HTML structure/classes** to the old hand-written pages; checked visually at desktop and 375px; all links 200; no invisible `.reveal` content.
- The live site at https://shoyaibraby.com is still the old hand-written version from `main` until the go-live steps below are done.

### Fixed in the Sanity rebuild (live once deployed)
- Wrong domain: canonical, `og:url`, sitemap and `robots.txt` now use `https://shoyaibraby.com` (were `shoyaib.com`, a stranger's site). Share image now comes from Sanity's CDN.
- Custom `404.html`.
- `sitemap.xml` generated automatically from Sanity.
- Footer text (Upwork / Email / ©) never faded in on any page (the `reveal` bug) — fixed with `.footer.in .reveal` in CSS.
- "$2K+" stat lost its "$" after counting up — `main.js` now supports `data-prefix`.
- Images are served resized/WebP from Sanity's CDN; videos and images no longer stored in the repo.

## Go-live steps (need the user)

1. **User's OK to go live**, then: switch GitHub Pages source to "GitHub Actions" (`gh api -X POST/PUT repos/tabibhasann/shoyaib-portfolio/pages -f build_type=workflow`), merge `sanity-cms` into `main`, push. Watch the Actions run and check the live site.
2. **Webhook (user does this, needs a token):** create a fine-grained GitHub token limited to this repo with "Contents: Read and write"; in https://www.sanity.io/manage/project/x7xjqilb → API → Webhooks, create "Rebuild website": URL `https://api.github.com/repos/tabibhasann/shoyaib-portfolio/dispatches`, dataset `production`, trigger on create/update/delete, filter empty, projection `{"event_type": "sanity-publish"}`, method POST, HTTP headers `Authorization: Bearer <token>` and `Accept: application/vnd.github+json`, API version v2021-03-25, drafts off. Token expires — note the date and renew it.
3. **Invite Shoyaib** to the Sanity project (Editor role) with his email: sanity.io/manage → Members → Invite. Send him `docs/EDITING-GUIDE.md`.

## Known issues

1. **Social share image** is still a screenshot of his Upwork profile card. A purpose-made 1200×630 image would look better (now changeable in Studio → Site settings).
2. **Heavy videos.** The 4 MP4s total about 47 MB (7–18 MB each) and have no poster image, so tiles can look grey/black until loaded (same as before). Compress and re-upload in the Studio; posters would need a new field.
3. **Small accessibility points.** Mobile menu button is a `<div role="button">`; "View All Writing →" and the contact email are under 32px tall on phones.

## Next steps

1. Go-live steps above.
2. Compress videos; consider a poster-image field on work samples.
3. Better share image.

## Open questions

- Should the site show his full name "Shoyaib Raby"? (Now editable: Site settings → Name.)
- Are the About stats still current ($2K+, 14 projects, 82 hours, IELTS 6.5)? Shoyaib can now update them himself.
- The old June draft (`~/Downloads/_archive/shoyaib/shoyaib-premium-june-old`) had a third "Marketing" service card, a "Verified" Upwork badge, "X min read" labels and a "Next step" box at the end of articles. Bring any back? Each would need a small schema + template addition.
