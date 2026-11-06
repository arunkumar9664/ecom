import { useEffect, useState } from 'react';
import { getImageUrl } from '../utils/image';

export default function SafeImage({ src, alt = '', className = '', style }) {
  const resolved = getImageUrl(src);
  const [failed, setFailed] = useState(!resolved);

  useEffect(() => {
    setFailed(!resolved);
  }, [resolved]);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt || 'Image unavailable'}
        className={`inline-flex items-center justify-center bg-sand text-muted ${className}`}
      >
        <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
          <rect x="6" y="10" width="36" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 32l8-9 6 6 5-5 9 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      </span>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
