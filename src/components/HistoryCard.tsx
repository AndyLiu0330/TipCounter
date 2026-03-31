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
