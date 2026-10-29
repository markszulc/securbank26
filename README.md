# SecurBank demo site

Static HTML, CSS and JavaScript built from the design handoff in `design/`. SecurBank is a fictitious bank; every product, rate and phone number is an example.

## Run it

```bash
npm run serve
```

Then open http://localhost:8080. The `site/` folder is the whole deployable site and needs no build step to serve. Links are relative, so it works from any folder.

**Hosting:** every push to `main` publishes `site/` to GitHub Pages via `.github/workflows/pages.yml`. Run `npm run build` and commit the regenerated HTML before pushing, because the workflow doesn't build.

## Edit it

- **CSS and JavaScript:** edit the files in `site/assets/` directly.
- **Page markup:** edit `src/pages/` and `src/partials/`, then run `npm run build` to regenerate the HTML in `site/`. The header, footer and language menu are shared partials.
- **Card details:** the four card pages come from one template, `src/pages/card.html`, filled from `site/assets/data/cards.json`. The application form reads the same file.
- **Search:** results come from `site/assets/data/search-index.json`.

| Route | Source |
|---|---|
| `/` | `src/pages/index.html` |
| `/credit-cards/` | `src/pages/credit-cards.html` |
| `/credit-cards/{cashback,voyager,clear,starter}/` | `src/pages/card.html` + `cards.json` |
| `/credit-cards/apply/` (`?card=` preselects a card) | `src/pages/apply.html` |

## Still stand-ins (need a backend or content decisions)

- **Search** filters a static JSON index. It is not real site search.
- **Language** is saved in a `sb_lang` cookie and shown in the header. No copy is translated.
- **Eligibility checker** rules in `site/assets/js/cards.js` are invented for illustration.
- **Application approval** happens in `submitApplication()` in `site/assets/js/apply.js`. Every application is approved and nothing is sent. Answers are kept in `sessionStorage` for the current tab only, although the copy says "saved for 30 days".
- **Links** to pages outside these four routes point to `#`.
