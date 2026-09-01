/**
 * Offline / static-deploy mode — no backend required.
 * Set VITE_OFFLINE_DEMO=true when building for UI-only sharing (Netlify, Vercel, etc.)
 */
export const OFFLINE_DEMO = import.meta.env.VITE_OFFLINE_DEMO === 'true';
