export function formatRupee(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}
