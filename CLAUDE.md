# Đorđe Milenković — portfolio

Personal site of Đorđe (Đole), chef. Talk to him in Serbian (Latin script), casual tone, no flattery. Content about his career, kitchens and professional practice is his call.

Live: djordje-milenkovic.netlify.app (`SITE` in `astro.config.mjs`, until a custom domain). Static Astro site in three languages: `/sr/`, `/en/`, `/ru/`; `/` redirects. Hidden from search engines while `site.indexable` is `false` in `src/site.config.ts`.

## Commands

- `npm run build`: `astro build` into `dist/`. Must pass before every push.
- `npm run dev` / `npm run preview`: local server on port 4321. Playwright and Chromium are available for screenshots.
- `npm run check-texts`: lists texts still marked `[CHECK]` (shown in dev, stripped from the build).

## Structure

- `src/pages/[lang]/index.astro`: the home page, one component per section (`src/components/`). `pre-opening.astro` is the pre-opening page.
- `src/i18n/{sr,en,ru}.json`: all texts; `en.json` defines the shape (`Dict`).
- `src/site.config.ts`: name, email, LinkedIn, CV paths, `indexable`, `showTestimonial`.
- `src/styles/global.css`: colours and fonts in the `@theme` block. Navy `#0a1628` base, ice blue `#9fc3ef` accent, Playfair Display and Inter.
- `src/data/domains.ts`: the six knowledge-area colours.
- `src/assets/images/`: photos (replace a file under the same name). `public/cv/`: CV PDFs.

## Workflow

- Never push straight to `main`: `main` deploys to Netlify at once. Work on a separate branch, push it, send Đole a Netlify preview URL or a screenshot, and merge into `main` only after his OK.
- Before any change users can see, show him a preview and wait for his OK.

## Project family

One name, three doors. The umbrella brand is Đorđe himself; the portfolio is the centre, Academy and MacroChef are his projects. The three stay separate: own repo, own deploy, own look and tone. Never merge repos or apps. This section is the same in all three CLAUDE.md files; when it changes, change it in all three.

| Project | What it is | Repo | Live | Stack | Deploys from |
|---|---|---|---|---|---|
| Portfolio | Who he is | `djordje21/portfolio` | djordje-milenkovic.netlify.app (`/sr/`, `/en/`, `/ru/`) | Astro + Tailwind, static | `main` → Netlify |
| Macro Chef Academy | What he gives: cooking school for young cooks and learners | `djordje21/macrochef-academy` | macrochef-academy.macrochef.workers.dev | React + Vite PWA, no backend | `main` → Cloudflare Workers Builds |
| MacroChef | What he builds: ad-free calorie and macro tracker | `djordje21/macrochef` | macrochef.macrochef.workers.dev | React + Vite PWA, Dexie, Supabase accounts | `ccr-e80a272b-xkto0p` → Cloudflare Workers Builds |

MacroChef's `netlify.toml` is a leftover; Cloudflare is the only live host. Each project has its own Claude Code session; the main session coordinates the three and tells Đole every task it sends to another session.

### Shared signature

- Signature line, exactly: **Executive Chef Đorđe Milenković · MacroChef · Macro Chef Academy**. It goes in each project's footer, with the monogram. The name of the project you are in is not a link.
- Monogram: Đorđe's own hand-drawn ĐM signature, traced to one SVG path. Each repo has it as a `Monogram` component; reuse it, do not redraw it. The app name is written "Macro Chef Academy" (separate words) everywhere users see it; the in-app badge stays "MCA".
- Thread colour: yellow `#F5B83D`. In MacroChef and Academy it is already the primary/grade-1 accent. In the portfolio the signature uses gold `#C8A982` instead (monogram and dots only, `--color-gold`); the portfolio stays navy with ice blue.
- Full rules for signature, colour and tone: `docs/family.md` in the portfolio repo.

### Bridges

| Bridge | From | To | Status |
|---|---|---|---|
| Family links in the burger menu | all three | the other two | built: Academy menu has a "Projekti" block at the bottom above the signature (three rows Ko sam / Šta gradim / Šta dajem joined by a yellow line, `.menu-family`); MacroChef side menu has pills under the head; portfolio mobile menu has app pills and nav "Projekti" |
| "Moji projekti" cards | Portfolio (`Projects.astro`, `#projects`) | Academy, MacroChef | built |
| Footer signature with links | all three | the other two | built: portfolio footer, Academy landing and menu, MacroChef side menu |
| "Ko predaje" → "Ceo put" | Academy landing (`.chef-path`) | Portfolio | built |
| "Otvori u MacroChef-u" | Academy lesson end (`.open-mc`) | MacroChef `#/academy?lesson=&name=&kcal=&p=&c=&f=` | built: MacroChef saves the dish as a food (`baseKey` `academy:<lesson id>`, `src/db/academy.ts`) and opens it ready to log |
| "Nauči tehniku" | MacroChef library recipe (`TECHNIQUE` in `src/app/family.ts`, category → grade-1 module) and any Academy dish in the add panel (its own lesson) | Academy | built |

Every cross-link carries the language: `?lang=sr|en|ru` before the hash for the apps, `/sr/` etc. for the portfolio. Both apps read `?lang=` on start and store it.

Deep links: both apps use hash routing. Academy lesson: `https://macrochef-academy.macrochef.workers.dev/#/lesson/<id>` (ids like `5.2`, `2.4.1`, `3.10.5`). MacroChef library recipe: `https://macrochef.macrochef.workers.dev/#/lib?key=<key>`. MacroChef data lives on the device (IndexedDB), so anything passed between the apps goes in the link.

Known gap: an Academy `recipe` is only a name and macros per 100 g; a MacroChef recipe is built from ingredients in raw grams. A full recipe import needs ingredient lists for the Academy dishes, which is content Đole reviews.

### Family rules

- Academy is shown on the portfolio (cards, menu, footer) since Đole asked to connect all three on 2026-10-29. One switch hides it again: `site.family.showAcademyLink` in the portfolio. Grades 2 and 3 are still not reviewed by him.
- Before any change users can see on the portfolio or in MacroChef, show Đole a preview (screenshot or preview URL) and wait for his OK.
- Later, not now: one domain with three addresses, possibly one shared account.
