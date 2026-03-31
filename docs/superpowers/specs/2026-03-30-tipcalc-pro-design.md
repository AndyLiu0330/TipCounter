# TipCalc Pro — Design Spec

## Overview

TipCalc Pro is a mobile-first PWA tip calculator with manual data entry, flexible tipping, bill splitting, and local history. Built as a single-page React app, fully offline, no server required.

## Decisions

- **v1 scope:** Full PRD minus Copy & Share (deferred to v2)
- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS v4
- **Storage:** localStorage (JSON arrays)
- **Architecture:** Single-page app with view toggle (calculator / history)
- **Theme:** Light/dark mode with system preference detection

---

## Tech Stack & Project Structure

- Vite + React 18 + TypeScript
- Tailwind CSS v4 with `darkMode: 'class'`
- `vite-plugin-pwa` for offline/installable PWA
- localStorage for history persistence
- No external UI component library

```
src/
  components/       # UI components
  hooks/            # Custom hooks (useLocalStorage, useTheme)
  utils/            # Calculation logic, formatting helpers
  types.ts          # Shared TypeScript types
  App.tsx           # Root — manages view toggle (calculator vs history)
  main.tsx          # Entry point
```

---

## Calculator View

Top-to-bottom layout, mobile-first. Components in order:

1. **Header** — App name ("TipCalc Pro"), theme toggle (sun/moon icon), history button
2. **MerchantInput** — Optional text field for restaurant/shop name
3. **AmountInputs** — Two numeric fields: Subtotal and Tax. Subtotal auto-focused on load.
4. **TipSelector** — Preset buttons (10%, 15%, 18%, 20%) + custom percentage input + flat dollar tip input + "Round Up" button
5. **GuestSplitter** — `−` / `+` buttons with guest count (default: 1, minimum: 1)
6. **ResultsDisplay** — Always visible at bottom (`position: sticky`), never blocked by keyboard. Shows:
   - Tip amount
   - Grand Total (Subtotal + Tax + Tip)
   - Per Person amount (Grand Total / guests)
7. **SaveButton** — Saves current calculation to history

### Calculation Logic

- **Tip Amount:** `Subtotal * tipPercent / 100` (percentage mode) or flat dollar amount
- **Grand Total:** `Subtotal + Tax + Tip`
- **Per Person:** `Grand Total / guests`
- **Round Up:** Adjusts tip so Grand Total becomes the next whole dollar (e.g., $47.63 -> $48.00)

All calculations update in real-time as inputs change.

### Input Behavior

- Subtotal field auto-focused on app load
- Numeric inputs accept decimals (two decimal places for currency)
- Selecting a tip preset deselects custom input and vice versa
- Round Up recalculates the tip amount and deselects any active preset

---

## History View

Toggled via the history button in the header. Replaces the calculator view (not a separate route).

### History List

Saved calculations displayed in reverse chronological order. Each card shows:
- Merchant name (or "Untitled" if blank)
- Date/time saved
- Grand Total
- Number of guests + per-person amount

### Search

Search bar at the top filters history by merchant name (case-insensitive substring match).

### Actions

- Delete individual records (with confirmation)
- No edit — users start a fresh calculation instead

### Data Model

Stored in localStorage as a JSON array under key `tipcalc-history`:

```ts
interface CalculationRecord {
  id: string;          // crypto.randomUUID()
  merchantName: string;
  subtotal: number;
  tax: number;
  tipPercent: number | null;
  tipFlat: number | null;
  tipAmount: number;
  grandTotal: number;
  guests: number;
  perPerson: number;
  createdAt: string;   // ISO 8601
}
```

---

## Theme

- Light and dark mode, toggled via button in header
- Preference saved in localStorage under key `tipcalc-theme`
- On first load, respects system preference (`prefers-color-scheme`)
- Tailwind `darkMode: 'class'` — toggle adds/removes `dark` class on `<html>`

---

## PWA

- `vite-plugin-pwa` with `registerType: 'autoUpdate'`
- App manifest: name, icons, `display: standalone`, theme colors for both modes
- Service worker caches all assets for full offline support
- Installable on mobile home screens

---

## Responsive Design

- Max width ~480px centered on larger screens to maintain mobile feel
- Touch-friendly tap targets (minimum 44px)
- Results display pinned to bottom via `position: sticky`

---

## Out of Scope (v1)

- Copy & Share text summary generation
- Cloud sync / accounts
- AI receipt scanning
