import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by title, URL, or domain…',
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={15}
        style={{ color: 'var(--text-faint)' }}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-all duration-150
          placeholder:text-[var(--text-faint)]
          focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{ color: 'var(--text-faint)' }}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[var(--text-muted)] transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
