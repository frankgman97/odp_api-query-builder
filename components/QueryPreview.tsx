import { useState } from 'react';
import { useQueryState } from '../hooks/useQueryState';

export function QueryPreview() {
  const { state } = useQueryState();
  const [expanded, setExpanded] = useState(false);

  const query = state.rawQuery;
  const isLong = query.length > 100;

  if (!query) {
    return (
      <div className="bg-base-200/30 rounded-lg px-3 py-2">
        <div className="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-0.5">Query</div>
        <div className="text-xs text-base-content/25 font-mono italic">
          Add conditions to generate a query...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200/30 rounded-lg px-3 py-2">
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider">Query</div>
        {isLong && (
          <button
            type="button"
            className="text-[10px] text-primary hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </div>
      <div
        className={`font-mono text-xs break-all leading-relaxed ${
          !expanded && isLong ? 'line-clamp-2' : ''
        }`}
      >
        {query}
      </div>
    </div>
  );
}
