import type { AppStorage } from '../types';

const STORAGE_KEY = 'readster_data';

export default defineBackground(() => {
  // ── Context menu ──────────────────────────────────────────────────────────
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'save-to-readster',
      title: 'Save to Readster',
      contexts: ['page'],
    });

    // Initialise badge on fresh install
    updateBadge();
  });

  chrome.contextMenus.onClicked.addListener((_info, tab) => {
    if (!tab?.id) return;
    // Open popup programmatically (MV3 can't open popup from background,
    // so we open the dashboard with a "save" query param instead)
    const dashUrl =
      chrome.runtime.getURL('dashboard.html') +
      `?save=1&url=${encodeURIComponent(tab.url ?? '')}&title=${encodeURIComponent(tab.title ?? '')}`;
    chrome.tabs.create({ url: dashUrl });
  });

  // ── Badge management ──────────────────────────────────────────────────────
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[STORAGE_KEY]) {
      const newData = changes[STORAGE_KEY].newValue as AppStorage | undefined;
      if (newData) setBadge(newData.items.filter((i) => !i.archived).length);
    }
  });

  // Set badge on service-worker wake-up
  updateBadge();
});

async function updateBadge(): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const data = result[STORAGE_KEY] as AppStorage | undefined;
  const count = data ? data.items.filter((i) => !i.archived).length : 0;
  setBadge(count);
}

function setBadge(count: number): void {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count > 99 ? '99+' : String(count) });
    chrome.action.setBadgeBackgroundColor({ color: '#7c6dfa' });
    chrome.action.setBadgeTextColor?.({ color: '#ffffff' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}
