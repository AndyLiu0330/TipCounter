import { useState } from 'react';

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
}

export default function SaveButton({ onSave, disabled }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || saved}
      className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
        saved
          ? 'bg-emerald-600 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
      }`}
    >
      {saved ? 'Saved!' : 'Save to History'}
    </button>
  );
}
