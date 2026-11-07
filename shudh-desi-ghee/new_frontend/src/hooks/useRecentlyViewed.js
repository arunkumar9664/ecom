import { useState } from 'react';
import { storageKeys } from '../config/brand';

function readIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKeys.recentlyViewed) || '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 8) : [];
  } catch {
    return [];
  }
}

function writeIds(ids) {
  localStorage.setItem(storageKeys.recentlyViewed, JSON.stringify(ids.slice(0, 8)));
}

export default function useRecentlyViewed(currentId) {
  const [ids, setIds] = useState(readIds);
  const [seen, setSeen] = useState(currentId);
  if (seen !== currentId) {
    setSeen(currentId);
    if (currentId) {
      const next = [currentId, ...readIds().filter((entry) => entry !== currentId)].slice(0, 8);
      writeIds(next);
      setIds(next);
    }
  }
  return ids.filter((entry) => entry !== currentId);
}
