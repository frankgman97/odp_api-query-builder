import { useState, useEffect } from 'react';
import type { LLMSettings, LLMProvider } from '../lib/storage';
import { loadLLMSettings, saveLLMSettings } from '../lib/storage';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

const ANTHROPIC_MODELS = [
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { value: 'claude-haiku-4-20250414', label: 'Claude Haiku 4' },
];

const OPENAI_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
];

export function Settings({ open, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<LLMSettings>({
    provider: 'anthropic',
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
  });
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (open) {
      loadLLMSettings().then(setSettings);
      setSaved(false);
      setShowKey(false);
    }
  }, [open]);

  async function handleSave() {
    await saveLLMSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleProviderChange(provider: LLMProvider) {
    const model = provider === 'anthropic' ? 'claude-sonnet-4-20250514' : 'gpt-4o-mini';
    setSettings({ ...settings, provider, model });
  }

  if (!open) return null;

  const models = settings.provider === 'anthropic' ? ANTHROPIC_MODELS : OPENAI_MODELS;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">AI Settings</h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Provider */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Provider</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn btn-sm flex-1 ${settings.provider === 'anthropic' ? 'btn-primary' : 'btn-ghost border-base-300'}`}
                onClick={() => handleProviderChange('anthropic')}
              >
                Anthropic
              </button>
              <button
                type="button"
                className={`btn btn-sm flex-1 ${settings.provider === 'openai' ? 'btn-primary' : 'btn-ghost border-base-300'}`}
                onClick={() => handleProviderChange('openai')}
              >
                OpenAI
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">API Key</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                className="input input-sm input-bordered w-full pr-10 font-mono text-xs"
                placeholder={settings.provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <label className="label py-0.5">
              <span className="label-text-alt text-base-content/40">
                Your key is stored locally and never sent anywhere except the provider API.
              </span>
            </label>
          </div>

          {/* Model */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Model</span>
            </label>
            <select
              className="select select-sm select-bordered w-full"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              {models.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-action mt-5">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn btn-sm ${saved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
