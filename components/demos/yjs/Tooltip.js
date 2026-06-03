export function Tooltip({ label, children, className }) {
  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 max-w-[220px] -translate-x-1/2 rounded-lg border border-card-border bg-foreground px-2.5 py-1.5 text-center text-[11px] leading-snug text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
