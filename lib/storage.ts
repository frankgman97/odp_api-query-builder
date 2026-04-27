import type { QueryAST } from './query-engine/types';

export interface SavedQuery {
  id: string;
  name: string;
  ast: QueryAST;
  queryString: string;
  createdAt: number;
}

export type LLMProvider = 'anthropic' | 'openai';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey: string;
  model: string;
}

const STORAGE_KEY = 'ipos_saved_queries';
const SETTINGS_KEY = 'ipos_llm_settings';

const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'anthropic',
  apiKey: '',
  model: 'claude-opus-4-6',
};

function hasBrowserStorage(): boolean {
  try {
    return typeof browser !== 'undefined' && !!browser.storage?.local;
  } catch {
    return false;
  }
}

// ─── Saved Queries ────────────────────────────────────

export async function loadSavedQueries(): Promise<SavedQuery[]> {
  if (hasBrowserStorage()) {
    const result = await browser.storage.local.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as SavedQuery[]) || [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSavedQueries(queries: SavedQuery[]): Promise<void> {
  if (hasBrowserStorage()) {
    await browser.storage.local.set({ [STORAGE_KEY]: queries });
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
}

export async function addSavedQuery(query: Omit<SavedQuery, 'id' | 'createdAt'>): Promise<SavedQuery> {
  const queries = await loadSavedQueries();
  const newQuery: SavedQuery = {
    ...query,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  queries.unshift(newQuery);
  await saveSavedQueries(queries);
  return newQuery;
}

export async function deleteSavedQuery(id: string): Promise<void> {
  const queries = await loadSavedQueries();
  const filtered = queries.filter((q) => q.id !== id);
  await saveSavedQueries(filtered);
}

// ─── LLM Settings ─────────────────────────────────────

export async function loadLLMSettings(): Promise<LLMSettings> {
  if (hasBrowserStorage()) {
    const result = await browser.storage.local.get(SETTINGS_KEY);
    return (result[SETTINGS_KEY] as LLMSettings) || { ...DEFAULT_SETTINGS };
  }
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? JSON.parse(raw) : { ...DEFAULT_SETTINGS };
}

export async function saveLLMSettings(settings: LLMSettings): Promise<void> {
  if (hasBrowserStorage()) {
    await browser.storage.local.set({ [SETTINGS_KEY]: settings });
    return;
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
