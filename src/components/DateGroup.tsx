import { AnimatePresence, motion } from 'framer-motion';
import type { ReadingItem as ReadingItemType } from '../types';
import { ReadingItem } from './ReadingItem';

interface DateGroupProps {
  label: string;
  items: ReadingItemType[];
  onArchive: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete: (id: string) => void;
  isArchived?: boolean;
}

export function DateGroup({
  label,
  items,
  onArchive,
  onUnarchive,
  onDelete,
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
      {/* Group header */}
      <div className="flex items-center gap-3 mb-3">
        <h2
          style={{ color: 'var(--text-muted)' }}
          className="text-xs font-semibold uppercase tracking-wider"
        >
          {label}
        </h2>
        <div
          style={{ background: 'var(--border)', color: 'var(--text-faint)' }}
          className="text-xs px-1.5 py-0.5 rounded-full"
        >
          {items.length}
        </div>
        <div
          style={{ background: 'var(--border)' }}
          className="flex-1 h-px"
        />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ReadingItem
              key={item.id}
              item={item}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              onDelete={onDelete}
              isArchived={isArchived}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
