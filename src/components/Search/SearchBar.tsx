interface Props {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
}

export default function SearchBar({ value, onChange, onReset }: Props) {
  return (
    <div className="relative">
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
      >
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher par nom, description ou catégorie…"
        className="w-full rounded-md border border-border bg-surface py-3 pl-10 pr-10 text-sm outline-none focus:border-primary"
        data-testid="input-search"
      />
      {value && (
        <button
          type="button"
          onClick={onReset}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      )}
    </div>
  );
}
