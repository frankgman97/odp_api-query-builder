import { useQueryState } from '../../hooks/useQueryState';

export function RawEditor() {
  const { state, dispatch } = useQueryState();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch({ type: 'SET_RAW_QUERY', rawQuery: e.target.value });
  }

  function handleSync() {
    dispatch({ type: 'SYNC_FROM_RAW' });
  }

  return (
    <div className="py-2 space-y-2">
      <textarea
        className="textarea textarea-bordered w-full font-mono text-xs min-h-36 leading-relaxed"
        placeholder="Enter Lucene query...&#10;&#10;Example: applicationMetaData.inventionTitle:*robot* AND applicationMetaData.filingDate:[2020-01-01 TO 2023-12-31]"
        value={state.rawQuery}
        onChange={handleChange}
        spellCheck={false}
      />
      {state.rawEditorDirty && (
        <div className="flex items-center gap-2">
          <div className="badge badge-warning badge-xs">Edited</div>
          <button
            type="button"
            className="btn btn-xs btn-primary"
            onClick={handleSync}
          >
            Apply to Builder
          </button>
        </div>
      )}
      <div className="text-[10px] text-base-content/35">
        Syntax: field:value, AND, OR, NOT, wildcards (*, ?), fuzzy (~), ranges [X TO Y]
      </div>
    </div>
  );
}
