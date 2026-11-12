import { useShop } from '../../hooks/useShop';

export default function MockBadge() {
  const { useMockData } = useShop();
  if (!useMockData) return null;
  return (
    <span className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 font-body text-[10px] font-semibold tracking-[0.12em] text-paper uppercase">
      Mock
    </span>
  );
}

export function MockLine() {
  const { useMockData } = useShop();
  if (!useMockData) return null;
  return <p className="px-gutter pb-6 text-center font-body text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Mock data</p>;
}
