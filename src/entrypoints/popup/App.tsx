import { AnimatePresence, motion } from 'framer-motion';
import { Check, ExternalLink, Layers, Plus, Tag } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { TagBadge } from '../../components/TagBadge';
import type { ReadingItem } from '../../types';
import { addGlobalTag, addItem, getStorage, isUrlSaved } from '../../utils/storage';
import { extractDomain, getFaviconUrl } from '../../utils/url';

export default function App() {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setTab(currentTab ?? null);

      const data = await getStorage();
      setTags(data.tags);

      if (currentTab?.url) {
        const saved = await isUrlSaved(currentTab.url);
        setAlreadySaved(saved);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!tab?.url || saved || alreadySaved) return;

    const item: ReadingItem = {
      id: nanoid(),
      url: tab.url,
      title: tab.title ?? tab.url,
      favicon: getFaviconUrl(tab.url),
      domain: extractDomain(tab.url),
      dateAdded: Date.now(),
      archived: false,
      tags: selectedTags,
    };

    await addItem(item);

    // Register any new tags globally
    for (const tag of selectedTags) {
      await addGlobalTag(tag);
    }

    setSaved(true);
  };

  const openDashboard = async () => {
    const dashboardUrl = chrome.runtime.getURL('dashboard.html');
    const existing = await chrome.tabs.query({ url: dashboardUrl });
    if (existing.length > 0 && existing[0].id) {
      await chrome.tabs.update(existing[0].id, { active: true });
      if (existing[0].windowId) {
        await chrome.windows.update(existing[0].windowId, { focused: true });
      }
    } else {
      await chrome.tabs.create({ url: dashboardUrl });
    }
    window.close();
  };

  const addNewTag = () => {
    const tag = newTag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag].sort());
    }
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setNewTag('');
    setShowTagInput(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const domain = tab?.url ? extractDomain(tab.url) : '';
  const isExtensionPage =
    tab?.url?.startsWith('chrome://') ||
    tab?.url?.startsWith('chrome-extension://') ||
    tab?.url?.startsWith('about:') ||
    !tab?.url;

  return (
    <div
      style={{
        width: '380px',
        minHeight: '280px',
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--sidebar)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'var(--accent)',
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={13} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Readster</span>
        </div>
        <button
          onClick={openDashboard}
          style={{
            color: 'var(--accent)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--accent-dim)',
            padding: '4px 10px',
            borderRadius: '99px',
            fontWeight: 500,
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Open List
          <ExternalLink size={11} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        ) : saved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              gap: '12px',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--accent)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={22} color="#fff" strokeWidth={3} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}
            >
              Saved to Readster!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}
            >
              {tab?.title ?? domain}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={openDashboard}
              style={{
                marginTop: '8px',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              className="hover:opacity-80 transition-opacity"
            >
              View Reading List
              <ExternalLink size={12} />
            </motion.button>
          </motion.div>
        ) : isExtensionPage ? (
          <motion.div
            key="ext-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '28px' }}>🔖</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Navigate to a webpage to save it to your reading list.
            </p>
            <button
              onClick={openDashboard}
              style={{
                marginTop: '8px',
                background: 'var(--accent)',
                color: '#fff',
                padding: '9px 20px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Open Reading List
              <ExternalLink size={12} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}
          >
            {/* Page preview card */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              {/* Favicon */}
              <img
                src={getFaviconUrl(tab?.url ?? '')}
                alt=""
                width={16}
                height={16}
                style={{ marginTop: '2px', flexShrink: 0, borderRadius: '3px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    marginBottom: '3px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {tab?.title ?? domain}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{domain}</p>
              </div>

              {alreadySaved && (
                <span
                  style={{
                    background: 'var(--accent-dim)',
                    color: 'var(--accent)',
                    fontSize: '10px',
                    padding: '3px 7px',
                    borderRadius: '99px',
                    fontWeight: 500,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Saved
                </span>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <Tag size={11} style={{ color: 'var(--text-faint)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Tags</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tags.map((tag) => (
                    <TagBadge
                      key={tag}
                      tag={tag}
                      active={selectedTags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* New tag input */}
            {showTagInput ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>#</span>
                <input
                  autoFocus
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addNewTag();
                    if (e.key === 'Escape') setShowTagInput(false);
                  }}
                  onBlur={() => {
                    if (!newTag.trim()) setShowTagInput(false);
                  }}
                  placeholder="tag-name"
                  style={{
                    flex: 1,
                    fontSize: '12px',
                    padding: '5px 8px',
                    background: 'var(--card)',
                    border: '1px solid var(--accent)',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={addNewTag}
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontWeight: 500,
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                style={{
                  color: 'var(--text-faint)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '12px',
                  padding: '4px 0',
                }}
                className="hover:text-[var(--accent)] transition-colors"
              >
                <Plus size={11} />
                Add tag
              </button>
            )}

            {/* Save button */}
            <div style={{ marginTop: 'auto' }}>
              <button
                onClick={handleSave}
                disabled={alreadySaved}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '11px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: alreadySaved ? 'var(--border)' : 'var(--accent)',
                  color: alreadySaved ? 'var(--text-muted)' : '#fff',
                  cursor: alreadySaved ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
                className={alreadySaved ? '' : 'hover:opacity-90 active:scale-[0.98]'}
              >
                {alreadySaved ? (
                  <>
                    <Check size={14} />
                    Already in your list
                  </>
                ) : (
                  <>
                    <Layers size={14} />
                    Save to Readster
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
