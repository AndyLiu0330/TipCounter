# TipCalc Telegram Bot — Design

## Objective

Add a Telegram bot that lets a user calculate a tipped, taxed, split bill through a
conversational wizard in Telegram chat. Reuses the PWA's calculation logic via a
shared module so both surfaces stay in sync.

## Scope

In scope:

- Conversational wizard: subtotal → tax → tip% → people → result.
- Shared calculation module used by both PWA and bot.
- Local polling mode (no public URL / deploy required).
- `/tip`, `/cancel`, `/help`, `/start` commands.
- Input validation with re-prompting.

Out of scope (deferred):

- Merchant name, history, round-up, flat-tip, custom %, share formatting.
- Webhook deployment.
- Multi-user persistence.

## Architecture

Monorepo-lite. The existing PWA and the new bot live in one repo and share a
pure calculation module.

```
TipCounter/
├── src/
│   └── lib/
│       └── calc.ts          # NEW — pure tip math
├── bot/
│   ├── index.ts             # entry, token load, bot.start()
│   ├── wizard.ts            # conversation definition
│   └── format.ts            # result → Telegram message
├── .env                     # BOT_TOKEN (gitignored)
└── package.json             # bot script + grammY deps
```

The PWA's calculator components are refactored to import `calc.ts` instead of
doing math inline.

## Shared Calc Module

`src/lib/calc.ts`:

```ts
export interface TipInput {
  subtotal: number;
  tax: number;
  tipPercent: number;
  people: number;
}

export interface TipResult {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  perPerson: number;
}

export function calculateTip(input: TipInput): TipResult;
```

Rules:

- `tip = subtotal * tipPercent / 100`
- `total = subtotal + tax + tip`
- `perPerson = total / people`
- All monetary values rounded to 2 decimals on return.
- Callers are responsible for validating `people >= 1` and non-negative amounts
  before calling; `calc.ts` assumes valid input.

## Bot Flow

Framework: `grammy` + `@grammyjs/conversations`.
Mode: long polling.

```
/start  → greeting + prompt to run /tip or /help
/help   → usage summary
/tip    → enters wizard
/cancel → aborts wizard mid-flow
```

Wizard steps (each step re-prompts on invalid input, up to 3 tries then cancels):

1. "What's the subtotal? (e.g. 45.20)" — parse float, require `> 0`.
2. "Tax amount? (send 0 if none)" — parse float, require `>= 0`.
3. "Tip percentage? (e.g. 18)" — parse float, require `>= 0`.
4. "How many people are splitting?" — parse integer, require `>= 1`.
5. Reply with formatted breakdown.

## Reply Format (`bot/format.ts`)

```
─────────────────
Subtotal:   $45.20
Tax:         $3.80
Tip (18%):   $8.14
─────────────────
Total:      $57.14
Per person: $28.57
```

Currency symbol is hardcoded `$` for now (matches PWA).

## Dependencies (new)

Runtime: `grammy`, `@grammyjs/conversations`, `dotenv`.
Dev: `tsx`.

## Scripts

- `npm run bot` → `tsx bot/index.ts`.

## Configuration

`.env`:

```
BOT_TOKEN=123456:ABC-DEF...
```

`.env` is gitignored. Missing/empty `BOT_TOKEN` on startup causes the bot to
exit immediately with a clear error message.

## Error Handling

- Startup: missing `BOT_TOKEN` → process exits with message.
- Input validation: invalid numeric input → re-prompt the same step.
  After 3 invalid attempts on one step, the wizard cancels with a message.
- Runtime errors inside a handler: caught by `bot.catch`, logged, user told
  "Something went wrong, try /tip again."
- `people = 0` is rejected by validation before reaching `calc.ts`; `calc.ts`
  does not defensively guard against it.

## Testing

- Unit: `calc.ts` (vitest) — representative cases, rounding edges, zero tax.
- Unit: `format.ts` — snapshot of the rendered reply.
- Wizard glue: manual smoke test against a real Telegram bot, since the
  conversation logic is a thin layer over grammY.

## Migration of Existing PWA Code

1. Create `src/lib/calc.ts` with the functions above and unit tests.
2. Replace inline math in the existing calculator component(s) with calls to
   `calculateTip`.
3. Confirm existing PWA tests still pass.

The refactor is narrow and kept to this one change; no unrelated cleanup.

## Risks / Open Questions

- Currency symbol: hardcoded `$`. If multi-currency is wanted later, it becomes
  a `calc.ts` / `format.ts` parameter — trivial extension, not built now.
- Rounding: per-person value is `round(total, 2) / people` rounded to 2
  decimals; tiny residuals (e.g. $0.01) are accepted, matching PWA behavior.
