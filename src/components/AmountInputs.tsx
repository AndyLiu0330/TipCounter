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
