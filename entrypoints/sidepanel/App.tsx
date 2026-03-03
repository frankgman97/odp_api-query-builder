import { useState } from 'react';
import { QueryContext, useQueryReducer } from '../../hooks/useQueryState';
import { useSavedQueries } from '../../hooks/useSavedQueries';
import { QueryBuilder } from '../../components/QueryBuilder/QueryBuilder';
import { RawEditor } from '../../components/RawEditor/RawEditor';
import { QueryPreview } from '../../components/QueryPreview';
import { ActionBar } from '../../components/ActionBar';
import { SavedQueries } from '../../components/SavedQueries';
import { AiQueryBuilder } from '../../components/AiQueryBuilder';
import { Settings } from '../../components/Settings';

type Tab = 'visual' | 'ai' | 'raw' | 'saved';

function App() {
  const [state, dispatch] = useQueryReducer();
  const [activeTab, setActiveTab] = useState<Tab>('visual');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const savedQueries = useSavedQueries();

  function handleSaveClick() {
    setSaveName('');
    setSaveDialogOpen(true);
  }

  async function handleSaveConfirm() {
    if (!saveName.trim()) return;
    await savedQueries.save(saveName.trim(), state.ast, state.rawQuery);
    setSaveDialogOpen(false);
    setSaveName('');
  }

  return (
    <QueryContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-base-100 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">ipOS - ODP</h1>
              <p className="text-[10px] text-base-content/40 leading-tight">Patent Query Builder</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-3 mt-1">
          <div className="flex bg-base-200/60 rounded-lg p-0.5 gap-0.5">
            {([
              { id: 'visual' as Tab, label: 'Builder' },
              { id: 'ai' as Tab, label: 'AI' },
              { id: 'raw' as Tab, label: 'Raw' },
              { id: 'saved' as Tab, label: 'Saved' },
            ]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-base-100 text-base-content shadow-sm'
                    : 'text-base-content/50 hover:text-base-content/70'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === 'saved' && savedQueries.queries.length > 0 && (
                  <span className="ml-1 text-[10px] bg-primary/15 text-primary rounded-full px-1.5 py-0.5 font-semibold">
                    {savedQueries.queries.length}
                  </span>
                )}
                {tab.id === 'ai' && (
                  <span className="ml-1 text-[10px] bg-primary/15 text-primary rounded-full px-1 py-0.5 font-semibold">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {activeTab === 'visual' && <QueryBuilder />}
          {activeTab === 'ai' && <AiQueryBuilder onOpenSettings={() => setSettingsOpen(true)} />}
          {activeTab === 'raw' && <RawEditor />}
          {activeTab === 'saved' && (
            <SavedQueries
              queries={savedQueries.queries}
              loading={savedQueries.loading}
              onDelete={savedQueries.remove}
            />
          )}
        </div>

        {/* Bottom Section: Preview + Actions */}
        <div className="border-t border-base-200 px-3 py-2.5 space-y-2 bg-base-100">
          <QueryPreview />
          <ActionBar onSave={handleSaveClick} />
        </div>

        {/* Save Dialog */}
        {saveDialogOpen && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-sm">
              <h3 className="font-bold text-base">Save Query</h3>
              <div className="py-3">
                <input
                  type="text"
                  className="input input-sm input-bordered w-full"
                  placeholder="Query name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveConfirm();
                    if (e.key === 'Escape') setSaveDialogOpen(false);
                  }}
                />
              </div>
              <div className="modal-action mt-0">
                <button className="btn btn-sm btn-ghost" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleSaveConfirm}
                  disabled={!saveName.trim()}
                >
                  Save
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setSaveDialogOpen(false)}>close</button>
            </form>
          </dialog>
        )}

        {/* Settings Dialog */}
        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </QueryContext.Provider>
  );
}

export default App;
