# SecurBank refresh: design handoff

This folder is the design source for a refresh of the SecurBank demo site (https://www.securbankdemo.com/). SecurBank is a **fictitious bank** used to demonstrate Adobe technology. Every product, rate, fee, phone number and offer in these designs is an example.

The designs were built as interactive prototypes on a Claude design canvas. This README is the brief: read it first, then use the page files as the detailed spec for layout, styles, copy and behaviour.

## Suggested first prompt for Claude Code

> Read `design/README.md`, then the four files in `design/pages/`. Build these pages in this project's stack, matching the layout, styles, copy and behaviour. Use the assets in `design/assets/`. Treat everything under "Prototype shortcuts" as things to replace properly, and ask me about anything under "Open decisions" before guessing.

---

## What's in the folder

| Path | What it is |
|---|---|
| `pages/Main.dc.html` | Home page |
| `pages/CreditCards.dc.html` | Credit cards landing page |
| `pages/CardDetails.dc.html` | Card details page (one template, four cards) |
| `pages/Apply.dc.html` | Credit card application form (four steps and a result screen) |
| `assets/images/*.webp` | Photos: `hero`, `mortgage`, `cards`, `family`, `online`, `support` |
| `assets/logo/securbank-logo.svg` | Logo, original colours (teal box, white "Secur", navy "Bank") |

Suggested routes: `/`, `/credit-cards`, `/credit-cards/{card}` (cashback, voyager, clear, starter), `/credit-cards/apply`.

## How to read the `.dc.html` files

These files are in the design canvas's component format. They are valid HTML but **will not run as-is**. Read them as a precise spec:

- **`<helmet><style>…</style></helmet>`** holds the page's CSS. All styling is class-based plus a few inline styles. This is the real CSS to port.
- **Markup inside `<x-dc>`** is the page's HTML structure and final copy.
- **`{{name}}`** placeholders are values from the `renderVals()` function in the `<script type="text/x-dc">` block at the bottom of each file. That script is plain JavaScript and holds all the state, data and logic (calculators, filters, form steps, search index, language list).
- **`<sc-if value="{{x}}">`** renders its content only when `x` is true. **`<sc-for list="{{items}}" as="item">`** repeats its content for each item.
- **`onClick="{{fn}}"`** and similar attributes are event handlers defined in `renderVals()`.
- **Links to `*.dc.html`** are links between the pages; map them to the routes above.
- **`<script src="./support.js">`** is the canvas runtime. Ignore it.
- **`data-props`** on the script tag declares design-time settings. The only one that matters is `theme` (`light` / `dark` / `auto`), explained under Theming.

Images in the pages already point at `../assets/images/…`.

---

## Design tokens

### Colour (light theme, the default)

The CSS variable names come from an earlier draft. `--lime` is actually the primary teal, so rename it (to `--primary`, say) when you port it.

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--fg` | `#2c2c2c` | Body text |
| `--muted` | `#5b5e66` | Secondary text |
| `--lime` | `#026169` | **Primary**: buttons, links, accents, feature tiles |
| `--lime-hover` | `#3e6470` | Primary hover |
| `--ink` | `#ffffff` | Text on primary |
| `--pop` | `#8fd6db` | Light teal accent on dark bands |
| `--mint` | `#e1eff0` | Soft teal tint (hero on Credit cards, icon chips, selected states) |
| `--tile` | `#f3f2f6` | Lavender-grey tiles and panels |
| `--line` | `#e2e1e8` | Borders and dividers |
| `--band` | `#023b40` | Deep teal bands and footer |
| `--band-fg` | `#e1eff0` | Text on bands |
| `--card` | `#ffffff` | Card and panel surfaces |
| `--err` / `--err-bg` | `#b3261e` / `#fbeaea` | Form errors (application form only) |

Logo colours: teal `#0296A6`, navy `#171C28`. On the site, the logo's "Bank" uses the current text colour so it works in dark mode and on the footer band (white there).

Card face colours (the drawn credit cards): Cashback `#026169`, Voyager `#14181a`, Clear `#f3f2f6` with a `#e2e1e8` border, Starter `#8fd6db`, chip `#d9c58b`.

### Colour (dark theme)

`--bg #111618`, `--fg #eef1f2`, `--muted #adb6b9`, `--ink #04262a`, `--lime #4fb8c0`, `--lime-hover #72cad1`, `--mint #18302f`, `--tile #1a1f22`, `--line #2b3438`, `--band #06292c`, `--band-fg #cfe8ea`, `--card #171d20`, `--err #ffb4ab`, `--err-bg #3a1a18`.

### Theming

Each page has light, dark and auto modes, set on the page root with `data-theme`. Auto follows `prefers-color-scheme`. **For production, use auto.** Light was only fixed as the default on the canvas for review.

### Type

| Role | Font | Settings |
|---|---|---|
| Display: hero headlines, section titles, big numbers, trust stats | **Archivo** (Google Fonts, variable width) | weight 900, `font-stretch: 88%`, uppercase, line-height about 0.88, letter-spacing -0.01em |
| Body, UI, forms, tables | **Inter** (Google Fonts) | 400, 500, 600, 700; 16px base; line-height 1.55 |

Use tabular figures (`font-variant-numeric: tabular-nums`) everywhere numbers change or line up: calculators, rates, tables.

Font loading: `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,800;62..125,900&family=Inter:wght@400;500;600;700&display=swap`

### Shape, spacing, layout

- **Radii:** pills 999px (buttons, tabs, chips); 32px for large cards, bands and the calculator; 24px for tiles and tables; 16–20px for fields and small panels; 14px for icon chips.
- **Container:** `max-width: 1200px`, 16px side gutter.
- **Section rhythm:** 88px vertical padding (`section.block`); dark bands use 96px.
- **Breakpoints:** 900px (multi-column grids stack), 820px (desktop nav becomes the hamburger), 700px (trust panel stacks), 600px, 520px and 420px (small-phone adjustments).
- **Touch targets:** at least 44px.
- **Focus:** a 3px primary-colour outline with 3px offset on `:focus-visible`.
- **Motion:** only small transitions (150ms), all switched off under `prefers-reduced-motion`.

---

## Shared components

**Header** (home, Credit cards, card details):
- **Layout:** sticky. Logo on the left, then the main links: Accounts, Credit cards, Loans, Insurance.
- **Tools group:** a search icon and a language selector, close together.
- **Account group:** a thin divider, then "Log in".
- **Search:** opens a panel below the header with an autofocused field and "Popular" shortcut chips. Typing filters a small index into live results (title and description); there's a "no results" state, and Esc closes it.
- **Language:** a globe, the current language code and a chevron. Opens a dropdown of eight languages, each in its own language with its region: English (UK), Français, Deutsch, Español, Italiano, 日本語, 한국어, 简体中文. The current one shows a tick; Esc closes it.
- **Hamburger (820px and below):** replaces the main links and opens a full-width panel with the four links as large rows with chevrons. "Log in" stays visible at all widths.
- **One overlay at a time:** opening search, language or the menu closes the other two.
- **Current page:** marked with `aria-current="page"`, shown as a mint pill on desktop and teal text in the mobile menu.

**Application header:** logo, language selector and a "Secure application" lock badge. There's deliberately no search or main nav in the checkout-style flow.

**Footer** (home, Credit cards, card details), on the deep teal band:
- **Brand column:** logo with white "Bank", a one-line description, a 24/7 phone number and a lost-card note, and two outlined app buttons (iPhone app, Android app).
- **Four link columns:** Banking, Help and support, Security, About SecurBank.
- **Legal block:** the fictitious-bank statement and "credit subject to status".
- **Bottom bar:** © 2026, Privacy, Cookies, Terms of use, Accessibility, Sitemap, and "Follow us" with LinkedIn, Instagram and YouTube as text links.
- **Responsive:** columns go to two at 900px and one at 420px.
- The application form keeps a one-line footer.

**Buttons:** pill-shaped. Primary is teal with white text; secondary is outlined in the current text colour; on teal or dark surfaces they invert.

**Tip tiles** ("Cost of living support" on home, "Every card comes with" on Credit cards):
- **Content:** each whole tile is a link. A 48px mint icon chip sits beside the title, the description sits below, and a teal action link with an arrow is pinned to the bottom.
- **Hover:** the border turns teal, a soft shadow appears and the arrow nudges right.

**Drawn credit cards:** CSS-only card faces at a 1.586 aspect ratio, with a chip, the "SecurBank" wordmark, a masked number, the card name and a faint ring ornament. They're used in the Credit cards hero (three fanned), the product tiles, the details hero and the application sidebar.

---

## Pages and behaviour

### Home (`Main.dc.html`)

1. **Hero:**
   - full-bleed photo (`hero.webp`) under a left-to-right teal gradient;
   - the headline "Sail into **financial** independence", with "financial" in the light teal accent;
   - a supporting line and two CTAs.
2. **Calculator card**, overlapping the bottom of the hero:
   - Savings and Mortgage tabs, an amount field (GBP) and a term select;
   - live results and a CTA whose text and link change by tab.
   - **Savings:** 4.85% AER, compounded monthly, `p × (1 + r/12)^(12y)`. Shows interest earned and the end balance.
   - **Mortgage:** 5.29% APRC, standard repayment `p·m / (1 − (1+m)^−n)`. Shows the monthly repayment and total repaid.
   - Switching tabs resets the defaults: £10,000 over 3 years, or £250,000 over 25 years.
   - Next to it is a **trust panel**: "100% online", "No hidden fees", "Flexible terms". It sizes to its content with 34px between items.
3. **Popular offers:** three tiles (Mortgage loans, credit cards as the teal feature tile, Build a strong foundation), each with a photo.
4. **"We made it simple" band:** dark teal with a checklist, a photo, and an overlapping 4.85% rate card.
5. **Cost of living support:** a photo panel and the four tip tiles (Budget planner, Payment holidays, Bill protection, Talk to us).
6. Footer.

### Credit cards (`CreditCards.dc.html`)

1. **Hero** on mint: the headline "Cards that **pay you** back", two CTAs, two reassurance ticks and three fanned card faces.
2. **Find your card:** filter pills (All, Rewards, Low rate, Building credit) and four product tiles in a 2×2 grid.
   - **Cards:** Cashback (the teal feature tile, "Most popular"), Voyager, Clear and Starter.
   - **Each tile:** card art, a tag, the name, a description, three stats (headline benefit, annual fee, representative APR), two ticks, "Apply now" and "Card details".
   - **Filter mapping:** Rewards shows Cashback and Voyager; Low rate shows Clear; Building credit shows Starter.
3. **Side by side:** a comparison table that scrolls horizontally on small screens.
4. **Know before you apply:** a dark band with an eligibility checker (income and employment status). The result lists likely cards (see Prototype shortcuts).
5. **Every card comes with:** a photo panel and four tip tiles.
6. **Questions, answered:** four `<details>` accordions, the first one open.
7. **Representative example** box, then the footer.

### Card details (`CardDetails.dc.html`)

- **Template:** one template driven by a data object with four cards (`cashback`, `voyager`, `clear`, `starter`). All copy, rates, tiles and table rows for each card are in `data()` in the script. In production this becomes one route per card. The pill switcher at the top is a prototype convenience, not a required feature.
- **Sections:**
  - breadcrumb;
  - hero with the large card art;
  - four key-fact tiles (the first in teal);
  - "How you earn" or "How it helps": three tiles;
  - estimator band with a range slider from £100 to £5,000;
  - "Rates and fees" table next to "Can I apply?" requirements and three document links;
  - "Ready to apply?" teal CTA panel;
  - representative example;
  - footer.
- **Estimator formulas** (all illustrative):
  - Cashback: `min(100, spend×3×4%) + spend×12×1%`.
  - Voyager: `spend×12 + 20,000` points.
  - Clear: `max(0, balance×21.9%×2×0.55 − balance×3%)` interest saved.
  - Starter: `spend×34.9%×0.5` interest avoided.

### Application form (`Apply.dc.html`)

- **Progress bar:** four steps.
  1. **Your card and details:** card radio tiles, title, first and last name, date of birth, mobile, email.
  2. **Your home:** address lines, town, postcode, time at address (pills), residential status.
  3. **Your finances:** employment, employer (optional), annual income, monthly housing cost, balance transfer intent.
  4. **Check and submit:** a review summary with an "Edit" link per section, plus two consent checkboxes.
  5. **Result:** "You're approved" with credit limit, APR, reference number and next steps.
- **Validation:** "Continue" checks the required fields. On failure it shows an error summary (`role="alert"`) and marks fields with `aria-invalid`.
- **Sidebar:** the chosen card's summary, plus "Good to know" notes.

---

## Prototype shortcuts: replace these, don't copy them

- **State is per page:** the chosen language and theme aren't shared between pages. In production, keep the language in the URL or a cookie.
- **Search** uses a hard-coded 12-item index in each page's script. Replace it with real site search.
- **Language** only changes the label; no copy is translated.
- **Eligibility checker logic is made up:**
  - students or income under £12k get Starter only;
  - otherwise Clear is always included;
  - £18k or more adds Cashback, and £35k or more adds Voyager;
  - under £18k adds Starter alongside Clear.

  This is for illustration only, not a credit decision.
- **Application approval is always successful.** The limit is `15% of income`, rounded to £250 and capped per card. The reference number is fake, and nothing is submitted or stored.
- **Card details** uses an on-page switcher instead of routes.
- **External links:** most nav, footer and tile links still go to the live securbankdemo.com.
- **Copy is literal markup.** Move it into your CMS or content layer as appropriate.

## Content and compliance notes

- Every page must carry the fictitious-bank statement (the footer legal block has it).
- **Do not add** regulator registration numbers, deposit-protection badges or similar marks. The bank isn't real, so they would be misleading.
- The phone number `0808 157 0192` is in Ofcom's range reserved for drama and fiction, so it can't reach anyone. Keep it, or use another number from a reserved range.
- App store and social links are text buttons on purpose. Only swap in official badges or logos if you have approved assets.
- Currency is GBP throughout.

## Accessibility

Built to WCAG AA intent. Keep all of these when porting:
- semantic buttons, links and labels;
- `aria-expanded` on toggles, `aria-pressed` on filters, switchers and language options;
- `aria-current` for the current page and step;
- `aria-live` on calculator and estimator results;
- the error summary with `role="alert"`;
- decorative SVGs marked `aria-hidden`;
- 44px or larger targets;
- visible focus outlines;
- text contrast of at least 4.5:1 in both themes.

## Open decisions (ask before choosing)

1. **Fonts:** Archivo with Inter is the working pairing. Alternatives under consideration:
   - Acumin Variable for everything, via Adobe Fonts;
   - Source Serif 4 with Source Sans 3, for a more established feel;
   - Bricolage Grotesque with Figtree, for a friendlier feel;
   - keep Archivo but use sentence case at a lighter weight for section headings.
2. **Teal alignment:** the logo teal `#0296A6` is brighter than the UI primary `#026169`. One option is to align the brand accent to the logo, keeping the darker teal for text and buttons so contrast holds.
3. **Language list and translation scope:** which markets, and whether copy actually gets translated.
4. **Logo on the card faces:** they currently show a plain "SecurBank" wordmark.
5. **Real destinations** for links that still point to the live site.
6. **Mobile layouts:** responsive rules are in the CSS, but no phone-width mockups were drawn. Check each page at 390px.
