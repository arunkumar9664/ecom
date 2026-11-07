import { statusMeta } from '../../utils/orderStatus';

export default function StatusChip({ status }) {
  const meta = statusMeta(status);
  return (
    <span className={`inline-flex h-7 items-center rounded-[3px] px-2.5 font-body text-[11px] font-semibold tracking-[0.12em] uppercase ${meta.chip}`}>
      {meta.label}
    </span>
  );
}
