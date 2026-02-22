import { useCallback, useEffect, useState } from 'react';
import type { AppStorage, ReadingItem } from '../types';
import {
  addGlobalTag,
  addItem,
  archiveItem,
  deleteItem,
  getStorage,
  unarchiveItem,
  updateItemTags,
} from '../utils/storage';

const STORAGE_KEY = 'readster_data';

export function useReadingList() {
  const [data, setData] = useState<AppStorage>({ items: [], tags: [] });
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    getStorage().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Listen for storage changes (e.g. popup saved an item)
  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string,
    ) => {
      if (area === 'local' && changes[STORAGE_KEY]) {
        const newValue = changes[STORAGE_KEY].newValue as AppStorage | undefined;
        if (newValue) setData(newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const items = data.items.filter((i) => !i.archived);
  const archivedItems = data.items.filter((i) => i.archived);

  const handleAddItem = useCallback(async (item: ReadingItem) => {
    await addItem(item);
  }, []);

  const handleArchiveItem = useCallback(async (id: string) => {
    await archiveItem(id);
  }, []);

  const handleUnarchiveItem = useCallback(async (id: string) => {
    await unarchiveItem(id);
  }, []);

  const handleDeleteItem = useCallback(async (id: string) => {
    await deleteItem(id);
  }, []);

  const handleUpdateTags = useCallback(
    async (id: string, tags: string[]) => {
      await updateItemTags(id, tags);
    },
    [],
  );

  const handleAddTag = useCallback(async (tag: string) => {
    await addGlobalTag(tag);
  }, []);

  return {
    loading,
    items,
    archivedItems,
    tags: data.tags,
    addItem: handleAddItem,
    archiveItem: handleArchiveItem,
    unarchiveItem: handleUnarchiveItem,
    deleteItem: handleDeleteItem,
    updateItemTags: handleUpdateTags,
    addTag: handleAddTag,
  };
}
