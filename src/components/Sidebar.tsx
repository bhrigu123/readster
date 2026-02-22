import { motion } from 'framer-motion';
import { Archive, BookOpen, Hash, Layers } from 'lucide-react';
import type { ViewMode } from '../types';
import { TagBadge } from './TagBadge';
import { TagManager } from './TagManager';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (v: ViewMode) => void;
  itemCount: number;
  archivedCount: number;
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  onAddTag: (tag: string) => void;
}

function CountBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        background: 'var(--border)',
        color: 'var(--text-faint)',
      }}
      className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums"
    >
      {count}
    </span>
  );
}

function NavItem({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={
        active
          ? {
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
            }
          : {
              color: 'var(--text-muted)',
            }
      }
      className="relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm
        font-medium transition-all duration-150 hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]"
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          style={{ background: 'var(--accent)' }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {icon}
      {label}
      <CountBadge count={count} />
    </button>
  );
}

export function Sidebar({
  activeView,
  onViewChange,
  itemCount,
  archivedCount,
  tags,
  selectedTag,
  onTagSelect,
  onAddTag,
}: SidebarProps) {
  return (
    <aside
      style={{
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--border)',
        width: '240px',
        flexShrink: 0,
      }}
      className="flex flex-col h-full overflow-y-auto"
    >
      {/* Logo */}
      <div
        style={{ borderBottom: '1px solid var(--border)' }}
        className="px-5 py-5"
      >
        <div className="flex items-center gap-2.5">
          <div
            style={{ background: 'var(--accent)' }}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <Layers size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ color: 'var(--text)' }} className="text-sm font-semibold leading-none">
              Readster
            </h1>
            <p style={{ color: 'var(--text-faint)' }} className="text-[10px] mt-0.5">
              Local reading list
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 flex flex-col gap-1">
        <NavItem
          icon={<BookOpen size={15} />}
          label="Reading List"
          count={itemCount}
          active={activeView === 'reading'}
          onClick={() => onViewChange('reading')}
        />
        <NavItem
          icon={<Archive size={15} />}
          label="Archived"
          count={archivedCount}
          active={activeView === 'archived'}
          onClick={() => onViewChange('archived')}
        />
      </nav>

      {/* Tags section */}
      {(tags.length > 0 || true) && (
        <div
          style={{ borderTop: '1px solid var(--border)' }}
          className="px-3 py-4 flex-1"
        >
          <div className="flex items-center gap-2 px-2 mb-2">
            <Hash size={11} style={{ color: 'var(--text-faint)' }} />
            <span
              style={{ color: 'var(--text-faint)' }}
              className="text-[10px] font-semibold uppercase tracking-wider"
            >
              Tags
            </span>
          </div>

          {/* "All" filter */}
          <button
            onClick={() => onTagSelect(null)}
            style={
              selectedTag === null
                ? { background: 'var(--accent-dim)', color: 'var(--accent)' }
                : { color: 'var(--text-muted)' }
            }
            className="w-full flex items-center px-2 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-150 hover:bg-[var(--accent-dim)] hover:text-[var(--accent)] mb-1"
          >
            All
          </button>

          {/* Tag list */}
          <div className="flex flex-col gap-0.5 mb-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
                style={
                  selectedTag === tag
                    ? { background: 'var(--accent-dim)', color: 'var(--accent)' }
                    : { color: 'var(--text-muted)' }
                }
                className="w-full flex items-center px-2 py-1.5 rounded-lg text-xs
                  transition-all duration-150 hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]"
              >
                <span style={{ color: 'var(--text-faint)' }} className="mr-1">#</span>
                {tag}
              </button>
            ))}
          </div>

          <TagManager onAdd={onAddTag} />
        </div>
      )}

      {/* Footer */}
      <div
        style={{ borderTop: '1px solid var(--border)' }}
        className="px-4 py-3"
      >
        <p style={{ color: 'var(--text-faint)' }} className="text-[10px]">
          All data stored locally
        </p>
      </div>
    </aside>
  );
}
