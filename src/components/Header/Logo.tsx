export default function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <path d="M18 22h28l-2.5 6H20.5L18 22Z" className="fill-accent" />
      <path
        d="M21 30h22l-3.4 20.4a3 3 0 0 1-2.96 2.6H27.36a3 3 0 0 1-2.96-2.6L21 30Z"
        fill="white"
        opacity="0.95"
      />
      <circle cx="32" cy="17" r="5" className="fill-accent" />
    </svg>
  );
}
