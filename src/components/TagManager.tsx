import { Plus } from 'lucide-react';
import { useState } from 'react';

interface TagManagerProps {
  onAdd: (tag: string) => void;
}

export function TagManager({ onAdd }: TagManagerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    if (tag) {
      onAdd(tag);
      setValue('');
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ color: 'var(--text-faint)' }}
        className="flex items-center gap-1.5 text-xs hover:text-[var(--accent)] transition-colors px-2 py-1.5 rounded-lg
          hover:bg-[var(--accent-dim)] w-full"
      >
        <Plus size={12} />
        New tag
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5 px-2">
      <span style={{ color: 'var(--text-faint)' }} className="text-xs">#</span>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        onBlur={() => {
          if (!value.trim()) setOpen(false);
        }}
        placeholder="tag-name"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--accent)',
          color: 'var(--text)',
        }}
        className="flex-1 text-xs px-2 py-1 rounded-md focus:outline-none"
      />
      <button
        type="submit"
        style={{ background: 'var(--accent)', color: '#fff' }}
        className="text-xs px-2 py-1 rounded-md hover:opacity-90 transition-opacity"
      >
        Add
      </button>
    </form>
  );
}
