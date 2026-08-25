import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ value, quantity, onChange, min = 1, max = Infinity }) {
  const currentValue = Number(value ?? quantity ?? min);
  const safeValue = Number.isFinite(currentValue) ? Math.max(min, currentValue) : min;
  const maxAttribute = Number.isFinite(max) ? max : undefined;

  const handleChange = (nextValue) => {
    if (!Number.isFinite(nextValue)) {
      onChange(min);
      return;
    }

    const clampedValue = Number.isFinite(max)
      ? Math.min(Math.max(nextValue, min), max)
      : Math.max(nextValue, min);

    onChange(clampedValue);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-[#E0DBD5] bg-white">
      <button
        type="button"
        onClick={() => handleChange(safeValue - 1)}
        disabled={safeValue <= min}
        className="inline-flex h-11 w-11 items-center justify-center text-text-dark transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Réduire la quantité"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        min={min}
        max={maxAttribute}
        value={safeValue}
        onChange={(event) => handleChange(Number(event.target.value || min))}
        className="w-16 border-0 bg-transparent text-center text-sm font-semibold text-text-dark outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => handleChange(safeValue + 1)}
        disabled={Number.isFinite(max) && safeValue >= max}
        className="inline-flex h-11 w-11 items-center justify-center text-text-dark transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
