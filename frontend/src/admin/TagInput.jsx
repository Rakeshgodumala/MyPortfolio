import { useId, useState } from 'react';
import { FiX } from 'react-icons/fi';

/** Technology tag editor: type and press Enter or comma to add, Backspace to remove the last tag. */
export default function TagInput({ tags, onChange, suggestions = [], max = 20, invalid, describedBy }) {
  const [draft, setDraft] = useState('');
  const listId = useId();

  const add = (raw) => {
    const value = raw.trim().replace(/,$/, '').trim();
    if (!value || value.length > 40 || tags.length >= max) return;
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) return;
    onChange([...tags, value]);
    setDraft('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add(draft);
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className={`tag-input form-control ${invalid ? 'is-invalid' : ''}`}>
      {tags.map((tag) => (
        <span key={tag} className="tag tag-accent">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
          >
            <FiX aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id="project-technologies"
        value={draft}
        onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={onKeyDown}
        onBlur={() => draft && add(draft)}
        list={listId}
        placeholder={tags.length ? 'Add another…' : 'e.g. React.js — press Enter to add'}
        aria-describedby={describedBy}
        maxLength={40}
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !tags.includes(s))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
    </div>
  );
}
