# AGENTS.md — Shoyaib portfolio site

This is the shared rulebook for every AI tool that works on this project (Claude Code, Codex, anything else).
Read it fully before changing anything. Then read `docs/STATUS.md` for where things stand right now.

- `AGENTS.md` (this file): how the project works and the rules. Changes rarely.
- `docs/STATUS.md`: current state, known issues, next steps. **Update it before every session ends.**
- `docs/DECISIONS.md`: why things are the way they are. Add an entry whenever a real decision is made.
- `docs/EDITING-GUIDE.md`: plain-language guide for Shoyaib on editing his site in Sanity Studio.

---

## Project overview

- **Whose site:** Shoyaib Raby (shown on the site as "Shoyaib"; his Upwork name is "Abu Musa M."). He is the user's brother. Freelance editor, writer and digital marketer based in Dhaka, Bangladesh.
- **Live at:** https://shoyaibraby.com
- **Purpose:** a portfolio that wins freelance work. It shows his writing, video editing and static design samples and points visitors to email or his Upwork profile.
- **Audience:** potential clients (small businesses, healthcare brands, creators) browsing from Upwork or a link he sends. Many will open it on a phone.
- **Who edits what:** Shoyaib edits all words, images, videos and articles himself in **Sanity Studio** (https://shoyaib.sanity.studio). Developers (the user, Claude, Codex) change the design and code in this repo.

## How it works (the big picture)

```
Shoyaib edits in Sanity Studio ──Publish──► Sanity (content + images + videos)
                                                   │ webhook
                                                   ▼
GitHub repo (code) ──push──► GitHub Actions: `astro build` reads Sanity, writes plain HTML
                                                   │
                                                   ▼
                                    GitHub Pages ──► https://shoyaibraby.com
```

- **Site:** [Astro](https://astro.build) static site at the repo root. At build time it fetches content from Sanity and outputs plain HTML/CSS/JS to `dist/`. Visitors never talk to Sanity except to load images/videos from `cdn.sanity.io`.
- **Content:** Sanity project **`x7xjqilb`** (name "Shoyaib Portfolio"), dataset **`production`** (public, read-only for visitors). Studio code is in `studio/`.
- **Animation libraries (from CDN, not in the repo):** GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13 from `cdn.jsdelivr.net`; fonts from Google Fonts. The site's own CSS/JS (`public/css`, `public/js`) are the original hand-written files, unchanged apart from small fixes.

## Repo structure

```
src/
  layouts/Layout.astro        <head> (SEO + link previews), nav, footer, decorative layers, scripts — shared by every page
  pages/index.astro           Home page
  pages/editing/index.astro   Editing landing (two cards)
  pages/editing/video-editing.astro, static-design.astro  Galleries (both use components/GalleryPage.astro)
  pages/writing/index.astro   Writing landing (article list)
  pages/writing/[slug].astro  One page per article -> /writing/<slug>.html
  pages/404.astro             "Page not found"
  pages/sitemap.xml.js        sitemap.xml, generated from Sanity (new articles appear automatically)
  components/                 ServiceCard, WorkMedia (video/image tile), ArticleRows, PageHeader, GalleryPage
  lib/sanity.js               Sanity client, image URL helper, shared GROQ fragments
  lib/text.js                 *accent* markup -> HTML, dates, article body (Portable Text) -> HTML
public/                       Copied to the site as-is
  css/style.css               ALL styles (one file, ~2,900 lines)
  js/main.js                  Home + gallery pages (preloader, cursor, lightbox, counters, reveals, smooth scroll)
  js/article.js               Editing landing + writing pages
  CNAME, .nojekyll            GitHub Pages domain files. DO NOT TOUCH.
  robots.txt
  assets/images/profile/upwork-profile-card.png   Fallback share image only
studio/                       Sanity Studio (separate npm package)
  schemaTypes/                What can be edited: objects.ts, documents.ts (article, workSample), singletons.ts (pages + settings)
  structure.ts                The Studio's left-hand menu
  sanity.config.ts, sanity.cli.ts   Project id, dataset, studioHost "shoyaib"
  migration/build-import.py   One-off script that copied the old HTML into Sanity (2026-11-21). Reference only.
.github/workflows/deploy.yml  Build + publish to GitHub Pages
.claude/launch.json           Preview servers for Claude Code ("site-preview", "studio")
```

URLs are unchanged from the original hand-written site (`/writing/what-is-mph.html`, `/editing/video-editing.html` …) thanks to `build.format: 'preserve'` in `astro.config.mjs`. Keep it that way: old links are shared around.

### What lives in Sanity

| Studio item | Document id / type | Feeds |
|---|---|---|
| Home page | `homePage` (singleton) | Every section of `/` |
| Writing page | `writingPage` | `/writing/` header + article order |
| Editing page | `editingPage` | `/editing/` header + two cards |
| Video editing page / Static design page | `videoPage`, `staticPage` | Gallery headers + sample order |
| Articles | `article` | `/writing/<slug>.html`, lists, sitemap |
| Work samples | `workSample` (kind `video` or `image`) | Galleries and the home work grid |
| Site settings | `siteSettings` | Name, email, Upwork link, share image, footer line |

Text conventions editors use: `*word*` → accent/italic style (`<span class="italic">`, `accent-word` in the hero, `highlight` in About); a line break in a heading → `<br>`. Implemented in `src/lib/text.js` (`accent()`).

Ordered lists (`samples`, `articles`) are "ordered first, then everything else": anything not in the list is appended (`withRemainder()` in `lib/sanity.js`), so Shoyaib can't lose an item by forgetting to add it.

### Home page sections (in order)

Preloader → Hero (`#top`) → Marquee → About + 4 counting stats (`#about`) → Services, 2 cards (`#services`) → Process, 3 steps (`#process`) → Selected work grid (`#work`) → Recent articles (`#writing`) → Contact (`#contact`) → footer. Nav links on the home page are `#about` etc.; on other pages `/#about`.

## Design system

All tokens live at the top of `public/css/style.css` in `:root`. Use the variables; don't hard-code new colours.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0c0b09` | Page background (also `theme-color`) |
| `--ink-soft` | `#15140f` | Slightly raised background |
| `--ink-card` | `#1a1813` | Cards |
| `--bone` | `#ece5d6` | Main text |
| `--bone-dim` | `#b8b0a0` | Secondary text |
| `--bone-faint` | `#6b6557` | Labels, fine print |
| `--accent` | `#ff4d24` | Orange-red accent: links, highlights, focus ring |
| `--accent-soft` | `#ff6b3d` | Accent hover |
| `--line` / `--line-strong` | bone at 8% / 15% | Dividers and borders |

**Fonts:** `--font-display` Fraunces (serif, headings, italic accent words), `--font-body` Inter (body), `--font-mono` Space Mono (small uppercase labels, eyebrows, numbers like `/01`).

**Spacing:** `--gutter: clamp(1.25rem, 5vw, 5rem)`, `--section-gap: clamp(5rem, 12vh, 10rem)`, `--radius: 4px`. **Breakpoints:** 1024, 768, 480, 360px plus a short-landscape rule. Check new work at 375px wide and desktop.

**Motion:** `.reveal` fades/slides in when scrolled into view (JS adds `.in`; `.reveal-delay-1…4` stagger). `data-split` animates a heading word by word. `.magnetic` drifts toward the cursor; `data-cursor-text` labels the custom cursor. `[data-count]` counts up (`data-prefix`, `data-suffix`, `data-decimals`). Also custom cursor, grain, vignette, progress bar, Lenis smooth scroll. `prefers-reduced-motion` and `body.no-anim` switch animations off; keep that working.

### Known gotcha: `.reveal` can leave content invisible

`.reveal` starts at `opacity: 0` and only shows when JS adds `.in`. If the script fails or the element never reaches the trigger line, **it stays invisible**. This has happened twice (process steps, 2026-07-04; footer, fixed 2026-11-21). Safety nets, keep them:
- Every page's `<body>` starts with `class="no-js"`; CSS shows `.reveal` under `body.no-js`; JS removes `no-js` first.
- `gsap.registerPlugin(ScrollTrigger)` must stay in `main.js` and `article.js`.
- `.footer.in .reveal` is visible (the footer can't scroll up to the 85% line on its own).
- No `content-visibility: auto` on sections.

After adding any `.reveal`, scroll the whole page in the preview and confirm everything appears.

## Content guidelines

**Content is Shoyaib's.** Don't edit his words in Sanity unless the user asks. Never change facts (numbers, clients, earnings, scores, contact details) without his or the user's confirmation.

**Voice:** first person, warm, plain and confident. Short sentences. No hype or jargon.

**Adding content** is done in the Studio, not in code: see `docs/EDITING-GUIDE.md`. A new article automatically gets its page, a row on `/writing/`, a sitemap entry and (if the home list is left empty) a home-page row.

**Changing what can be edited** (a new field or section): add the field in `studio/schemaTypes/`, render it in the matching `src/pages/*.astro`, run `npx sanity schema validate` in `studio/`, deploy the Studio (`npm --prefix studio run deploy`), then fill the field in the Studio. Give every field a plain-English title and description: Shoyaib is not technical.

## How to preview locally

```bash
npm install
npm --prefix studio install
```

```bash
npm run build && npx astro preview --port 4321
```

Open http://localhost:4321. (`npm run dev` also works for live reload.) The site reads **published** Sanity content, so drafts don't show. Studio locally: `npm run studio` → http://localhost:3333 (needs a Sanity login). In Claude Code, use the "site-preview" and "studio" entries in `.claude/launch.json`. Check phone width (375px) and desktop, and scroll to the bottom so every `.reveal` triggers.

## How publishing works

- **Content changes:** Shoyaib presses Publish in the Studio → Sanity webhook "Rebuild website" calls GitHub (`repository_dispatch`, type `sanity-publish`) → the **Build and publish site** workflow runs → live in about 1–2 minutes. If the webhook is ever broken, run the workflow by hand: GitHub → Actions → "Build and publish site" → Run workflow.
- **Code changes:** pushing to `main` runs the same workflow. GitHub Pages source is set to **GitHub Actions** (not "deploy from branch").
- **Studio changes:** `npm --prefix studio run deploy` publishes the Studio to https://shoyaib.sanity.studio. It does not affect the website.
- To undo a bad code publish: `git revert <commit>` and push (with the user's OK). To undo a content change: the document's History in the Studio (top-right clock icon) → restore.

## Working rules

1. **ALWAYS get the user's explicit OK before `git push`.** A push to `main` goes live on the public site within minutes.
2. **Build and preview every change locally before committing** (commands above), at phone and desktop width.
3. **Don't touch `public/CNAME` or `public/.nojekyll`,** or the GitHub Pages / webhook settings, without the user's OK.
4. Commit in small, clearly described steps. Work on `main` for small changes; use a branch for big ones.
5. Keep the site static: no server, no client-side data fetching, no new frameworks without the user agreeing first.
6. Never commit tokens or secrets. The site needs none (the dataset is public); the webhook's GitHub token lives only in Sanity's webhook settings.
7. Record real decisions in `docs/DECISIONS.md` (dated). Update `docs/STATUS.md` before the session ends.
8. The user is still learning: explain what you changed and why in plain words.

## Key links

- Live site: https://shoyaibraby.com
- Editing screen (Sanity Studio): https://shoyaib.sanity.studio
- Sanity project settings (members, webhooks, API): https://www.sanity.io/manage/project/x7xjqilb
- Repository: https://github.com/tabibhasann/shoyaib-portfolio
- Deploy runs: https://github.com/tabibhasann/shoyaib-portfolio/actions
- GitHub Pages settings: https://github.com/tabibhasann/shoyaib-portfolio/settings/pages
- Shoyaib on Upwork: https://www.upwork.com/freelancers/~01d717d1dbe07f59e1?viewMode=1
- Contact email on the site: shoyaibr@gmail.com
- Older copies (reference only, not live): `~/Downloads/_archive/shoyaib/`
