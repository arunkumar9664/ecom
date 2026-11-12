export function IconHands({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8 18c0-4 2-7 5-7 2 0 3 1 3 3v8M16 14c0-4 2-7 5-7 2 0 3 1 3 3v8" />
      <path d="M8 18c-2 1-3 3-3 5 0 3 3 5 7 5h8c4 0 7-2 7-5 0-2-1-4-3-5" />
    </svg>
  );
}

export function IconLeaf({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8 22c8-1 14-8 16-16-8 2-15 8-16 16z" />
      <path d="M12 18c2-2 5-4 8-6" />
    </svg>
  );
}

export function IconLock({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="8" y="14" width="16" height="12" rx="1.5" />
      <path d="M12 14v-3a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconBox({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 12l10-5 10 5-10 5-10-5z" />
      <path d="M6 12v10l10 5 10-5V12M16 17v10" />
    </svg>
  );
}

export function EmptyBagArt({ className = 'h-24 w-24' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M24 32h32l-3 30H27L24 32z" />
      <path d="M32 32c0-6 4-10 8-10s8 4 8 10" />
      <path d="M34 46h12" />
    </svg>
  );
}

export function TrackArt({ className = 'h-28 w-28' }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="22" y="18" width="52" height="64" rx="2" />
      <path d="M34 34h28M34 46h20M34 58h16" />
      <circle cx="64" cy="62" r="10" />
      <path d="M71 69l6 6" />
    </svg>
  );
}

export function CheckMark({ className = 'h-16 w-16', animate = true }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M20 33l8 8 16-18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'check-draw' : ''}
      />
    </svg>
  );
}
