import { storageKeys } from '../config/brand';

export function readAppliedCoupon(subtotal) {
  try {
    const raw = sessionStorage.getItem(storageKeys.appliedCoupon);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved?.code || saved.subtotal !== subtotal) {
      sessionStorage.removeItem(storageKeys.appliedCoupon);
      return null;
    }
    return saved;
  } catch {
    sessionStorage.removeItem(storageKeys.appliedCoupon);
    return null;
  }
}

export function writeAppliedCoupon(coupon) {
  sessionStorage.setItem(storageKeys.appliedCoupon, JSON.stringify(coupon));
}

export function clearAppliedCoupon() {
  sessionStorage.removeItem(storageKeys.appliedCoupon);
}
