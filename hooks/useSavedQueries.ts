import { useState, useEffect, useCallback } from 'react';
import type { SavedQuery } from '../lib/storage';
import { loadSavedQueries, addSavedQuery, deleteSavedQuery } from '../lib/storage';
import type { QueryAST } from '../lib/query-engine/types';

export function useSavedQueries() {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedQueries().then((q) => {
      setQueries(q);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (name: string, ast: QueryAST, queryString: string) => {
    const newQuery = await addSavedQuery({ name, ast, queryString });
    setQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteSavedQuery(id);
    setQueries((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const reload = useCallback(async () => {
    const q = await loadSavedQueries();
    setQueries(q);
  }, []);

  return { queries, loading, save, remove, reload };
}
