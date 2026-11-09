# Status

> **Every session (Claude, Codex or human) updates this file before ending.** Change "Last updated", move finished items out of Next steps, and add anything new you found.

**Last updated:** 2026-11-09, Claude Code (Opus 5.5)

## Current state

- Site is live and working at https://shoyaibraby.com. All 9 pages return 200, `www.` redirects to the bare domain, no console errors.
- Last site change: 2026-07-04 (reveal animation and GitHub Pages fixes). Nothing has changed on the site since.
- 2026-11-09: repo freshly cloned to `~/Projects/shoyaib-portfolio`; added `AGENTS.md`, `CLAUDE.md`, `docs/STATUS.md`, `docs/DECISIONS.md`. No site files changed.

## Known issues

From a quick audit on 2026-11-09 (live site + code):

1. **Wrong domain in all SEO tags (important).** Every page's `canonical`, `og:url`, `og:image` and `twitter:image`, plus every `sitemap.xml` entry and the `Sitemap:` line in `robots.txt`, point to `https://shoyaib.com`. The site actually lives at `https://shoyaibraby.com`, and **shoyaib.com is someone else's website** (a web developer's portfolio). Effects: Google may treat the pages as copies of another site, link previews on WhatsApp/LinkedIn/Facebook show no image (it points at a stranger's server), and the sitemap is ignored. Fix: replace `https://shoyaib.com` with `https://shoyaibraby.com` in all `.html` files, `sitemap.xml` and `robots.txt`.
2. **No custom 404 page.** Unknown URLs show GitHub's generic 404. Adding a `404.html` in the site's style would keep visitors on the site.
3. **Social share image** is a screenshot of his Upwork profile card for every page. A purpose-made 1200×630 image would look more professional.
4. **Heavy videos.** The 4 MP4s total about 47 MB (7–18 MB each) and have no `poster` image, so on phones the tiles can show black until data loads. Compress them and add poster frames.
5. **Small accessibility points.** The mobile menu button is a `<div role="button">` (works, but a real `<button>` is better). Two links are under 32px tall on phones ("View All Writing →" and the contact email). Otherwise good: skip link, focus outline, alt text, reduced-motion support, one `<h1>` per page.
6. Mobile layout at 375px looks good: no sideways scrolling, all `.reveal` content appears.

## Next steps

1. Fix the domain in canonical/OG/sitemap/robots (issue 1). Preview, commit, then ask before pushing.
2. Add a `404.html`.
3. Compress videos and add posters.
4. Decide on a better share image.

## Open questions

- **Editing for Shoyaib (no CMS exists yet).** Shoyaib (the user's brother) wants to edit the site himself. Checked 2026-11-09: there is no CMS of any kind. No Sanity files in this repo or the archives; the user's Sanity account has only "Anchor Point Website"; no Sanity work for this site in Codex history (the 2026-07-04 Codex chat about Sanity was for a different client, Ramon, and only used this site as a design example). Sanity is the user's preferred option; not decided or started.

- Should the site show his full name "Shoyaib Raby"? The domain uses it but the pages only say "Shoyaib" (and "Abu Musa M." on Upwork).
- Are the About stats still current ($2K+ earned, 14 projects, 82 hours, IELTS 6.5)?
- The old June draft (`~/Downloads/_archive/shoyaib/shoyaib-premium-june-old`) had things the live site doesn't: a third "Marketing" service card (funnels, strategy, content), the Upwork profile card shown on the page as a "Verified" proof badge, "X min read" labels on articles, and a "Next step" call-to-action box at the end of each article. Bring any of these back? (Nothing was copied; its `work/` folder is empty and all its assets are already in this repo.)
