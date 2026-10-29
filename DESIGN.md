---
name: SecurBank
description: A confident, teal-forward challenger-bank system built on pill shapes, tabular numbers and flat tonal panels.
colors:
  paper-white: "#ffffff"
  ink-grey: "#2c2c2c"
  muted-grey: "#5b5e66"
  on-teal-white: "#ffffff"
  confident-teal: "#026169"
  confident-teal-deepened: "#3e6470"
  bright-teal-accent: "#8fd6db"
  soft-mint-tint: "#e1eff0"
  lavender-grey-tile: "#f3f2f6"
  hairline-grey: "#e2e1e8"
  deep-teal: "#023b40"
  band-foreground-mint: "#e1eff0"
  card-white: "#ffffff"
  alert-red: "#b3261e"
  alert-red-tint: "#fbeaea"
typography:
  display:
    fontFamily: "Archivo, Arial Black, Impact, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "wdth 88"
  body:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  pill: "999px"
  xl: "32px"
  lg: "28px"
  md: "24px"
  sm: "16px"
  xs: "14px"
spacing:
  gutter: "16px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  section: "88px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.confident-teal}"
    textColor: "{colors.on-teal-white}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.5em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.confident-teal-deepened}"
    textColor: "{colors.on-teal-white}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-grey}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.5em"
    height: "44px"
  pill-toggle:
    backgroundColor: "{colors.lavender-grey-tile}"
    rounded: "{rounded.pill}"
    padding: "0.65em 1.1em"
    height: "44px"
  pill-toggle-active:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-grey}"
    rounded: "{rounded.pill}"
  input:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-grey}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
  tonal-tile:
    backgroundColor: "{colors.lavender-grey-tile}"
    rounded: "{rounded.xl}"
    padding: "28px"
  card-panel:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.xl}"
    padding: "28px"
---

# Design System: SecurBank

## 1. Overview

**Creative North Star: "The Steady Current"**

SecurBank's visual system is calm, confident forward motion, not stillness. It takes its cue from the hero's own line, "Sail into financial independence": one saturated teal runs through the whole site like current under a boat, surfacing in buttons, links, focus rings, and the feature surfaces that carry the most important choice on a page. Everything else sits on flat, tinted panels so that current reads clearly against a quiet background, and numbers (rates, repayments, limits) are the one place the system slows down and gets exact: tabular, aligned, impossible to misread.

This system explicitly rejects the generic SaaS-cream fintech look, a cream/off-white background with a single muted-blue accent and a uniform grid of rounded cards, and it equally rejects the dated, bureaucratic high-street bank look of dense navy tables and serif headers. SecurBank is fictitious, but the system is built to feel like a real, self-assured challenger bank: bold uppercase display type for the moments that matter, restrained body type everywhere else, and no decoration that doesn't carry a role.

**Key Characteristics:**
- One confident accent (teal), used deliberately rather than scattered
- Pill shapes everywhere a control is clickable: buttons, tabs, filters, chips, tags
- Flat tonal panels by default; shadows reserved for a short list of floating elements
- Heavy uppercase Archivo for headlines and big numbers; Inter for everything you read
- Tabular numerals wherever a number changes, compares, or lines up in a column

## 2. Colors

The palette is mostly neutral (white, ink, muted grey, lavender-grey tile) with one saturated teal carrying every call to action, and a near-black deep teal reserved for a handful of dark bands. Every color below is a light-theme value; the project also ships a dark theme that remaps most roles (see **Dark theme** below) rather than inverting them mechanically.

### Primary
- **Confident Teal** (`#026169`): the one accent. Buttons, links, focus rings, active nav/tab states, icon-chip foregrounds, the credit-card feature tile, and every `aria-current`/`aria-pressed`/`aria-selected` state.
- **Confident Teal, Deepened** (`#3e6470`): the hover state for Confident Teal. Never a separate accent, always a response to interaction.

### Secondary
- **Bright Teal Accent** (`#8fd6db`): the lighter accent reserved for dark surfaces, the highlighted word in the hero headline, section titles on the deep-teal bands, and the "Starter" card face.

### Neutral
- **Paper White** (`#ffffff`): page background.
- **Ink Grey** (`#2c2c2c`): body text.
- **Muted Grey** (`#5b5e66`): secondary text, captions, field hints, table sub-labels.
- **On-Teal White** (`#ffffff`): text and icons placed on top of Confident Teal or the deep-teal bands.
- **Soft Mint Tint** (`#e1eff0`): the system's tint color, used for selected states (nav pill, radio tiles, language option), light hero backgrounds (Credit cards hero), and icon chips.
- **Lavender-Grey Tile** (`#f3f2f6`): the default fill for flat panels that aren't white cards, offers, trust panel, product tiles, stat tiles, filter/tab tracks, FAQ accordion rows.
- **Hairline Grey** (`#e2e1e8`): every 1px border and divider.
- **Deep Teal** (`#023b40`): the dark band background (home's "We made it simple" section, the footer).
- **Band Foreground Mint** (`#e1eff0`): body text on the Deep Teal band (same value as Soft Mint Tint, distinct role).
- **Card White** (`#ffffff`): the surface for bordered cards and panels (search form, lang menu, tip tiles, form fields) as distinct from the page background, so a white card can still read as "lifted" against a tinted section.
- **Alert Red** (`#b3261e`) / **Alert Red Tint** (`#fbeaea`): form validation errors only. Never used decoratively.

### Dark theme
Dark mode remaps the palette rather than inverting it: background `#111618`, text `#eef1f2`, muted `#adb6b9`, Confident Teal becomes a lighter, higher-contrast `#4fb8c0` (hover `#72cad1`), the mint tint becomes `#18302f`, the tile becomes `#1a1f22`, the deep-teal band becomes `#06292c`, and card surfaces become `#171d20`. Bright Teal Accent and On-Teal White are not redefined in dark mode and keep their light-theme values.

### Named Rules
**The One Current Rule.** Confident Teal is the only saturated accent in the system. When a second accent color is needed, reach for Bright Teal Accent (a lighter tint of the same hue) before introducing a new hue.

**The Flat-Tile Default Rule.** A section's background panel is Lavender-Grey Tile or Soft Mint Tint, never a bordered white card, unless that panel is meant to read as something sitting on top of the page (see Elevation).

## 3. Typography

**Display Font:** Archivo (variable width, with Arial Black / Impact / system-ui as fallbacks)
**Body Font:** Inter (with system-ui / -apple-system / Segoe UI as fallbacks)

**Character:** Archivo at weight 900, compressed to ~88% font-stretch and set in uppercase with a tight line-height (0.88), supplies every moment of conviction: hero headlines, section titles, and every large number on the site. Inter carries everything the user actually reads at length, kept at a generous 1.55 line-height so dense content (tables, forms, footer legal copy) stays comfortable.

### Hierarchy
- **Display** (900, `clamp(2.4rem, 6vw, 4.6rem)` for section titles, up to `clamp(3.2rem, 8.5vw, 7rem)` for the home hero, line-height 0.88–0.95, uppercase, letter-spacing -0.01em): hero and section headlines, and every large standalone number (trust stats, the "4.85%" rate card, done-facts, earn-tile figures, card estimator output).
- **Headline / h3** (700, 1.1–1.35rem, line-height 1.2, Inter not Archivo): sub-section titles, tip-tile and product-tile names, card names.
- **Body** (400–600, 1rem/16px base, line-height 1.55; the `.lede` intro style caps at 52ch, body copy generally stays under 65–75ch): paragraph copy, descriptions, table cells.
- **Label / eyebrow** (700, 0.8rem, uppercase, letter-spacing 0.08em, colored Confident Teal): section kickers ("Popular offers"), the footer's "24/7 support" label.
- **Caption** (500–600, 0.78–0.95rem, Muted Grey): field hints, stat captions, footnotes, legal fine print.

### Named Rules
**The Tabular Numbers Rule.** Any number that changes, compares, or lines up in a column (calculator results, rate chips, comparison tables, the estimator, application result figures) is set with `font-variant-numeric: tabular-nums`. No exceptions.

**The Uppercase-Means-Weight Rule.** Uppercase + Archivo is reserved for headlines and hero numbers. Uppercase in Inter (labels, eyebrows, card names) stays small and letter-spaced; it never substitutes for the display treatment.

## 4. Elevation

The system is flat by default: tonal tiles, dark bands, and bordered panels all sit directly on the page with no shadow. Shadows exist only to lift a short, specific list of elements that genuinely float above the page plane, either because they're an overlay (a menu, a panel) or because they're the one object on the page meant to feel physically raised (the home calculator, a drawn credit card).

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 24px 40px -28px rgba(2, 40, 44, .45)`): dropdown menus and panels that open over content, language menu, search panel, mobile menu.
- **Floating card** (`box-shadow: 0 24px 60px -30px rgba(2, 97, 105, .35)`): the home calculator card, the one element on the home page meant to feel lifted off the hero.
- **Drawn card** (`box-shadow: 0 22px 44px -22px rgba(2, 40, 44, .55)`, stage variant `0 26px 50px -24px rgba(2, 40, 44, .6)`): the CSS-drawn credit card faces, wherever they appear at full size.
- **Hover lift** (`box-shadow: 0 14px 30px -22px rgba(2, 40, 44, .5)`): tip tiles on hover only; no shadow at rest.
- **Segment indicator** (`box-shadow: 0 1px 3px rgba(0, 0, 0, .12)`): the active tab/filter inside a segmented pill control, a 1px structural shadow, not a decorative one.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(2, 97, 105, .18)`): the soft teal glow on focused search and form fields, paired with a border color change.

### Named Rules
**The Floating-Element Rule.** If it's not an overlay, a drawn card, the home calculator, or responding to hover/focus, it doesn't get a shadow. Flat panels stay flat.

## 5. Components

Buttons, tiles, and fields are tactile and confident: firm pill shapes, borders that commit to teal on interaction rather than a vague tint, and enough padding that nothing feels squeezed.

### Buttons
- **Shape:** full pill (`border-radius: 999px`), minimum 44px tall (48px in the application flow).
- **Primary:** Confident Teal background, On-Teal White text; hover deepens to Confident Teal, Deepened; press scales to 0.97.
- **Secondary / Ghost:** transparent background, border in the current text color, hover fills Lavender-Grey Tile. On teal or dark-band surfaces, primary and secondary invert (white/ink button on a teal background).
- **Text link:** underlined, 2px underline in Confident Teal, 4px offset, never a button-shaped hit area.

### Pills, Tabs and Filters
A single segmented-control pattern reused for the home calculator's Savings/Mortgage tabs and the Credit cards filter row: a Lavender-Grey Tile track holding pill buttons, with the active segment lifted onto a Card White background plus the 1px **Segment indicator** shadow.
- **Toggle pill** (application form step pickers, card-details filters): 1.5px Hairline Grey border, full pill radius; selected state swaps the border to Confident Teal and fills Soft Mint Tint.
- **Radio tile** (application card picker): same selected treatment as the toggle pill, but on an 18px-radius card instead of a pill, plus a 1px Confident Teal ring (`box-shadow: 0 0 0 1px var(--primary)`).

### Cards / Containers
- **Tonal tile** (Lavender-Grey Tile or Soft Mint Tint, no border, no shadow): the default container for grouped content, offers, product tiles, trust panel, stat tiles, FAQ rows. Radius scales with size: 32px for hero-scale panels, 24px for mid-size tiles, 20px for small stat tiles.
- **Bordered card** (Card White background, 1px Hairline Grey border): used when a tile needs to read as a distinct lifted surface inside a tonal section, tip tiles, comparison table wrapper, document links. Tip tiles add the **Hover lift** shadow and a border-color shift to Confident Teal on hover only.
- **Feature variant:** the one tile per set that's the recommended choice (the Cashback card tile, the mortgage/credit-cards offer) inverts to a solid Confident Teal background with On-Teal White text, rather than adding a badge.
- **Signature component — the drawn credit card:** a CSS-only card face at a fixed 1.586 aspect ratio, built from a colored background (per product: Cashback teal, Voyager near-black, Clear light with a border, Starter light teal), a chip rectangle, an Archivo brand wordmark, a tabular masked number, and a faint full-opacity-8% ring drawn with `border` on a pseudo-element. It is the one place the brand's color-coding (not just the single teal accent) is allowed to carry meaning.

### Inputs / Fields
- **Form field** (`.f input`, `.f select`): Card White background, 1.5px Hairline Grey border, 16px radius, 48px min-height. Focus switches the border to Confident Teal plus the teal **Focus ring** shadow. Invalid state switches the border to Alert Red and the fill to Alert Red Tint, paired with `aria-invalid`.
- **Calculator field** (`.field`, used in the home calculator and the eligibility checker): a quieter variant, borderless big tabular-number input inside a 16px-radius 1px-bordered box, label in small Muted Grey above the value. Focus here switches the border to Ink Grey, not teal, a deliberate difference from form-field focus so a "value you're editing" never looks like a "field with an error nearby".
- **Range slider** (card estimator): native `input[type=range]`, Confident Teal accent-color, 28px tall hit target.
- **Checkbox / radio:** native controls with `accent-color: var(--primary)`, never custom-drawn.

### Navigation
- **Header:** sticky, Paper White background, 1px Hairline Grey bottom border. Nav links are pills; the current page gets a Soft Mint Tint pill (desktop) or Confident Teal text (mobile menu). Icon buttons (search, hamburger) are 44px circles that fill Lavender-Grey Tile on hover or while open.
- **Overlays:** the search panel, language dropdown, and mobile menu share the **Overlay** shadow and close each other, only one is ever open.
- **Mobile (≤820px):** the link row is replaced by a hamburger opening a full-width panel of large row links with hairline dividers between them.
- **Footer:** sits on the Deep Teal band. Four link columns (two at 900px, one at 420px), a brand column with the phone number set in Display type, and a legal block with the fictitious-bank statement.
- **Breadcrumbs (card details):** slash-separated, Muted Grey, bold Ink Grey links.
- **Accordion (FAQ):** Lavender-Grey Tile rows, a custom Archivo `+`/`–` glyph in place of the native disclosure triangle.

## 6. Do's and Don'ts

### Do:
- **Do** keep every clickable control pill-shaped (`border-radius: 999px`): buttons, tabs, filters, toggle pills, tags.
- **Do** set `font-variant-numeric: tabular-nums` on any number that changes, compares, or lines up (rates, calculator results, tables, estimator output, application result figures).
- **Do** keep Confident Teal (`#026169` light / `#4fb8c0` dark) as the only saturated accent, reaching for Bright Teal Accent (`#8fd6db`) rather than a new hue when a second value is needed.
- **Do** keep shadows limited to the Shadow Vocabulary's short list, overlays, the home calculator, drawn cards, and hover/focus states, and leave every other flat tile and band shadowless.
- **Do** maintain 44px minimum touch targets and the 3px Confident Teal `:focus-visible` outline with 3px offset on every interactive element.
- **Do** keep the fictitious-bank statement on every page, per PRODUCT.md.

### Don't:
- **Don't** use `border-left` or `border-right` as a colored accent stripe on any card, tile, or callout.
- **Don't** default to the generic SaaS-cream fintech look, a cream/off-white background, a single muted-blue accent, and a uniform grid of identical rounded cards, per PRODUCT.md's anti-reference.
- **Don't** swing to the opposite failure mode either: dense navy tables, serif headers, or clip-art icons that read as a dated, bureaucratic bank site.
- **Don't** add real regulator registration numbers, deposit-protection badges, or similar marks. SecurBank is fictitious; those marks would be misleading, per PRODUCT.md.
- **Don't** invert dark mode mechanically. Follow the project's actual remapped dark palette (Confident Teal lightens to `#4fb8c0`, the band darkens to `#06292c`) rather than a CSS filter or flat color-swap.
- **Don't** drop the paired error treatment (Alert Red border + Alert Red Tint fill + `aria-invalid`) when adding new form fields.
