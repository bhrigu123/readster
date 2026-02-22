import { AnimatePresence, motion } from 'framer-motion';
import { Archive, Check, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ReadingItem as ReadingItemType } from '../types';
import { formatRelativeTime } from '../utils/date';
import { TagBadge } from './TagBadge';

interface ReadingItemProps {
  item: ReadingItemType;
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete: (id: string) => void;
  isArchived?: boolean;
}

export function ReadingItem({
  item,
  onArchive,
  onUnarchive,
  onDelete,
  isArchived = false,
}: ReadingItemProps) {
  const [checked, setChecked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleArchive = () => {
    if (isArchived) return;
    setChecked(true);
    setTimeout(() => onArchive(item.id), 420);
  };

  const relTime = formatRelativeTime(
    isArchived ? (item.archivedAt ?? item.dateAdded) : item.dateAdded,
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false);
        setShowActions(false);
      }}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
      className="group relative flex items-start gap-3 p-3.5 rounded-xl transition-shadow duration-200"
    >
      {/* Checkbox / Archive trigger */}
      {!isArchived && (
        <button
          onClick={handleArchive}
          style={{
            border: checked
              ? '2px solid var(--accent)'
              : '2px solid var(--border-strong)',
            background: checked ? 'var(--accent)' : 'transparent',
          }}
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
            transition-all duration-200 hover:border-[var(--accent)] cursor-pointer"
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
      )}

      {/* Archived indicator */}
      {isArchived && (
        <span
          style={{ color: 'var(--text-faint)' }}
          className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center"
        >
          <Archive size={14} />
        </span>
      )}

      {/* Favicon */}
      {item.favicon && (
        <img
          src={item.favicon}
          alt=""
          width={16}
          height={16}
          className="mt-1 flex-shrink-0 rounded-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <motion.a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            animate={{
              textDecoration: checked ? 'line-through' : 'none',
              opacity: checked ? 0.5 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{ color: 'var(--text)' }}
            className="text-sm font-medium leading-snug hover:text-[var(--accent)] transition-colors
              line-clamp-2 break-words"
          >
            {item.title || item.url}
          </motion.a>

          {/* Hover actions */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1 flex-shrink-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-faint)' }}
                  className="p-1 rounded-md hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
                  title="Open link"
                >
                  <ExternalLink size={13} />
                </a>
                {isArchived && onUnarchive && (
                  <button
                    onClick={() => onUnarchive(item.id)}
                    style={{ color: 'var(--text-faint)' }}
                    className="p-1 rounded-md hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
                    title="Restore to reading list"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ color: 'var(--text-faint)' }}
                  className="p-1 rounded-md hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span style={{ color: 'var(--text-faint)' }} className="text-xs">
            {item.domain}
          </span>
          <span style={{ color: 'var(--border-strong)' }} className="text-xs">
            ·
          </span>
          <span style={{ color: 'var(--text-faint)' }} className="text-xs">
            {relTime}
          </span>

          {item.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--border-strong)' }} className="text-xs">
                ·
              </span>
              {item.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} size="sm" />
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
