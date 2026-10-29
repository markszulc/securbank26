# Product

## Register

brand

## Users

Retail banking customers comparing credit cards, savings and mortgages, then starting a credit card application. They arrive comparison-shopping (often on mobile), need to trust the numbers before committing, and expect to move from browsing straight into a short, low-friction application without re-entering context. SecurBank itself is fictitious; it exists to demonstrate design-to-code work, but the audience should be designed for as if the bank were real.

## Product Purpose

A consumer banking marketing site (home, credit cards landing, card details) plus a four-step credit card application flow. The `design/` handoff (built on a Claude design canvas) is a first draft, not a ceiling: this project is a starting point for a real redesign, not a one-time port. Success means critiquing and pushing the handoff further — sharper visual decisions, better UX, stronger craft — while keeping the site coherent as one bank, not a marketing site bolted onto a generic form tool.

## Brand Personality

Confident, modern, approachable. Bold uppercase display type, a committed teal/navy palette, pill-shaped controls and generous whitespace read as a self-assured challenger bank, not a legacy institution and not a faceless SaaS tool.

## Anti-references

Generic SaaS-cream fintech: the cliché cream/off-white background, single muted-blue accent, and uniform rounded-card template that most fintech sites converge on. Also avoid the opposite failure mode, a dated, bureaucratic high-street bank look (dense navy tables, serif headers, clip-art icons).

## Design Principles

1. **Push past the handoff.** `design/README.md` and the `.dc.html` files are a first draft. Treat them as a baseline to critique and improve, not a spec to replicate exactly — "Open decisions" in that README are open, not settled.
2. **Confidence over caution.** Favor the bold, committed choices already in play (heavy uppercase Archivo, a saturated teal) over safe, neutral SaaS defaults. Timidity reads as the anti-reference.
3. **Trust through clarity.** This is a financial decision flow: numbers (rates, fees, repayments) must be legible and tabular, errors must be explicit and recoverable, and nothing should imply more certainty or legitimacy than a fictitious demo bank has earned.
4. **Fictitious but credible.** Keep the fictitious-bank statement on every page and never add real regulator registration numbers, deposit-protection badges, or similar marks — while still making the brand feel like a real, credible bank, not a placeholder.
5. **One brand, every surface.** The marketing pages and the application form must read as the same institution: shared type, color, and voice, not a polished landing page handing off to a generic checkout form.

## Accessibility & Inclusion

Built to WCAG AA intent, carried over from the design handoff: semantic buttons/links/labels, `aria-expanded`/`aria-pressed`/`aria-current`/`aria-live` used correctly, an error summary with `role="alert"`, decorative SVGs marked `aria-hidden`, 44px minimum touch targets, visible focus outlines, and text contrast of at least 4.5:1 in both light and dark themes. Motion is subtle (150ms transitions) and disabled under `prefers-reduced-motion`.
