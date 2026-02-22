import type { AppStorage, ReadingItem } from '../types';

const STORAGE_KEY = 'readster_data';

const DEFAULT_STORAGE: AppStorage = {
  items: [],
  tags: [],
};

export async function getStorage(): Promise<AppStorage> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as AppStorage | undefined) ?? DEFAULT_STORAGE;
}

export async function saveStorage(data: AppStorage): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

export async function addItem(item: ReadingItem): Promise<void> {
  const data = await getStorage();
  // Avoid duplicate URLs
  const exists = data.items.some((i) => i.url === item.url);
  if (exists) return;
  data.items = [item, ...data.items];
  await saveStorage(data);
}

export async function archiveItem(id: string): Promise<void> {
  const data = await getStorage();
  data.items = data.items.map((item) =>
    item.id === id
      ? { ...item, archived: true, archivedAt: Date.now() }
      : item,
  );
  await saveStorage(data);
}

export async function unarchiveItem(id: string): Promise<void> {
  const data = await getStorage();
  data.items = data.items.map((item) =>
    item.id === id
      ? { ...item, archived: false, archivedAt: undefined }
      : item,
  );
  await saveStorage(data);
}

export async function deleteItem(id: string): Promise<void> {
  const data = await getStorage();
  data.items = data.items.filter((item) => item.id !== id);
  await saveStorage(data);
}

export async function updateItemTags(
  id: string,
  tags: string[],
): Promise<void> {
  const data = await getStorage();
  data.items = data.items.map((item) =>
    item.id === id ? { ...item, tags } : item,
  );
  await saveStorage(data);
}

export async function addGlobalTag(tag: string): Promise<void> {
  const data = await getStorage();
  if (!data.tags.includes(tag)) {
    data.tags = [...data.tags, tag].sort();
    await saveStorage(data);
  }
}

export async function isUrlSaved(url: string): Promise<boolean> {
  const data = await getStorage();
  return data.items.some((i) => i.url === url && !i.archived);
}
