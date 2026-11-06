export function getImageUrl(path) {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return path;
  if (path.startsWith('images/')) return `/${path}`;
  if (path.startsWith('uploads/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    const host = apiBase.replace(/\/api\/?$/, '');
    return `${host}/${path}`;
  }
  return '';
}
