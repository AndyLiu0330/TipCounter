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
