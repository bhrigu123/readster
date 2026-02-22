import { useMemo } from 'react';
import type { ReadingItem } from '../types';

export function useSearch(
  items: ReadingItem[],
  query: string,
  selectedTag: string | null,
): ReadingItem[] {
  return useMemo(() => {
    let filtered = items;

    if (selectedTag) {
      filtered = filtered.filter((item) => item.tags.includes(selectedTag));
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q) ||
          item.domain.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [items, query, selectedTag]);
}
