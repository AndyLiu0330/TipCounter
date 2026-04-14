# Telegram Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Node.js Telegram bot that walks a user through a conversational wizard (subtotal → tax → tip% → people) and replies with the split breakdown, reusing the PWA's tip math.

**Architecture:** Monorepo-lite. A new `bot/` directory runs a `grammy` bot in polling mode. It imports from a new `src/lib/calc.ts` wrapper, which reuses the existing pure functions in `src/utils/calculations.ts`. No PWA code changes.

**Tech Stack:** TypeScript, grammy, @grammyjs/conversations, dotenv, tsx, vitest.

---

## File Structure

Create:
- `src/lib/calc.ts` — `calculateTip(input)` wrapper over existing `calculations.ts`.
- `src/lib/calc.test.ts` — unit tests for the wrapper.
- `bot/index.ts` — entry: loads token, registers commands, starts polling.
- `bot/wizard.ts` — conversation flow (subtotal → tax → tip% → people → reply).
- `bot/format.ts` — renders `TipResult` into a Telegram message.
- `bot/format.test.ts` — unit test for the formatter.
- `bot/tsconfig.json` — TS config for the bot (node target, CommonJS or NodeNext).
- `.env.example` — documents `BOT_TOKEN`.

Modify:
- `package.json` — add deps and `bot` script.
- `.gitignore` — add `.env`.

---

## Task 1: Shared calculation wrapper

**Files:**
- Create: `src/lib/calc.ts`
- Create: `src/lib/calc.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/calc.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTip } from './calc';

describe('calculateTip', () => {
  it('computes tip, total, and per-person share', () => {
    const result = calculateTip({
      subtotal: 45.2,
      tax: 3.8,
      tipPercent: 18,
      people: 2,
    });
    expect(result.subtotal).toBe(45.2);
    expect(result.tax).toBe(3.8);
    expect(result.tip).toBeCloseTo(8.14, 2);
    expect(result.total).toBeCloseTo(57.14, 2);
    expect(result.perPerson).toBeCloseTo(28.57, 2);
  });

  it('handles zero tax', () => {
    const result = calculateTip({ subtotal: 100, tax: 0, tipPercent: 20, people: 1 });
    expect(result.tip).toBe(20);
    expect(result.total).toBe(120);
    expect(result.perPerson).toBe(120);
  });

  it('handles zero tip percent', () => {
    const result = calculateTip({ subtotal: 50, tax: 5, tipPercent: 0, people: 1 });
    expect(result.tip).toBe(0);
    expect(result.total).toBe(55);
  });

  it('splits across many people', () => {
    const result = calculateTip({ subtotal: 90, tax: 0, tipPercent: 10, people: 3 });
    expect(result.total).toBe(99);
    expect(result.perPerson).toBe(33);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/calc.test.ts`
Expected: FAIL — cannot import `./calc`.

- [ ] **Step 3: Implement the wrapper**

```ts
// src/lib/calc.ts
import { calcTip, calcGrandTotal, calcPerPerson } from '../utils/calculations';

export interface TipInput {
  subtotal: number;
  tax: number;
  tipPercent: number;
  people: number;
}

export interface TipResult {
  subtotal: number;
  tax: number;
  tipPercent: number;
  tip: number;
  total: number;
  perPerson: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateTip(input: TipInput): TipResult {
  const tip = round2(calcTip(input.subtotal, input.tipPercent, null));
  const total = round2(calcGrandTotal(input.subtotal, input.tax, tip));
  const perPerson = calcPerPerson(total, input.people);
  return {
    subtotal: round2(input.subtotal),
    tax: round2(input.tax),
    tipPercent: input.tipPercent,
    tip,
    total,
    perPerson,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/calc.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calc.ts src/lib/calc.test.ts
git commit -m "feat(calc): add calculateTip wrapper for shared use"
```

---

## Task 2: Message formatter

**Files:**
- Create: `bot/format.ts`
- Create: `bot/format.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// bot/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatResult } from './format';

describe('formatResult', () => {
  it('renders a full breakdown', () => {
    const out = formatResult({
      subtotal: 45.2,
      tax: 3.8,
      tipPercent: 18,
      tip: 8.14,
      total: 57.14,
      perPerson: 28.57,
    }, 2);
    expect(out).toContain('Subtotal');
    expect(out).toContain('$45.20');
    expect(out).toContain('Tax');
    expect(out).toContain('$3.80');
    expect(out).toContain('Tip (18%)');
    expect(out).toContain('$8.14');
    expect(out).toContain('Total');
    expect(out).toContain('$57.14');
    expect(out).toContain('Per person');
    expect(out).toContain('$28.57');
  });

  it('omits per-person line when only one person', () => {
    const out = formatResult({
      subtotal: 10, tax: 0, tipPercent: 10, tip: 1, total: 11, perPerson: 11,
    }, 1);
    expect(out).not.toContain('Per person');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run bot/format.test.ts`
Expected: FAIL — cannot import `./format`.

- [ ] **Step 3: Implement the formatter**

```ts
// bot/format.ts
import type { TipResult } from '../src/lib/calc';

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function formatResult(r: TipResult, people: number): string {
  const lines = [
    '─────────────────',
    `Subtotal:   ${money(r.subtotal)}`,
    `Tax:        ${money(r.tax)}`,
    `Tip (${r.tipPercent}%): ${money(r.tip)}`,
    '─────────────────',
    `Total:      ${money(r.total)}`,
  ];
  if (people > 1) {
    lines.push(`Per person (${people}): ${money(r.perPerson)}`);
  }
  return lines.join('\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run bot/format.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add bot/format.ts bot/format.test.ts
git commit -m "feat(bot): add result message formatter"
```

---

## Task 3: Install dependencies and scripts

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Install runtime deps**

Run: `npm install grammy @grammyjs/conversations dotenv`
Expected: installs without errors.

- [ ] **Step 2: Install dev dep**

Run: `npm install -D tsx`
Expected: installs without errors.

- [ ] **Step 3: Add `bot` script**

In `package.json`, under `"scripts"`, add:

```json
"bot": "tsx bot/index.ts"
```

- [ ] **Step 4: Create `.env.example`**

```
BOT_TOKEN=your-telegram-bot-token-from-BotFather
```

- [ ] **Step 5: Ensure `.env` is gitignored**

Read `.gitignore`. If it does not contain a line `.env`, append:

```
.env
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example .gitignore
git commit -m "chore(bot): add grammy deps, bot script, and env template"
```

---

## Task 4: Bot entry point

**Files:**
- Create: `bot/index.ts`

- [ ] **Step 1: Write the entry file**

```ts
// bot/index.ts
import 'dotenv/config';
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import type { Context, SessionFlavor } from 'grammy';
import type { ConversationFlavor } from '@grammyjs/conversations';
import { tipWizard } from './wizard';

type MyContext = Context & SessionFlavor<Record<string, never>> & ConversationFlavor;

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN missing. Copy .env.example to .env and set your token.');
  process.exit(1);
}

const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(tipWizard, 'tipWizard'));

bot.command('start', (ctx) =>
  ctx.reply('Hi! Send /tip to calculate a bill, or /help for usage.')
);

bot.command('help', (ctx) =>
  ctx.reply(
    [
      'Commands:',
      '/tip — start a tip calculation',
      '/cancel — abort the current calculation',
      '/help — show this message',
    ].join('\n')
  )
);

bot.command('tip', async (ctx) => {
  await ctx.conversation.enter('tipWizard');
});

bot.command('cancel', async (ctx) => {
  await ctx.conversation.exit('tipWizard');
  await ctx.reply('Cancelled.');
});

bot.catch((err) => {
  console.error('Bot error:', err);
});

bot.start({
  onStart: (info) => console.log(`Bot @${info.username} started (polling).`),
});
```

- [ ] **Step 2: Commit**

```bash
git add bot/index.ts
git commit -m "feat(bot): add entry point with commands and polling"
```

Note: tests for this glue file are intentionally omitted — it's thin wiring over grammY. Verified via manual smoke test in Task 6.

---

## Task 5: Wizard conversation

**Files:**
- Create: `bot/wizard.ts`

- [ ] **Step 1: Write the wizard**

```ts
// bot/wizard.ts
import type { Conversation } from '@grammyjs/conversations';
import type { Context } from 'grammy';
import { calculateTip } from '../src/lib/calc';
import { formatResult } from './format';

type MyContext = Context;
type MyConversation = Conversation<MyContext>;

async function askNumber(
  conversation: MyConversation,
  ctx: MyContext,
  prompt: string,
  validate: (n: number) => boolean,
  retryMsg: string
): Promise<number | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await ctx.reply(attempt === 0 ? prompt : `${retryMsg}\n${prompt}`);
    const { message } = await conversation.wait();
    const text = message?.text?.trim() ?? '';
    const n = Number(text);
    if (Number.isFinite(n) && validate(n)) return n;
  }
  await ctx.reply('Too many invalid inputs. Cancelling. Send /tip to try again.');
  return null;
}

export async function tipWizard(conversation: MyConversation, ctx: MyContext) {
  const subtotal = await askNumber(
    conversation, ctx,
    "What's the subtotal? (e.g. 45.20)",
    (n) => n > 0,
    'Please enter a positive number.'
  );
  if (subtotal === null) return;

  const tax = await askNumber(
    conversation, ctx,
    'Tax amount? (send 0 if none)',
    (n) => n >= 0,
    'Please enter 0 or a positive number.'
  );
  if (tax === null) return;

  const tipPercent = await askNumber(
    conversation, ctx,
    'Tip percentage? (e.g. 18)',
    (n) => n >= 0,
    'Please enter 0 or a positive number.'
  );
  if (tipPercent === null) return;

  const people = await askNumber(
    conversation, ctx,
    'How many people are splitting?',
    (n) => Number.isInteger(n) && n >= 1,
    'Please enter a whole number, 1 or more.'
  );
  if (people === null) return;

  const result = calculateTip({ subtotal, tax, tipPercent, people });
  await ctx.reply(formatResult(result, people));
}
```

Note: `ctx` from the outer handler is the correct reply target throughout the conversation; grammY re-entrant `conversation.wait()` returns messages to process, not a new `ctx` we need to thread through.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors. If errors relate to bot files not being in the root tsconfig's include, continue — the `bot` script uses `tsx` which type-strips at runtime, and tests cover the pure logic.

- [ ] **Step 3: Run all unit tests**

Run: `npx vitest run`
Expected: all pass (calc + format tests).

- [ ] **Step 4: Commit**

```bash
git add bot/wizard.ts
git commit -m "feat(bot): add conversational tip wizard"
```

---

## Task 6: Manual smoke test

**Files:** none

- [ ] **Step 1: Create a Telegram bot token**

In Telegram, message `@BotFather`:
- Send `/newbot`, follow prompts, save the token it gives you.

- [ ] **Step 2: Set up `.env`**

```bash
cp .env.example .env
# edit .env and paste the token on the BOT_TOKEN= line
```

- [ ] **Step 3: Start the bot**

Run: `npm run bot`
Expected: log line `Bot @<your_bot_username> started (polling).`

- [ ] **Step 4: Interact with the bot in Telegram**

In a Telegram chat with your bot:
1. `/start` → greeting.
2. `/help` → usage.
3. `/tip` → it asks for subtotal. Enter `45.20`.
4. It asks for tax. Enter `3.80`.
5. It asks for tip%. Enter `18`.
6. It asks for people. Enter `2`.
7. It replies with the breakdown containing `$57.14` total and `$28.57` per person.
8. `/tip` → enter `abc` for subtotal three times → bot cancels.
9. `/tip` → enter `45.20` → `/cancel` → bot replies "Cancelled."

Expected: all steps behave as described. Fix any issues before proceeding.

- [ ] **Step 5: Stop the bot**

Press `Ctrl+C` in the terminal running `npm run bot`.

(No commit — this is a verification-only task.)

---

## Task 7: Final verification

**Files:** none

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all pre-existing PWA tests still pass, plus the new `calc.test.ts` and `format.test.ts`.

- [ ] **Step 2: Build the PWA to ensure nothing regressed**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Summarize**

Print a short status to the user: tests passing, build passing, bot verified via smoke test.
