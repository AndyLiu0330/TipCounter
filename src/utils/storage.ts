import type { CalculationRecord } from '../types';

const STORAGE_KEY = 'tipcalc-history';

export function loadHistory(): CalculationRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CalculationRecord[];
  } catch {
    return [];
  }
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
