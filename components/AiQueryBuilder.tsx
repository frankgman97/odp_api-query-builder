import { useState, useEffect, useRef } from 'react';
import { useQueryState } from '../hooks/useQueryState';
import { generateQueryWithLLM } from '../lib/llm';
import { loadLLMSettings } from '../lib/storage';
import type { LLMSettings } from '../lib/storage';

interface AiQueryBuilderProps {
  onOpenSettings: () => void;
}

interface HistoryEntry {
  prompt: string;
  query: string;
  timestamp: number;
}

export function AiQueryBuilder({ onOpenSettings }: AiQueryBuilderProps) {
  const { dispatch } = useQueryState();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<LLMSettings | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadLLMSettings().then(setSettings);
  }, []);

  const hasKey = settings?.apiKey && settings.apiKey.length > 0;

  async function handleGenerate() {
    if (!settings || loading) return;
    setError('');
    setLoading(true);

    const result = await generateQueryWithLLM(prompt, settings);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const query = result.query!;
    setHistory((prev) => [
      { prompt, query, timestamp: Date.now() },
      ...prev,
    ]);
    setPrompt('');
  }

  function handleUseQuery(query: string) {
    dispatch({ type: 'SET_RAW_QUERY', rawQuery: query });
    dispatch({ type: 'SYNC_FROM_RAW' });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  if (!hasKey) {
    return (
      <div className="py-6 flex flex-col items-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">AI Query Generation</p>
          <p className="text-xs text-base-content/50 mt-1">
            Describe what patents you're looking for in plain English and let AI generate the Lucene query for you.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={onOpenSettings}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
          Add API Key
        </button>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-3">
      {/* Input area */}
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full text-sm min-h-20 leading-relaxed resize-none"
          placeholder="Describe the patents you're looking for...&#10;&#10;e.g. &quot;Find all utility patents about autonomous robots filed after 2020 by inventors in California&quot;"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          spellCheck={false}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-base-content/40">
            {settings?.provider === 'anthropic' ? 'Claude' : 'OpenAI'} &middot; {settings?.model?.split('-').slice(0, 2).join(' ')}
          </span>
          <button
            type="button"
            className={`btn btn-sm btn-primary ${loading ? 'loading' : ''}`}
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error/10 text-error text-xs rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Results history */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-base-content/50">Results</div>
          {history.map((entry, i) => (
            <div key={entry.timestamp} className="bg-base-200/50 rounded-lg p-3 space-y-2">
              <div className="text-xs text-base-content/50 truncate">
                {entry.prompt}
              </div>
              <div className="font-mono text-xs break-all bg-base-100 rounded px-2 py-1.5 border border-base-300">
                {entry.query}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={() => handleUseQuery(entry.query)}
                >
                  Use this query
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(entry.query);
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {history.length === 0 && !loading && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-base-content/50">Try these</div>
          {[
            'Find utility patents about machine learning filed after 2022',
            'Patents granted to Google with CPC code G06F',
            'Design patents for furniture filed in the last year',
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="block w-full text-left text-xs bg-base-200/50 hover:bg-base-200 rounded-lg px-3 py-2 transition-colors"
              onClick={() => {
                setPrompt(suggestion);
                textareaRef.current?.focus();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
