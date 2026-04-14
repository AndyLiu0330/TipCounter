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
