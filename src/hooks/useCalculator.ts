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
