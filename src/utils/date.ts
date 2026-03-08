import type { ReadingItem } from '../types';

export type DateGroupLabel =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | string; // "Month Year" e.g. "January 2025"

export function getDateGroupLabel(timestamp: number): DateGroupLabel {
  const now = new Date();
  const date = new Date(timestamp);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86_400_000);

  if (date >= todayStart) return 'Today';
  if (date >= yesterdayStart) return 'Yesterday';
  if (date >= weekStart) return 'This Week';

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const GROUP_ORDER: Record<string, number> = {
  Today: 0,
  Yesterday: 1,
  'This Week': 2,
};

function groupOrder(label: string): number {
  if (label in GROUP_ORDER) return GROUP_ORDER[label];
  // Month labels come after Today/Yesterday/This Week, newest month first
  const date = new Date(label);
  if (!isNaN(date.getTime())) return 3 + (1 / date.getTime());
  return 999;
}

export function groupItemsByDate(
  items: ReadingItem[],
): Map<DateGroupLabel, ReadingItem[]> {
  const groups = new Map<DateGroupLabel, ReadingItem[]>();

  for (const item of items) {
    const ts = item.archived ? (item.archivedAt ?? item.dateAdded) : item.dateAdded;
    const label = getDateGroupLabel(ts);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }

  // Sort groups: Today → Yesterday → This Week → oldest months
  // Sort items within each group: newest first
  const sorted = new Map(
    [...groups.entries()]
      .sort(([a], [b]) => groupOrder(a) - groupOrder(b))
      .map(([label, groupItems]) => {
        groupItems.sort((a, b) => {
          const tsA = a.archived ? (a.archivedAt ?? a.dateAdded) : a.dateAdded;
          const tsB = b.archived ? (b.archivedAt ?? b.dateAdded) : b.dateAdded;
          return tsB - tsA;
        });
        return [label, groupItems] as [DateGroupLabel, ReadingItem[]];
      }),
  );

  return sorted;
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
