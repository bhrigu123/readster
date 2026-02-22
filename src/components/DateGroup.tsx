import { AnimatePresence, motion } from 'framer-motion';
import type { ReadingItem as ReadingItemType } from '../types';
import { ReadingItem } from './ReadingItem';

interface DateGroupProps {
  label: string;
  items: ReadingItemType[];
  allTags: string[];
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onAddGlobalTag: (tag: string) => void;
  isArchived?: boolean;
}

export function DateGroup({
  label, items, allTags,
  onArchive, onUnarchive, onDelete,
  onUpdateTags, onAddGlobalTag,
  isArchived = false,
}: DateGroupProps) {
  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <h2 style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </h2>
        <div style={{ background: 'var(--border)', color: 'var(--text-faint)' }}
          className="text-xs px-1.5 py-0.5 rounded-full">
          {items.length}
        </div>
        <div style={{ background: 'var(--border)' }} className="flex-1 h-px" />
      </div>

      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ReadingItem
              key={item.id}
              item={item}
              allTags={allTags}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              onDelete={onDelete}
              onUpdateTags={onUpdateTags}
              onAddGlobalTag={onAddGlobalTag}
              isArchived={isArchived}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
