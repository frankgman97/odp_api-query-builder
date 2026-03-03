import { useState, useCallback } from 'react';
import { useQueryState } from '../hooks/useQueryState';

interface ActionBarProps {
  onSave: () => void;
}

export function ActionBar({ onSave }: ActionBarProps) {
  const { state, dispatch } = useQueryState();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!state.rawQuery) return;
    try {
      await navigator.clipboard.writeText(state.rawQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = state.rawQuery;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [state.rawQuery]);

  const handleOpenODP = useCallback(() => {
    window.open('https://developer.uspto.gov/api-catalog/open-data-portal', '_blank');
  }, []);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, [dispatch]);

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        className={`btn btn-xs ${copied ? 'btn-success' : 'btn-primary'} flex-1`}
        onClick={handleCopy}
        disabled={!state.rawQuery}
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </>
        )}
      </button>

      <button
        type="button"
        className="btn btn-xs btn-outline flex-1"
        onClick={onSave}
        disabled={!state.rawQuery}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
        </svg>
        Save
      </button>

      <button
        type="button"
        className="btn btn-xs btn-ghost"
        onClick={handleOpenODP}
        title="Open USPTO ODP"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
      </button>

      <button
        type="button"
        className="btn btn-xs btn-ghost text-error"
        onClick={handleClear}
        title="Clear all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
