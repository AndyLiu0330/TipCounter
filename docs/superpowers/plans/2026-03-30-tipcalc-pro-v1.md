# TipCalc Pro v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA tip calculator with manual entry, flexible tipping, bill splitting, and local history.

**Architecture:** Single-page React app with a view toggle between Calculator and History views. All state lives in React; history persists to localStorage. Calculation logic is pure functions in a utility module, tested independently. Theme uses Tailwind's `darkMode: 'class'` with system preference detection.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v4, vite-plugin-pwa, Vitest

---

## File Structure

```
src/
  types.ts                    # CalculationRecord interface, TipMode type
  utils/
    calculations.ts           # Pure calc functions: calcTip, calcGrandTotal, calcPerPerson, calcRoundUpTip
    calculations.test.ts      # Tests for all calc functions
    format.ts                 # formatCurrency helper
    format.test.ts            # Tests for formatting
    storage.ts                # localStorage helpers: loadHistory, saveHistory, deleteRecord
    storage.test.ts           # Tests for storage helpers
  hooks/
    useTheme.ts               # Theme toggle hook (dark/light/system)
    useCalculator.ts          # Calculator state machine hook
  components/
    Header.tsx                # App name, theme toggle, history button
    MerchantInput.tsx         # Optional merchant name text input
    AmountInputs.tsx          # Subtotal + Tax numeric inputs
    TipSelector.tsx           # Preset buttons, custom %, flat $, Round Up
    GuestSplitter.tsx         # +/- guest count
    ResultsDisplay.tsx        # Sticky bottom: tip, total, per person
    SaveButton.tsx            # Save to history
    CalculatorView.tsx        # Composes all calculator components
    HistoryView.tsx           # History list with search, delete
    HistoryCard.tsx           # Single history entry card
  App.tsx                     # Root: view toggle, state coordination
  App.test.tsx                # Integration tests for full app flow
  main.tsx                    # Entry point: renders App
  index.css                   # Tailwind directives + custom styles
index.html                    # HTML shell
vite.config.ts                # Vite + PWA plugin config
tailwind.config.ts            # Tailwind config with darkMode
tsconfig.json                 # TypeScript config
package.json                  # Dependencies and scripts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `postcss.config.js`

- [ ] **Step 1: Initialize the project**

```bash
cd /home/andy/project/TipCounter/.worktrees/feature-v1
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite postcss autoprefixer vite-plugin-pwa vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TipCalc Pro',
        short_name: 'TipCalc',
        description: 'Privacy-first tip calculator',
        theme_color: '#1e293b',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
```

- [ ] **Step 5: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create `src/index.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 7: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TipCalc Pro</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `src/App.tsx` (placeholder)**

```tsx
export default function App() {
  return <div className="max-w-md mx-auto p-4">TipCalc Pro</div>;
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: Add scripts to `package.json`**

Add to the `"scripts"` section:

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 11: Verify dev server starts**

```bash
npx vite --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173 | head -20
kill %1
```

Expected: HTML containing `<div id="root">` and the module script tag.

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html postcss.config.js src/main.tsx src/App.tsx src/index.css src/test-setup.ts
git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind + PWA project"
```

---

### Task 2: Types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create shared types**

```ts
export interface CalculationRecord {
  id: string;
  merchantName: string;
  subtotal: number;
  tax: number;
  tipPercent: number | null;
  tipFlat: number | null;
  tipAmount: number;
  grandTotal: number;
  guests: number;
  perPerson: number;
  createdAt: string;
}

export type TipMode = 'preset' | 'custom' | 'flat';
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

### Task 3: Calculation Utilities (TDD)

**Files:**
- Create: `src/utils/calculations.ts`
- Create: `src/utils/calculations.test.ts`

- [ ] **Step 1: Write failing tests for all calculation functions**

```ts
import { describe, it, expect } from 'vitest';
import { calcTip, calcGrandTotal, calcPerPerson, calcRoundUpTip } from './calculations';

describe('calcTip', () => {
  it('calculates percentage tip', () => {
    expect(calcTip(50, 20, null)).toBe(10);
  });

  it('calculates percentage tip with decimals', () => {
    expect(calcTip(33.33, 18, null)).toBeCloseTo(6.0, 2);
  });

  it('returns flat tip when provided', () => {
    expect(calcTip(50, null, 8)).toBe(8);
  });

  it('returns 0 when no tip info', () => {
    expect(calcTip(50, null, null)).toBe(0);
  });

  it('returns 0 for zero subtotal', () => {
    expect(calcTip(0, 20, null)).toBe(0);
  });
});

describe('calcGrandTotal', () => {
  it('sums subtotal, tax, and tip', () => {
    expect(calcGrandTotal(50, 4.5, 10)).toBe(64.5);
  });

  it('works with zero tax', () => {
    expect(calcGrandTotal(50, 0, 10)).toBe(60);
  });

  it('works with zero tip', () => {
    expect(calcGrandTotal(50, 4.5, 0)).toBe(54.5);
  });
});

describe('calcPerPerson', () => {
  it('divides total by guests', () => {
    expect(calcPerPerson(60, 3)).toBe(20);
  });

  it('returns full total for 1 guest', () => {
    expect(calcPerPerson(60, 1)).toBe(60);
  });

  it('handles non-even splits', () => {
    expect(calcPerPerson(100, 3)).toBeCloseTo(33.33, 2);
  });
});

describe('calcRoundUpTip', () => {
  it('calculates tip to round total to next whole dollar', () => {
    // subtotal=40 + tax=5 = 45, already whole, tip should round to next: $46 -> tip=1
    // Actually: subtotal + tax + tip = next whole dollar
    // 40 + 5 = 45. ceil(45) = 45, but we want a positive tip, so ceil to 46? No.
    // Round up means: if total is already whole, no adjustment needed. tip = 0.
    // Let's test non-whole: subtotal=40, tax=5.63 => base=45.63 => ceil=46 => tip=0.37
    expect(calcRoundUpTip(40, 5.63)).toBeCloseTo(0.37, 2);
  });

  it('returns 0 when subtotal + tax is already whole', () => {
    expect(calcRoundUpTip(40, 5)).toBe(0);
  });

  it('handles small remainders', () => {
    // 30 + 2.01 = 32.01 => ceil = 33 => tip = 0.99
    expect(calcRoundUpTip(30, 2.01)).toBeCloseTo(0.99, 2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/calculations.test.ts
```

Expected: FAIL — module `./calculations` not found.

- [ ] **Step 3: Implement calculation functions**

```ts
export function calcTip(
  subtotal: number,
  tipPercent: number | null,
  tipFlat: number | null
): number {
  if (tipFlat !== null) return tipFlat;
  if (tipPercent !== null) return subtotal * tipPercent / 100;
  return 0;
}

export function calcGrandTotal(
  subtotal: number,
  tax: number,
  tip: number
): number {
  return subtotal + tax + tip;
}

export function calcPerPerson(grandTotal: number, guests: number): number {
  return Math.round((grandTotal / guests) * 100) / 100;
}

export function calcRoundUpTip(subtotal: number, tax: number): number {
  const base = subtotal + tax;
  const rounded = Math.ceil(base);
  if (rounded === base) return 0;
  return Math.round((rounded - base) * 100) / 100;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/calculations.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculations.ts src/utils/calculations.test.ts
git commit -m "feat: add tip calculation utility functions with tests"
```

---

### Task 4: Format Utility (TDD)

**Files:**
- Create: `src/utils/format.ts`
- Create: `src/utils/format.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats whole dollars', () => {
    expect(formatCurrency(10)).toBe('$10.00');
  });

  it('formats cents', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('rounds to two decimals', () => {
    expect(formatCurrency(10.556)).toBe('$10.56');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/format.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/format.test.ts
```

Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/format.ts src/utils/format.test.ts
git commit -m "feat: add currency formatting utility with tests"
```

---

### Task 5: Storage Utilities (TDD)

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/utils/storage.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { loadHistory, saveRecord, deleteRecord } from './storage';
import type { CalculationRecord } from '../types';

const mockRecord: CalculationRecord = {
  id: 'test-1',
  merchantName: 'Test Restaurant',
  subtotal: 50,
  tax: 4.5,
  tipPercent: 20,
  tipFlat: null,
  tipAmount: 10,
  grandTotal: 64.5,
  guests: 2,
  perPerson: 32.25,
  createdAt: '2026-03-30T12:00:00.000Z',
};

beforeEach(() => {
  localStorage.clear();
});

describe('loadHistory', () => {
  it('returns empty array when no history', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('returns saved records', () => {
    localStorage.setItem('tipcalc-history', JSON.stringify([mockRecord]));
    expect(loadHistory()).toEqual([mockRecord]);
  });
});

describe('saveRecord', () => {
  it('adds a record to history', () => {
    saveRecord(mockRecord);
    const history = loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('test-1');
  });

  it('prepends new records (newest first)', () => {
    saveRecord(mockRecord);
    const second = { ...mockRecord, id: 'test-2', merchantName: 'Second' };
    saveRecord(second);
    const history = loadHistory();
    expect(history[0].id).toBe('test-2');
    expect(history[1].id).toBe('test-1');
  });
});

describe('deleteRecord', () => {
  it('removes a record by id', () => {
    saveRecord(mockRecord);
    deleteRecord('test-1');
    expect(loadHistory()).toEqual([]);
  });

  it('does nothing if id not found', () => {
    saveRecord(mockRecord);
    deleteRecord('nonexistent');
    expect(loadHistory()).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/storage.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement storage functions**

```ts
import type { CalculationRecord } from '../types';

const STORAGE_KEY = 'tipcalc-history';

export function loadHistory(): CalculationRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as CalculationRecord[];
}

export function saveRecord(record: CalculationRecord): void {
  const history = loadHistory();
  history.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteRecord(id: string): void {
  const history = loadHistory().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/storage.test.ts
```

Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.ts src/utils/storage.test.ts
git commit -m "feat: add localStorage history helpers with tests"
```

---

### Task 6: Theme Hook

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: Implement the theme hook**

```ts
import { useState, useEffect } from 'react';

const THEME_KEY = 'tipcalc-theme';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  return stored ?? getSystemTheme();
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme } as const;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTheme.ts
git commit -m "feat: add useTheme hook with system preference detection"
```

---

### Task 7: Calculator State Hook

**Files:**
- Create: `src/hooks/useCalculator.ts`

- [ ] **Step 1: Implement the calculator hook**

This hook manages all calculator state and derives computed values.

```ts
import { useState, useMemo, useCallback } from 'react';
import { calcTip, calcGrandTotal, calcPerPerson, calcRoundUpTip } from '../utils/calculations';
import { saveRecord } from '../utils/storage';
import type { TipMode, CalculationRecord } from '../types';

export function useCalculator() {
  const [merchantName, setMerchantName] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [tax, setTax] = useState('');
  const [tipMode, setTipMode] = useState<TipMode>('preset');
  const [tipPreset, setTipPreset] = useState<number>(18);
  const [tipCustom, setTipCustom] = useState('');
  const [tipFlatInput, setTipFlatInput] = useState('');
  const [guests, setGuests] = useState(1);

  const subtotalNum = parseFloat(subtotal) || 0;
  const taxNum = parseFloat(tax) || 0;

  const tipPercent = useMemo(() => {
    if (tipMode === 'preset') return tipPreset;
    if (tipMode === 'custom') return parseFloat(tipCustom) || 0;
    return null;
  }, [tipMode, tipPreset, tipCustom]);

  const tipFlat = useMemo(() => {
    if (tipMode === 'flat') return parseFloat(tipFlatInput) || 0;
    return null;
  }, [tipMode, tipFlatInput]);

  const tipAmount = useMemo(
    () => calcTip(subtotalNum, tipPercent, tipFlat),
    [subtotalNum, tipPercent, tipFlat]
  );

  const grandTotal = useMemo(
    () => calcGrandTotal(subtotalNum, taxNum, tipAmount),
    [subtotalNum, taxNum, tipAmount]
  );

  const perPerson = useMemo(
    () => calcPerPerson(grandTotal, guests),
    [grandTotal, guests]
  );

  const selectPreset = useCallback((pct: number) => {
    setTipMode('preset');
    setTipPreset(pct);
  }, []);

  const enterCustomPercent = useCallback((value: string) => {
    setTipMode('custom');
    setTipCustom(value);
  }, []);

  const enterFlatTip = useCallback((value: string) => {
    setTipMode('flat');
    setTipFlatInput(value);
  }, []);

  const roundUp = useCallback(() => {
    const roundUpTip = calcRoundUpTip(subtotalNum, taxNum);
    setTipMode('flat');
    setTipFlatInput(roundUpTip.toFixed(2));
  }, [subtotalNum, taxNum]);

  const incrementGuests = useCallback(() => setGuests((g) => g + 1), []);
  const decrementGuests = useCallback(() => setGuests((g) => Math.max(1, g - 1)), []);

  const save = useCallback(() => {
    const record: CalculationRecord = {
      id: crypto.randomUUID(),
      merchantName: merchantName || 'Untitled',
      subtotal: subtotalNum,
      tax: taxNum,
      tipPercent,
      tipFlat,
      tipAmount,
      grandTotal,
      guests,
      perPerson,
      createdAt: new Date().toISOString(),
    };
    saveRecord(record);
    return record;
  }, [merchantName, subtotalNum, taxNum, tipPercent, tipFlat, tipAmount, grandTotal, guests, perPerson]);

  return {
    merchantName, setMerchantName,
    subtotal, setSubtotal,
    tax, setTax,
    tipMode, tipPreset, tipCustom, tipFlatInput,
    selectPreset, enterCustomPercent, enterFlatTip, roundUp,
    guests, incrementGuests, decrementGuests,
    tipAmount, grandTotal, perPerson,
    save,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCalculator.ts
git commit -m "feat: add useCalculator state hook"
```

---

### Task 8: Header Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Implement Header**

```tsx
interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleHistory: () => void;
  showingHistory: boolean;
}

export default function Header({ theme, onToggleTheme, onToggleHistory, showingHistory }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-xl font-bold tracking-tight">TipCalc Pro</h1>
      <div className="flex gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        <button
          onClick={onToggleHistory}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={showingHistory ? 'Show calculator' : 'Show history'}
        >
          {showingHistory ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component with theme toggle and history button"
```

---

### Task 9: Calculator Input Components

**Files:**
- Create: `src/components/MerchantInput.tsx`
- Create: `src/components/AmountInputs.tsx`
- Create: `src/components/TipSelector.tsx`
- Create: `src/components/GuestSplitter.tsx`
- Create: `src/components/ResultsDisplay.tsx`
- Create: `src/components/SaveButton.tsx`

- [ ] **Step 1: Create MerchantInput**

```tsx
interface MerchantInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MerchantInput({ value, onChange }: MerchantInputProps) {
  return (
    <div>
      <label htmlFor="merchant" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
        Merchant (optional)
      </label>
      <input
        id="merchant"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. UCR Dining"
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create AmountInputs**

```tsx
import { useRef, useEffect } from 'react';

interface AmountInputsProps {
  subtotal: string;
  tax: string;
  onSubtotalChange: (value: string) => void;
  onTaxChange: (value: string) => void;
}

export default function AmountInputs({ subtotal, tax, onSubtotalChange, onTaxChange }: AmountInputsProps) {
  const subtotalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    subtotalRef.current?.focus();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="subtotal" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
          Subtotal
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            ref={subtotalRef}
            id="subtotal"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={subtotal}
            onChange={(e) => onSubtotalChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="tax" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
          Tax
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            id="tax"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={tax}
            onChange={(e) => onTaxChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TipSelector**

```tsx
import type { TipMode } from '../types';

const PRESETS = [10, 15, 18, 20];

interface TipSelectorProps {
  tipMode: TipMode;
  tipPreset: number;
  tipCustom: string;
  tipFlatInput: string;
  onSelectPreset: (pct: number) => void;
  onEnterCustomPercent: (value: string) => void;
  onEnterFlatTip: (value: string) => void;
  onRoundUp: () => void;
}

export default function TipSelector({
  tipMode, tipPreset, tipCustom, tipFlatInput,
  onSelectPreset, onEnterCustomPercent, onEnterFlatTip, onRoundUp,
}: TipSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Tip</label>

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((pct) => (
          <button
            key={pct}
            onClick={() => onSelectPreset(pct)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              tipMode === 'preset' && tipPreset === pct
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Custom percent + flat tip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={tipMode === 'custom' ? tipCustom : ''}
            onChange={(e) => onEnterCustomPercent(e.target.value)}
            onFocus={() => { if (tipMode !== 'custom') onEnterCustomPercent(''); }}
            placeholder="Custom %"
            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              tipMode === 'custom'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={tipMode === 'flat' ? tipFlatInput : ''}
            onChange={(e) => onEnterFlatTip(e.target.value)}
            onFocus={() => { if (tipMode !== 'flat') onEnterFlatTip(''); }}
            placeholder="Flat tip"
            className={`w-full pl-7 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              tipMode === 'flat'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          />
        </div>
      </div>

      {/* Round Up button */}
      <button
        onClick={onRoundUp}
        className="w-full py-2 rounded-lg text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
      >
        Round Up
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create GuestSplitter**

```tsx
interface GuestSplitterProps {
  guests: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function GuestSplitter({ guests, onIncrement, onDecrement }: GuestSplitterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Split</label>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onDecrement}
          disabled={guests <= 1}
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease guests"
        >
          -
        </button>
        <span className="text-2xl font-semibold w-12 text-center">{guests}</span>
        <button
          onClick={onIncrement}
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          aria-label="Increase guests"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create ResultsDisplay**

```tsx
import { formatCurrency } from '../utils/format';

interface ResultsDisplayProps {
  tipAmount: number;
  grandTotal: number;
  perPerson: number;
  guests: number;
}

export default function ResultsDisplay({ tipAmount, grandTotal, perPerson, guests }: ResultsDisplayProps) {
  return (
    <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-800 rounded-xl p-4 space-y-2 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">Tip</span>
        <span>{formatCurrency(tipAmount)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
      {guests > 1 && (
        <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
          <span>Per person ({guests})</span>
          <span>{formatCurrency(perPerson)}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create SaveButton**

```tsx
import { useState } from 'react';

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
}

export default function SaveButton({ onSave, disabled }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || saved}
      className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
        saved
          ? 'bg-emerald-600 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
      }`}
    >
      {saved ? 'Saved!' : 'Save to History'}
    </button>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/MerchantInput.tsx src/components/AmountInputs.tsx src/components/TipSelector.tsx src/components/GuestSplitter.tsx src/components/ResultsDisplay.tsx src/components/SaveButton.tsx
git commit -m "feat: add calculator input components"
```

---

### Task 10: CalculatorView Composition

**Files:**
- Create: `src/components/CalculatorView.tsx`

- [ ] **Step 1: Compose the calculator view**

```tsx
import MerchantInput from './MerchantInput';
import AmountInputs from './AmountInputs';
import TipSelector from './TipSelector';
import GuestSplitter from './GuestSplitter';
import ResultsDisplay from './ResultsDisplay';
import SaveButton from './SaveButton';
import { useCalculator } from '../hooks/useCalculator';

interface CalculatorViewProps {
  calculator: ReturnType<typeof useCalculator>;
  onSaved: () => void;
}

export default function CalculatorView({ calculator, onSaved }: CalculatorViewProps) {
  const c = calculator;

  const handleSave = () => {
    c.save();
    onSaved();
  };

  const hasSubtotal = parseFloat(c.subtotal) > 0;

  return (
    <div className="space-y-4 pb-4">
      <MerchantInput value={c.merchantName} onChange={c.setMerchantName} />
      <AmountInputs
        subtotal={c.subtotal}
        tax={c.tax}
        onSubtotalChange={c.setSubtotal}
        onTaxChange={c.setTax}
      />
      <TipSelector
        tipMode={c.tipMode}
        tipPreset={c.tipPreset}
        tipCustom={c.tipCustom}
        tipFlatInput={c.tipFlatInput}
        onSelectPreset={c.selectPreset}
        onEnterCustomPercent={c.enterCustomPercent}
        onEnterFlatTip={c.enterFlatTip}
        onRoundUp={c.roundUp}
      />
      <GuestSplitter
        guests={c.guests}
        onIncrement={c.incrementGuests}
        onDecrement={c.decrementGuests}
      />
      <ResultsDisplay
        tipAmount={c.tipAmount}
        grandTotal={c.grandTotal}
        perPerson={c.perPerson}
        guests={c.guests}
      />
      <SaveButton onSave={handleSave} disabled={!hasSubtotal} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CalculatorView.tsx
git commit -m "feat: add CalculatorView composition component"
```

---

### Task 11: History Components

**Files:**
- Create: `src/components/HistoryCard.tsx`
- Create: `src/components/HistoryView.tsx`

- [ ] **Step 1: Create HistoryCard**

```tsx
import type { CalculationRecord } from '../types';
import { formatCurrency } from '../utils/format';

interface HistoryCardProps {
  record: CalculationRecord;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ record, onDelete }: HistoryCardProps) {
  const date = new Date(record.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleDelete = () => {
    if (confirm('Delete this entry?')) {
      onDelete(record.id);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{record.merchantName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{date}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">Total</span>
        <span className="font-semibold">{formatCurrency(record.grandTotal)}</span>
      </div>
      {record.guests > 1 && (
        <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
          <span>Per person ({record.guests})</span>
          <span>{formatCurrency(record.perPerson)}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create HistoryView**

```tsx
import { useState, useMemo } from 'react';
import type { CalculationRecord } from '../types';
import HistoryCard from './HistoryCard';

interface HistoryViewProps {
  history: CalculationRecord[];
  onDelete: (id: string) => void;
}

export default function HistoryView({ history, onDelete }: HistoryViewProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter((r) => r.merchantName.toLowerCase().includes(q));
  }, [history, search]);

  return (
    <div className="space-y-3 pb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by merchant..."
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      {filtered.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">
          {history.length === 0 ? 'No saved calculations yet.' : 'No results found.'}
        </p>
      ) : (
        filtered.map((record) => (
          <HistoryCard key={record.id} record={record} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HistoryCard.tsx src/components/HistoryView.tsx
git commit -m "feat: add HistoryView and HistoryCard components"
```

---

### Task 12: App Root Assembly

**Files:**
- Modify: `src/App.tsx` (replace placeholder)

- [ ] **Step 1: Wire up App.tsx**

Replace the entire contents of `src/App.tsx` with:

```tsx
import { useState, useCallback } from 'react';
import Header from './components/Header';
import CalculatorView from './components/CalculatorView';
import HistoryView from './components/HistoryView';
import { useTheme } from './hooks/useTheme';
import { useCalculator } from './hooks/useCalculator';
import { loadHistory, deleteRecord } from './utils/storage';
import type { CalculationRecord } from './types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const calculator = useCalculator();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>(() => loadHistory());

  const refreshHistory = useCallback(() => {
    setHistory(loadHistory());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteRecord(id);
    refreshHistory();
  }, [refreshHistory]);

  const handleSaved = useCallback(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <div className="max-w-md mx-auto px-4 min-h-screen">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleHistory={() => setShowHistory((s) => !s)}
        showingHistory={showHistory}
      />
      {showHistory ? (
        <HistoryView history={history} onDelete={handleDelete} />
      ) : (
        <CalculatorView calculator={calculator} onSaved={handleSaved} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the app builds**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App root with calculator and history views"
```

---

### Task 13: Integration Test

**Files:**
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write integration tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText('TipCalc Pro')).toBeInTheDocument();
  });

  it('auto-focuses the subtotal field', () => {
    render(<App />);
    expect(screen.getByLabelText('Subtotal')).toHaveFocus();
  });

  it('calculates tip and total in real-time', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '50');
    await user.type(screen.getByLabelText('Tax'), '4.50');

    // Default preset is 18%: tip = 50 * 0.18 = 9
    expect(screen.getByText('$9.00')).toBeInTheDocument();
    // Total = 50 + 4.50 + 9 = 63.50
    expect(screen.getByText('$63.50')).toBeInTheDocument();
  });

  it('switches tip presets', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '100');
    await user.click(screen.getByText('20%'));

    // Tip = 100 * 0.20 = 20
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('splits between guests', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '100');
    await user.type(screen.getByLabelText('Tax'), '0');
    await user.click(screen.getByText('20%'));
    await user.click(screen.getByLabelText('Increase guests'));
    await user.click(screen.getByLabelText('Increase guests'));

    // Total = 120, 3 guests = $40 each
    expect(screen.getByText('Per person (3)')).toBeInTheDocument();
    expect(screen.getByText('$40.00')).toBeInTheDocument();
  });

  it('saves and shows history', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '50');
    await user.click(screen.getByText('Save to History'));

    // Switch to history
    await user.click(screen.getByLabelText('Show history'));
    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/App.test.tsx
git commit -m "test: add integration tests for full app flow"
```

---

### Task 14: PWA Assets & Final Build Check

**Files:**
- Create: `public/favicon.svg`
- Create: `public/icon-192.png` (placeholder)
- Create: `public/icon-512.png` (placeholder)

- [ ] **Step 1: Create a simple SVG favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#2563eb"/>
  <text x="50" y="68" font-size="50" font-weight="bold" text-anchor="middle" fill="white" font-family="system-ui">%</text>
</svg>
```

- [ ] **Step 2: Generate PNG icons from the SVG**

If `convert` (ImageMagick) is not available, create minimal placeholder PNGs. The PWA manifest needs them but they can be replaced with proper icons later.

```bash
mkdir -p public
# Create a 1x1 blue pixel PNG as placeholder if ImageMagick is unavailable
# These should be replaced with proper icons for production
convert public/favicon.svg -resize 192x192 public/icon-192.png 2>/dev/null || echo "Placeholder icons needed — replace public/icon-192.png and public/icon-512.png with real icons"
convert public/favicon.svg -resize 512x512 public/icon-512.png 2>/dev/null || true
```

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 4: Run all tests one final time**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add public/ 
git commit -m "chore: add PWA assets and verify production build"
```
