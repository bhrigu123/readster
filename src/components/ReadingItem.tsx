import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive, Check, ExternalLink, Plus, RotateCcw, Tag, Trash2, X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { ReadingItem as ReadingItemType } from '../types';
import { formatRelativeTime } from '../utils/date';
import { TagBadge } from './TagBadge';

interface ReadingItemProps {
  item: ReadingItemType;
  allTags: string[];
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onAddGlobalTag: (tag: string) => void;
  isArchived?: boolean;
}

export function ReadingItem({
  item, allTags,
  onArchive, onUnarchive, onDelete, onUpdateTags, onAddGlobalTag,
  isArchived = false,
}: ReadingItemProps) {
  const [checked, setChecked]       = useState(false);
  const [hovered, setHovered]       = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [newTag, setNewTag]         = useState('');
  const newTagRef = useRef<HTMLInputElement>(null);

  const relTime = formatRelativeTime(
    isArchived ? (item.archivedAt ?? item.dateAdded) : item.dateAdded,
  );

  const handleArchive = () => {
    if (isArchived) return;
    setChecked(true);
    setTimeout(() => onArchive(item.id), 420);
  };

  const toggleTag = (tag: string) => {
    const next = item.tags.includes(tag)
      ? item.tags.filter((t) => t !== tag)
      : [...item.tags, tag];
    onUpdateTags(item.id, next);
  };

  const submitNewTag = () => {
    const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!tag) return;
    onAddGlobalTag(tag);
    if (!item.tags.includes(tag)) onUpdateTags(item.id, [...item.tags, tag]);
    setNewTag('');
    newTagRef.current?.focus();
  };

  const ICON_SIZE = 15;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
      style={{
        borderBottom: '1px solid var(--border)',
        background: editingTags ? 'var(--bg-deep)' : hovered ? 'var(--hover-bg)' : 'transparent',
        cursor: 'pointer',
      }}
      className="relative flex flex-col py-3.5 transition-colors duration-150"
    >
      {/* ── Main row ── */}
      <div className="flex items-center gap-3">
        {/* Checkbox / archive indicator — hidden until hover */}
        {!isArchived ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleArchive(); }}
            style={{
              border: checked ? '2px solid var(--accent)' : '2px solid var(--border-strong)',
              background: checked ? 'var(--accent)' : 'transparent',
              opacity: hovered || checked ? 1 : 0,
              transition: 'opacity 0.15s ease, border-color 0.15s ease, background 0.15s ease',
            }}
            className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
              hover:border-[var(--accent)] cursor-pointer"
          >
            <AnimatePresence>
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                >
                  <Check size={11} color="#fff" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : (
          <span
            style={{ color: 'var(--text-faint)', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease' }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
          >
            <Archive size={14} />
          </span>
        )}

        {/* Favicon */}
        {item.favicon && (
          <img src={item.favicon} alt="" width={16} height={16}
            className="flex-shrink-0 rounded-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <motion.span
              animate={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.4 : 1 }}
              transition={{ duration: 0.2 }}
              style={{ color: 'var(--text)', fontWeight: 500 }}
              className="text-sm leading-snug truncate"
            >
              {item.title || item.url}
            </motion.span>

            {/* Actions — always rendered, visibility toggled via opacity */}
            <div
              style={{
                opacity: (hovered || editingTags) ? 1 : 0,
                pointerEvents: (hovered || editingTags) ? 'auto' : 'none',
                transition: 'opacity 0.15s ease',
              }}
              className="flex items-center gap-0.5 flex-shrink-0"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--text-faint)' }}
                className="p-1.5 rounded-md hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
                title="Open link">
                <ExternalLink size={ICON_SIZE} />
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingTags((v) => !v); }}
                style={editingTags
                  ? { color: 'var(--accent)', background: 'var(--accent-dim)' }
                  : { color: 'var(--text-faint)' }}
                className="p-1.5 rounded-md hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
                title="Edit tags"
              >
                <Tag size={ICON_SIZE} />
              </button>
              {isArchived && onUnarchive && (
                <button onClick={(e) => { e.stopPropagation(); onUnarchive(item.id); }}
                  style={{ color: 'var(--text-faint)' }}
                  className="p-1.5 rounded-md hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
                  title="Restore to reading list">
                  <RotateCcw size={ICON_SIZE} />
                </button>
              )}
              <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                style={{ color: 'var(--text-faint)' }}
                className="p-1.5 rounded-md hover:text-red-500 hover:bg-red-500/10 transition-all"
                title="Delete">
                <Trash2 size={ICON_SIZE} />
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span style={{ color: 'var(--text-faint)' }} className="text-xs">{item.domain}</span>
            <span style={{ color: 'var(--border-strong)' }} className="text-xs">·</span>
            <span style={{ color: 'var(--text-faint)' }} className="text-xs">{relTime}</span>
            {item.tags.length > 0 && (
              <>
                <span style={{ color: 'var(--border-strong)' }} className="text-xs">·</span>
                {item.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} size="sm" />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Inline tag editor ── */}
      <AnimatePresence>
        {editingTags && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden"
          >
            <div
              style={{ borderTop: '1px solid var(--border)' }}
              className="mt-3 pt-3 flex flex-col gap-2.5"
            >
              {/* All available tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => {
                    const active = item.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={active
                          ? { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
                          : { background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                          font-medium transition-all duration-150 hover:opacity-80"
                      >
                        #{tag}
                        {active && <X size={9} strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* New tag input */}
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--text-faint)' }} className="text-xs">#</span>
                <input
                  ref={newTagRef}
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitNewTag();
                    if (e.key === 'Escape') setEditingTags(false);
                  }}
                  placeholder="new tag…"
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  className="flex-1 text-xs px-2 py-1 rounded-md focus:outline-none
                    focus:border-[var(--accent)] placeholder:text-[var(--text-faint)]"
                />
                <button
                  onClick={submitNewTag}
                  style={{ background: 'var(--accent)', color: '#fff' }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md hover:opacity-90 transition-opacity"
                >
                  <Plus size={11} />
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
