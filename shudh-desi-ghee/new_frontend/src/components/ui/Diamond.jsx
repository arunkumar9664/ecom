export default function Diamond({ className = '' }) {
  return <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 rotate-45 bg-terracotta ${className}`} />;
}
