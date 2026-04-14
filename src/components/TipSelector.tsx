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
