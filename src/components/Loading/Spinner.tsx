export default function Spinner({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-muted" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
