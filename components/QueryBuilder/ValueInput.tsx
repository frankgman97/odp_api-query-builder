import { useState } from 'react';
import type { FieldType } from '../../lib/field-schema/types';
import type { ComparisonOperator } from '../../lib/query-engine/types';
import type { FieldDefinition } from '../../lib/field-schema/types';

interface ValueInputProps {
  fieldType: FieldType;
  operator: ComparisonOperator;
  value: string;
  valueTo?: string;
  field?: FieldDefinition;
  onChange: (value: string, valueTo?: string) => void;
}

const WILDCARD_PATTERNS = [
  { label: '*term*', pattern: '*{v}*', desc: 'Contains' },
  { label: 'term*', pattern: '{v}*', desc: 'Starts with' },
  { label: '*term', pattern: '*{v}', desc: 'Ends with' },
  { label: 't?rm', pattern: '{v}', desc: 'Single char (?)' },
];

export function ValueInput({ fieldType, operator, value, valueTo, field, onChange }: ValueInputProps) {
  const [showWildcardHelp, setShowWildcardHelp] = useState(false);

  if (operator === 'isTrue' || operator === 'isFalse') {
    return null;
  }

  if (field?.enumValues && field.enumValues.length > 0 && operator === 'equals') {
    return (
      <select
        className="select select-xs select-bordered flex-1 min-w-0 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {field.enumValues.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }

  if (operator === 'range' || operator === 'rangeExclusive') {
    const inputType = fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text';
    return (
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input
          type={inputType}
          className="input input-xs input-bordered flex-1 min-w-0 text-xs"
          placeholder="From"
          value={value}
          onChange={(e) => onChange(e.target.value, valueTo)}
        />
        <span className="text-[10px] text-base-content/40 shrink-0 font-medium">to</span>
        <input
          type={inputType}
          className="input input-xs input-bordered flex-1 min-w-0 text-xs"
          placeholder="To"
          value={valueTo || ''}
          onChange={(e) => onChange(value, e.target.value)}
        />
      </div>
    );
  }

  if (fieldType === 'date') {
    return (
      <input
        type="date"
        className="input input-xs input-bordered flex-1 min-w-0 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (fieldType === 'number') {
    return (
      <input
        type="number"
        className="input input-xs input-bordered flex-1 min-w-0 text-xs"
        placeholder={field?.example || 'Number...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  // String input with wildcard support
  if (operator === 'wildcard') {
    return (
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center gap-1">
          <input
            type="text"
            className="input input-xs input-bordered flex-1 min-w-0 text-xs font-mono"
            placeholder="e.g. mach*learn* or rob?t"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-xs btn-ghost btn-square text-base-content/30 hover:text-primary shrink-0"
            onClick={() => setShowWildcardHelp(!showWildcardHelp)}
            title="Wildcard patterns"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {showWildcardHelp && (
          <div className="absolute z-40 top-full left-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-2 w-52">
            <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mb-1.5">
              Quick patterns
            </div>
            <div className="space-y-0.5">
              {WILDCARD_PATTERNS.map((wp) => (
                <button
                  key={wp.label}
                  type="button"
                  className="flex items-center w-full text-left px-2 py-1 rounded text-xs hover:bg-base-200 transition-colors gap-2"
                  onClick={() => {
                    const baseValue = value.replace(/[*?]/g, '') || 'term';
                    onChange(wp.pattern.replace('{v}', baseValue));
                    setShowWildcardHelp(false);
                  }}
                >
                  <code className="text-[10px] font-mono text-primary bg-primary/10 px-1 rounded">
                    {wp.label}
                  </code>
                  <span className="text-base-content/50">{wp.desc}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-1.5 border-t border-base-200 text-[10px] text-base-content/30">
              <code>*</code> = any characters, <code>?</code> = single character
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      type="text"
      className="input input-xs input-bordered flex-1 min-w-0 text-xs"
      placeholder={field?.example || 'Value...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
