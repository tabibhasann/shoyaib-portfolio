# Decisions

Why things are the way they are. Newest first. Add an entry (date, decision, why) whenever a real choice is made, so nobody has to rediscover it.

---

## 2026-11-21 — Sanity CMS + Astro, published by GitHub Actions
**Decision:** all content moves into Sanity (project `x7xjqilb`, public `production` dataset, Studio at `shoyaib.sanity.studio`). The site becomes an Astro static site that reads Sanity at build time; GitHub Actions builds and deploys to GitHub Pages; a Sanity webhook triggers a rebuild on every publish.
**Why:** Shoyaib (the user's brother, not technical) must be able to edit everything himself. Sanity was the user's choice and they already use it for other clients. Astro lets us keep the original HTML, CSS, JS and animations byte-for-byte in templates, so the design didn't change. Building static HTML (instead of fetching content in the browser) keeps Google indexing and link previews working and the site fast. Staying on GitHub Pages avoids touching DNS for shoyaibraby.com.
**Details:** URLs kept identical (`build.format: 'preserve'`). Editors mark accent words with `*stars*`. Ordered lists auto-append anything missing so nothing can be "lost". Singleton pages can't be deleted or duplicated in the Studio. Videos/images now live only in Sanity. Considered and rejected: Framer/Webflow (monthly cost, rebuild the design, lose custom animations), Decap/Pages CMS (plainer editing for a non-technical person), client-side fetching (bad for SEO and link previews).

## 2026-11-21 — Footer `.reveal` made visible via `.footer.in`
**Decision:** CSS rule `.footer.in .reveal { opacity: 1; transform: none }`.
**Why:** the footer is at the very bottom, so its items could never reach the "top 85%" trigger line and stayed invisible on every page of the live site. `main.js`/`article.js` already add `.in` to the footer.

## 2026-11-09 — Shared AI workspace files
**Decision:** `AGENTS.md` is the single rulebook for all AI tools; `CLAUDE.md` just imports it; `docs/STATUS.md` is the hand-off note between sessions; `docs/DECISIONS.md` (this file) records reasons.
**Why:** the user works with both Codex and Claude Code and wants any session to pick up the project without re-explaining it. Same setup across all their projects.

## 2026-11-09 — Project lives in `~/Projects/shoyaib-portfolio`
**Decision:** fresh clone of the GitHub repo is the working copy. Older copies stay in `~/Downloads/_archive/shoyaib/` for reference only.
**Why:** the site had been hard to find; one clean, known location.

## 2026-07-04 — Removed `.reveal` from the process steps
**Decision:** the three "How I Work" steps no longer use the `reveal` class (commit `1c778db`).
**Why:** they stayed stuck invisible on the live site. Plain visible content beats an animation that can fail. See the gotcha in `AGENTS.md`.

## 2026-07-04 — Safety nets for reveal animations
**Decision:** pages start with `body.no-js` and CSS shows all `.reveal` content in that state; JS removes the class. Also added the missing `gsap.registerPlugin(ScrollTrigger)` (commits `a1689bd`, `402234c`).
**Why:** without the plugin registered, ScrollTrigger never fired, so revealed content stayed hidden. The `no-js` fallback means content is visible even if the CDN scripts fail.

## 2026-07-04 — No `content-visibility: auto`
**Decision:** removed `content-visibility: auto` and shrank `contain-intrinsic-size` on the process section (commits `cdf4ea8`, `5870056`).
**Why:** it broke ScrollTrigger's reveal timing and left a blank gap.

## 2026-07-04 — `.nojekyll` file
**Decision:** added an empty `.nojekyll` at the root (commit `ed47ab3`).
**Why:** stops GitHub Pages running its Jekyll build, so files are served exactly as written and deploys are faster and predictable.

## 2026-07-04 — GitHub Pages with custom domain `shoyaibraby.com`
**Decision:** host on GitHub Pages from `main` (root folder) with `CNAME` = `shoyaibraby.com` (commits `99e7758`, `f11701d`).
**Why:** free, no server to maintain, fits a plain static site; publishing is just a push.

## 2026 (before July) — Plain static site, no build step
**Decision:** hand-written HTML/CSS/JS with GSAP, ScrollTrigger and Lenis from a CDN.
**Why:** simple to host anywhere, nothing to install or break, easy to edit by hand. (From the original README; no build chat survives.)
