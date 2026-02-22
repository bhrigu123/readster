import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  size?: 'sm' | 'md';
}

export function TagBadge({
  tag,
  onRemove,
  onClick,
  active = false,
  size = 'sm',
}: TagBadgeProps) {
  const base =
    size === 'sm'
      ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-150'
      : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150';

  return (
    <span
      onClick={onClick}
      style={
        active
          ? {
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              cursor: onClick ? 'pointer' : 'default',
            }
          : {
              background: 'var(--border)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              cursor: onClick ? 'pointer' : 'default',
            }
      }
      className={base}
    >
      #{tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{ color: 'inherit', opacity: 0.6 }}
          className="hover:opacity-100 transition-opacity leading-none"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
