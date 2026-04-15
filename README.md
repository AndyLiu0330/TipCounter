# Manual TipCalc Pro

A privacy-first tip calculator and bill splitter. Ultra-fast manual entry, precision tipping, group splitting — 100% on-device with zero network calls. Ships as a PWA and an optional Telegram bot companion.

## Features

- **High-speed manual entry** — launches straight into the numeric keypad for subtotal, tax, and merchant name.
- **Precision tipping** — presets, custom percentages, flat-rate tips, and a "round total" smart-rounding button.
- **Group splitting** — per-person share calculated from the grand total.
- **Local history** — entries saved in `localStorage`; nothing leaves the device.
- **PWA** — installable, offline-capable, with install prompt.
- **Telegram bot** — optional conversational wizard (`grammy` + `@grammyjs/conversations`) that runs the same flow in chat.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Vitest · vite-plugin-pwa · grammY (bot)

## Project Structure

```
src/            React PWA (components, hooks, utils, calculator logic)
bot/            Telegram bot entry, wizard conversation, formatters
docker/         nginx config for the web image
public/         Icons and favicon
PRD.md          Product requirements
```

## Getting Started

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # typecheck + production build
npm run preview    # preview the built app
npm test           # run Vitest suite
```

### Telegram Bot

Create a `.env` with your bot token, then:

```bash
BOT_TOKEN=xxxxx npm run bot
```

#### Example conversation

Send `/tip` and the bot walks you through a step-by-step wizard:

```
You:  /tip
Bot:  What's the subtotal? (e.g. 45.20)
You:  20
Bot:  Tax amount? (send 0 if none)
You:  10
Bot:  Tip percentage? (e.g. 18)
You:  20
Bot:  How many people are splitting?
You:  5
Bot:  Subtotal:  $20.00
      Tax:      $10.00
      Tip (20%): $4.00

      Total:    $34.00
      Per person (5): $6.80
```

## Docker

```bash
docker compose up -d         # build + run web (port 8080) and bot
docker compose up -d web     # web only
```

The bot service reads `.env` for `BOT_TOKEN`.

## Privacy

Zero network calls from the web app. No camera, no uploads, no analytics. See `PRD.md` for the full design rationale.
