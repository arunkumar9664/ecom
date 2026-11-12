/** Status strings the API actually writes, plus Shipped when an admin sets it. */
export const ORDER_STATUS = {
  Pending: {
    label: 'Pending',
    chip: 'bg-sand text-ink',
  },
  Processing: {
    label: 'Processing',
    chip: 'border border-olive bg-paper text-olive',
  },
  Shipped: {
    label: 'Shipped',
    chip: 'bg-ink text-paper',
  },
  Delivered: {
    label: 'Delivered',
    chip: 'bg-olive text-paper',
  },
  Cancelled: {
    label: 'Cancelled',
    chip: 'bg-terracotta text-paper',
  },
  'Flagged for Review': {
    label: 'Flagged for review',
    chip: 'border border-terracotta bg-paper text-terracotta',
  },
};

export function statusMeta(status) {
  return ORDER_STATUS[status] || { label: status || 'Pending', chip: 'bg-sand text-ink' };
}

export function statusGroup(status) {
  if (status === 'Delivered') return 'delivered';
  if (status === 'Cancelled') return 'cancelled';
  return 'active';
}

export function timelineSteps(order) {
  const history = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
  const hasShipped = order?.status === 'Shipped' || history.some((entry) => entry?.status === 'Shipped');
  const steps = ['Placed', 'Processing'];
  if (hasShipped) steps.push('Shipped');
  steps.push('Delivered');
  return steps;
}

export function timelineIndex(order) {
  if (!order || order.status === 'Cancelled' || order.status === 'Flagged for Review') return -1;
  if (order.status === 'Pending') return 0;
  const steps = timelineSteps(order);
  if (order.status === 'Processing') return 1;
  if (order.status === 'Shipped') return steps.indexOf('Shipped');
  if (order.status === 'Delivered') return steps.length - 1;
  return 0;
}

export function lineSubtotal(order) {
  return (order?.items || []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
}
