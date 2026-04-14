import MerchantInput from './MerchantInput';
import AmountInputs from './AmountInputs';
import TipSelector from './TipSelector';
import GuestSplitter from './GuestSplitter';
import ResultsDisplay from './ResultsDisplay';
import SaveButton from './SaveButton';
import { useCalculator } from '../hooks/useCalculator';

interface CalculatorViewProps {
  calculator: ReturnType<typeof useCalculator>;
  onSaved: () => void;
}

export default function CalculatorView({ calculator, onSaved }: CalculatorViewProps) {
  const c = calculator;

  const handleSave = () => {
    c.save();
    onSaved();
  };

  const hasSubtotal = parseFloat(c.subtotal) > 0;

  return (
    <div className="space-y-4 pb-4">
      <MerchantInput value={c.merchantName} onChange={c.setMerchantName} />
      <AmountInputs
        subtotal={c.subtotal}
        tax={c.tax}
        onSubtotalChange={c.setSubtotal}
        onTaxChange={c.setTax}
      />
      <TipSelector
        tipMode={c.tipMode}
        tipPreset={c.tipPreset}
        tipCustom={c.tipCustom}
        tipFlatInput={c.tipFlatInput}
        onSelectPreset={c.selectPreset}
        onEnterCustomPercent={c.enterCustomPercent}
        onEnterFlatTip={c.enterFlatTip}
        onRoundUp={c.roundUp}
      />
      <GuestSplitter
        guests={c.guests}
        onIncrement={c.incrementGuests}
        onDecrement={c.decrementGuests}
      />
      <ResultsDisplay
        tipAmount={c.tipAmount}
        grandTotal={c.grandTotal}
        perPerson={c.perPerson}
        guests={c.guests}
      />
      <SaveButton onSave={handleSave} disabled={!hasSubtotal} />
    </div>
  );
}
