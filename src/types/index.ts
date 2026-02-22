export interface ReadingItem {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  domain: string;
  dateAdded: number;
  archived: boolean;
  archivedAt?: number;
  tags: string[];
}

export interface AppStorage {
  items: ReadingItem[];
  tags: string[];
}

export type ViewMode = 'reading' | 'archived';
