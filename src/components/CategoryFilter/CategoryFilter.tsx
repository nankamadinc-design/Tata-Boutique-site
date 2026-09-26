import type { Category } from '../../types';

interface Props {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex min-w-0 gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrer par catégorie">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'tous'}
        onClick={() => onChange('tous')}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          active === 'tous' ? 'bg-primary text-white' : 'bg-surface-offset text-text-muted hover:bg-surface-offset/70'
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={active === cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === cat.slug ? 'bg-primary text-white' : 'bg-surface-offset text-text-muted hover:bg-surface-offset/70'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
