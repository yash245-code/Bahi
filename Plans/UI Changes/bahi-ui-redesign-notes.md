# Bahi Landing Page — UI Redesign Notes

## Global
- **Background color:** `#222222` (dark base across the site, replacing the current cream/white background)
- Add subtle noise/grain texture overlay on the dark background for tactility (premium dev-tool feel, e.g. Linear/Vercel style)
- Keep the terracotta/rust accent color, but increase its usage — use it as a full section background wash (not just text/buttons) to create visual rhythm between sections

## Hero Section
- Move away from centered-hero layout — switch to **asymmetric split**:
  - Left (~60%): headline, subtext, CTAs
  - Right (~40%): live animated product visual (pull the terminal/dashboard preview up here instead of at the bottom of the page)
- Typography contrast: make "One Unified Platform" visually distinct from the rest of the headline — different weight/style (e.g. italic serif or monospace accent) instead of just a color change
- Add a cursor-following gradient blob behind the hero text for subtle motion
- Add magnetic hover effect on the primary CTA button

## Stats Bar
- Replace the 4 equal-width static columns with an **uneven bento-grid layout**
- Add animated counter-up effect on scroll for the numbers (6 Modules, 99.99%, $450M+, <100ms)

## Terminal/Dashboard Preview Widget
- Add a live-typing effect inside the terminal window
- Make the "MongoDB Connected" status dot pulse subtly to signal "live" status

## Cards / Module Sections
- Replace flat, bordered cards with **layered, overlapping cards**:
  - Slight rotation (2–3°) per card
  - Soft layered shadows
  - Hover-lift interaction (card rises + shadow deepens on hover)

## Full Suggestion List (Reference)

1. **Ditch the centered-hero cliché — go asymmetric**
   Split the hero: headline + CTA on the left (60%), and a live animated product visual on the right (the terminal/dashboard preview you already have at the bottom — pull it up here instead of burying it below the fold). This immediately shows the product instead of just describing it.

2. **Typography as a design element**
   Right now "One Unified Platform" just changes color. Instead: make it a different weight/style entirely — e.g., headline in a bold grotesk, and treat "One Unified Platform" in an italic serif or a monospace accent (ties into your "PAPER & RUST" / dev-tool branding). That contrast reads as intentional, not templated.

3. **Rethink the accent color usage**
   Terracotta/rust is a strong, unusual choice — lean into it harder. Use it as a background wash in one section (not just text/buttons), like a dark rust-on-cream section break, so the page has rhythm instead of white-white-white.

4. **Stat bar → make it feel "alive"**
   Instead of static numbers in a row, add a subtle animated counter-up on scroll, and use a bento-grid layout (uneven card sizes) instead of 4 equal columns — draws the eye more naturally.

5. **Replace flat cards with depth via layering**
   For module/feature sections: overlapping cards with subtle rotation (2-3°), soft layered shadows, and a hover-lift — gives a tactile, modern feel vs flat bordered boxes.

6. **Grain/texture background**
   A very subtle noise/grain texture on the cream background (common in premium dev-tool sites like Linear, Vercel) adds tactility without being loud — fits "Paper & Rust" perfectly.

7. **Micro-interactions**
   Cursor-following gradient blob behind the hero, magnetic buttons, and a live-typing effect in that terminal window ("MongoDB Connected" pulsing dot) — small touches that make it feel engineered, not templated.

## Overall Goal
Move the design away from a generic centered SaaS template toward a distinctive, premium, dark-themed dev-tool aesthetic consistent with the "Paper & Rust" branding — using asymmetry, typographic contrast, texture, and micro-interactions instead of default template patterns.
