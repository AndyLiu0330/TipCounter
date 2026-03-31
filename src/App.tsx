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
