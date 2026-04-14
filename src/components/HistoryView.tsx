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
