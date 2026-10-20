# Đorđe Milenković — portfolio

Astro + Tailwind CSS, statičan sajt na tri jezika (`/sr`, `/en`, `/ru`).

## Pokretanje lokalno

Potreban je [Node.js](https://nodejs.org) 20 ili noviji.

```bash
git clone https://github.com/djordje21/portfolio.git
cd portfolio
npm install
npm run dev
```

Otvori http://localhost:4321/en/

| Komanda | Šta radi |
|---|---|
| `npm run dev` | lokalni server, menja se uživo dok menjaš fajlove |
| `npm run build` | pravi finalni sajt u `dist/` |
| `npm run preview` | prikazuje finalni build lokalno |
| `npm run check-texts` | izlistava sve tekstove označene sa `[CHECK]` |

## Gde se šta menja

| Šta | Gde |
|---|---|
| Svi tekstovi | `src/i18n/sr.json`, `en.json`, `ru.json` |
| Email, LinkedIn, CV fajlovi | `src/site.config.ts` |
| Fotografije | `src/assets/images/` (zameni fajl istim imenom) |
| CV PDF | `public/cv/` |
| Boje i fontovi | `src/styles/global.css` (blok `@theme`) |
| Domen | `astro.config.mjs` → `SITE` |

**Oznaka `[CHECK]`** u tekstovima znači da to treba da proveriš. U `npm run dev` se vidi na sajtu,
a iz finalnog build-a se automatski briše — zato pokreni `npm run check-texts` pre objave.
