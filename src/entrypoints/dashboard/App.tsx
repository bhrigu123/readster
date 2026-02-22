import { AnimatePresence, motion } from 'framer-motion';
import { Archive, BookOpen, Inbox } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DateGroup } from '../../components/DateGroup';
import { SearchBar } from '../../components/SearchBar';
import { Sidebar } from '../../components/Sidebar';
import { useReadingList } from '../../hooks/useReadingList';
import { useSearch } from '../../hooks/useSearch';
import type { ViewMode } from '../../types';
import { groupItemsByDate } from '../../utils/date';
import { extractDomain, getFaviconUrl } from '../../utils/url';
import { addItem } from '../../utils/storage';
import { nanoid } from 'nanoid';

export default function App() {
  const {
    loading,
    items,
    archivedItems,
    tags,
    archiveItem,
    unarchiveItem,
    deleteItem,
    addTag,
    addItem: saveItem,
  } = useReadingList();

  const [activeView, setActiveView] = useState<ViewMode>('reading');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle context-menu "save" flow from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldSave = params.get('save') === '1';
    const url = params.get('url');
    const title = params.get('title');

    if (shouldSave && url) {
      const item = {
        id: nanoid(),
        url,
        title: title ?? url,
        favicon: getFaviconUrl(url),
        domain: extractDomain(url),
        dateAdded: Date.now(),
        archived: false,
        tags: [],
      };
      addItem(item);
      // Clean up URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const displayItems = activeView === 'reading' ? items : archivedItems;

  const filteredItems = useSearch(displayItems, searchQuery, selectedTag);

  const groupedItems = useMemo(
    () => groupItemsByDate(filteredItems),
    [filteredItems],
  );

  const handleAddTag = async (tag: string) => {
    await addTag(tag);
  };

  const isEmpty = filteredItems.length === 0 && !loading;

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        background: 'var(--bg)',
        color: 'var(--text)',
        overflow: 'hidden',
      }}
    >
      <Sidebar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSelectedTag(null);
          setSearchQuery('');
        }}
        itemCount={items.length}
        archivedCount={archivedItems.length}
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onAddTag={handleAddTag}
      />

      {/* Main content */}
      <main
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: '20px 28px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text)',
              }}
            >
              {activeView === 'reading' ? (
                <BookOpen size={18} style={{ color: 'var(--accent)' }} />
              ) : (
                <Archive size={18} style={{ color: 'var(--accent)' }} />
              )}
              <h1 style={{ fontSize: '17px', fontWeight: 600 }}>
                {activeView === 'reading' ? 'Reading List' : 'Archived'}
              </h1>
              <span
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontWeight: 500,
                }}
              >
                {displayItems.length}
              </span>
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid var(--border)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Loading…
                </p>
              </motion.div>
            ) : isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  gap: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--accent-dim)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Inbox size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--text)',
                      marginBottom: '6px',
                    }}
                  >
                    {searchQuery || selectedTag
                      ? 'No matching articles'
                      : activeView === 'reading'
                        ? 'Your reading list is empty'
                        : 'Nothing archived yet'}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {searchQuery || selectedTag
                      ? 'Try a different search or tag filter'
                      : activeView === 'reading'
                        ? 'Save pages with the Readster popup to get started'
                        : 'Archive items from your reading list to see them here'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeView}-list`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {[...groupedItems.entries()].map(([label, groupItems]) => (
                  <DateGroup
                    key={label}
                    label={label}
                    items={groupItems}
                    onArchive={archiveItem}
                    onUnarchive={unarchiveItem}
                    onDelete={deleteItem}
                    isArchived={activeView === 'archived'}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
