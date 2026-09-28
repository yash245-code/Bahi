# Bahi — Color Theme: "Paper & Rust"

A warm, paper-toned base with a muted brick/rust accent (pulled toward brick rather than the common AI-generated clay tone), paired with a cool ink for text so it doesn't read as templated.

## Base Palette

| Role | Hex | Use |
|---|---|---|
| Base background | `#F7F6F3` | Page background |
| Surface | `#FFFFFF` | Cards, panels, tables |
| Border/divider | `#E6E3DC` | Table rules, dividers |
| Ink (primary text) | `#20211F` | Body text, headers |
| Accent (primary) | `#A8462F` | Buttons, links, active nav, focus states — brick red, evokes a ledger-stamp ink |
| Accent hover/pressed | `#853526` | Hover/pressed states on accent elements |
| Muted text | `#75766E` | Secondary text, labels, placeholders |

## Status Colors

Used across the ERP for invoices, stock levels, leave requests, and pipeline stages — these need to stay legible and distinct from the accent above.

| Status | Hex | Example use |
|---|---|---|
| Success | `#1F7A4D` | Paid, approved, in-stock |
| Warning | `#B8790A` | Due soon, low stock |
| Danger | `#B23A2E` | Overdue, rejected, out-of-stock |
| Info/neutral | `#75766E` | Draft, pending |

## Notes
- Reserve border-radius and shadow for primary containers (modals, main content cards) — keep table rows and inline elements flat rather than applying the same radius/shadow to everything regardless of hierarchy.
- Since the accent is a red/rust tone, keep the Danger status color (`#B23A2E`) visually distinct enough from the primary accent (`#A8462F`) in context — consider reserving deep saturation for Danger and keeping the accent slightly more muted, or pairing Danger with an icon (not color alone) in status badges.
