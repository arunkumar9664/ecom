import { useEffect } from 'react';
import { brand } from '../config/brand';

export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${brand.name}` : brand.name;
    const node = document.querySelector('meta[name="description"]');
    if (node && description) node.setAttribute('content', description);
  }, [title, description]);
}
