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
