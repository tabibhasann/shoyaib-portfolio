# Decisions

Why things are the way they are. Newest first. Add an entry (date, decision, why) whenever a real choice is made, so nobody has to rediscover it.

---

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
