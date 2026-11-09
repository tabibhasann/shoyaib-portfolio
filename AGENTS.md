# AGENTS.md — Shoyaib portfolio site

This is the shared rulebook for every AI tool that works on this project (Claude Code, Codex, anything else).
Read it fully before changing anything. Then read `docs/STATUS.md` for where things stand right now.

- `AGENTS.md` (this file): how the project works and the rules. Changes rarely.
- `docs/STATUS.md`: current state, known issues, next steps. **Update it before every session ends.**
- `docs/DECISIONS.md`: why things are the way they are. Add an entry whenever a real decision is made.

---

## Project overview

- **Whose site:** Shoyaib Raby (shown on the site as "Shoyaib"; his Upwork name is "Abu Musa M."). Freelance editor, writer and digital marketer based in Dhaka, Bangladesh.
- **Live at:** https://shoyaibraby.com
- **Purpose:** a portfolio that wins freelance work. It shows his writing, video editing and static design samples and points visitors to email or his Upwork profile.
- **Audience:** potential clients (small businesses, healthcare brands, creators) browsing from Upwork or a link he sends. Many will open it on a phone.
- **Stack:** plain static HTML, CSS and JavaScript. **No build step, no framework, no package manager.** What is in the repo is exactly what is served.
- **External libraries (loaded from CDN, not stored in the repo):** GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13 from `cdn.jsdelivr.net`; fonts from Google Fonts.

## Site structure

```
index.html                    Home page (one long scrolling page)
editing/
  index.html                  Editing landing: links to the two galleries
  video-editing.html          Video gallery (4 videos)
  static-design.html          Static design gallery (4 images)
writing/
  index.html                  Writing landing: list of all articles
  marketing-funnel.html       Article
  reflection-2025.html        Article
  stop-thinking-start-doing.html  Article
  what-is-mph.html            Article
css/style.css                 ALL styles for every page (one file, ~2,900 lines)
js/main.js                    Home page + the two gallery pages (preloader, cursor, lightbox, counters, reveals, smooth scroll)
js/article.js                 editing/index.html and every page in writing/
assets/images/profile/        upwork-profile-card.png (also used as the social share image)
assets/images/static-design/  The 4 static design samples (PNG)
assets/videos/video-editing/  The 4 video samples (MP4, 7–18 MB each)
robots.txt, sitemap.xml       For search engines
CNAME                         Tells GitHub Pages the custom domain. DO NOT TOUCH.
.nojekyll                     Tells GitHub Pages to serve files as-is. DO NOT TOUCH.
README.md                     Short human readme
```

### Home page sections (`index.html`, in order)

| Section id | What it is |
|---|---|
| (preloader) | "Loading Experience" counter overlay shown on first load |
| `#top` | Hero: "Words that move, stories that stay." plus location / availability / Upwork |
| (marquee) | Scrolling strip of skills |
| `#about` | Bio and four animated stats (IELTS 6.5, $2K+ earned on Upwork, 14 projects, 82h) |
| `#services` | Two cards: Editing → `editing/`, Writing → `writing/` |
| `#process` | Three steps: Brief & Discover, Draft & Refine, Polish & Deliver |
| `#work` | Gallery of videos and designs; clicking opens a lightbox |
| `#writing` | "Recent articles" list linking to `writing/` pages |
| `#contact` | Email `shoyaibr@gmail.com` and Upwork button |
| footer | Upwork and email links |

Nav links point at these ids (`#about`, `#services`, `#work`, `#writing`, `#contact`). Pages inside `editing/` and `writing/` use `../` relative paths to get back to the root.

## Design system

All tokens live at the top of `css/style.css` in `:root`. Use the variables; don't hard-code new colours.

**Colours** (warm editorial dark theme):

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

**Fonts:** `--font-display` Fraunces (serif, headings, italic accent words), `--font-body` Inter (body text), `--font-mono` Space Mono (small uppercase labels, eyebrows, numbers like `/01`).

**Spacing:** `--gutter: clamp(1.25rem, 5vw, 5rem)` for side padding, `--section-gap: clamp(5rem, 12vh, 10rem)` between sections, `--radius: 4px`.

**Breakpoints used:** 1024px, 768px, 480px, 360px, plus a short-landscape rule. Check new work at 375px wide (phone) and desktop.

**Motion:**
- Easing tokens `--ease-out` and `--ease-in-out`.
- `.reveal` fades and slides an element up when it scrolls into view. JS adds the class `.in` to show it. `.reveal-delay-1` … `-4` stagger them.
- `data-split` on a heading animates it word by word.
- `.magnetic` makes links and buttons drift toward the cursor; `data-cursor-text="..."` sets the label in the custom cursor.
- Also: custom cursor, film grain, vignette, scroll progress bar, Lenis smooth scrolling.
- `prefers-reduced-motion` and the `body.no-anim` class switch animations off. Keep that working.

### Known gotcha: `.reveal` can leave content invisible

`.reveal` starts at `opacity: 0`. It only becomes visible when JavaScript adds `.in`. If the script fails, the element is never observed, or it sits inside something the scroll logic doesn't track, **the content stays invisible** on the live site. This has already happened (see `docs/DECISIONS.md`, 2026-07-04).

Safety nets already in place, keep them:
- Every page's `<body>` starts with `class="no-js"`, and CSS shows all `.reveal` content under `body.no-js`. The JS removes `no-js` as its first step.
- `gsap.registerPlugin(ScrollTrigger)` must stay in `main.js` and `article.js`.
- Don't add `content-visibility: auto` to sections; it broke ScrollTrigger before.

Rules: don't put `.reveal` on small repeated items (like the process steps) without testing; after adding any `.reveal`, scroll the whole page in the preview and confirm everything appears.

## Content guidelines

**Voice:** first person, warm, plain and confident. Short sentences. No hype words or jargon. British/American mix exists; keep each page consistent with itself. Headings often pair an idea with a twist ("Two crafts, one standard.", "Simple process, serious craft."). Accent words in headings use `<span class="accent-word">` (home) or `<span class="italic">`.

**Don't change facts about Shoyaib** (numbers, clients, earnings, scores, contact details) without his or the user's confirmation.

### Add a new writing piece
1. Copy an existing article (e.g. `writing/what-is-mph.html`) to `writing/<short-kebab-name>.html`.
2. Update in `<head>`: `<title>`, `meta description`, `canonical`, every `og:` tag, and `article:published_time`.
3. Update the hero: `.eyebrow` category, `<time datetime="YYYY-MM-DD">`, `<h1>`, `.article-hero-sub`.
4. Put the body inside `<article>` using `<p>`, `<h3>` and `<ul class="article-list">`.
5. Add a row to `writing/index.html` (copy an `<a class="article-row">`, renumber `/01`, `/02` …).
6. If it should appear on the home page, add a row to the `#writing` section in `index.html` too.
7. Add a `<url>` entry to `sitemap.xml`.

### Add an editing sample
1. Put the file in `assets/videos/video-editing/` or `assets/images/static-design/`. Keep names lowercase-kebab. Compress first: videos should ideally be under ~10 MB, images under ~500 KB.
2. Copy an existing gallery item in `editing/video-editing.html` or `editing/static-design.html` and update the `src`, title, tag and `alt` text.
3. If it should be featured, add a `.work-item` to `#work` in `index.html` (set `data-lightbox`, `data-lightbox-type="video"` or image, and `aria-label`).

### Keep `sitemap.xml` updated
Every public page must have a `<url>` entry. Add one for each new page, remove it when a page is deleted. Use the live domain `https://shoyaibraby.com/...` (see the domain issue in `docs/STATUS.md`).

## How to preview locally

From the project folder:

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123. Stop it with Ctrl+C. Needs internet for fonts and the animation libraries. Check the page at phone width (375px) as well as desktop, and scroll to the bottom so every `.reveal` triggers.

## How publishing works

- Hosted on **GitHub Pages** from `github.com/tabibhasann/shoyaib-portfolio`, branch `main`, root folder.
- **Pushing to `main` publishes to https://shoyaibraby.com within a minute or two.** There is no staging site and no review step.
- `CNAME` holds the custom domain; `.nojekyll` stops GitHub running Jekyll over the files.
- To undo a bad publish: `git revert <commit>` and push (with the user's OK).

## Working rules

1. **ALWAYS get the user's explicit OK before `git push`.** A push goes live on the public site immediately.
2. **Preview every change locally before committing** (command above), at phone and desktop width.
3. **Don't touch `CNAME` or `.nojekyll`.** Breaking them takes the site or domain offline.
4. Commit in small, clearly described steps on `main` (the site is small; no branches needed unless the user asks).
5. Keep it a plain static site: no build tools, frameworks or `npm` without the user agreeing first.
6. When changing a page's URL, title or description, update its canonical/OG tags and `sitemap.xml` in the same commit.
7. Record real decisions in `docs/DECISIONS.md` (dated). Update `docs/STATUS.md` before the session ends.
8. The user is still learning: explain what you changed and why in plain words.

## Key links

- Live site: https://shoyaibraby.com
- Repository: https://github.com/tabibhasann/shoyaib-portfolio
- GitHub Pages settings: https://github.com/tabibhasann/shoyaib-portfolio/settings/pages
- Shoyaib on Upwork: https://www.upwork.com/freelancers/~01d717d1dbe07f59e1?viewMode=1
- Contact email on the site: shoyaibr@gmail.com
- Older copies (reference only, not live): `~/Downloads/_archive/shoyaib/`
