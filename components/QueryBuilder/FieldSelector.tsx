import { useState, useRef, useEffect } from 'react';
import { getFieldsBySection, searchFields, getSectionOrder } from '../../lib/field-schema/helpers';
import type { FieldDefinition } from '../../lib/field-schema/types';

interface FieldSelectorProps {
  value: string;
  onChange: (fieldPath: string) => void;
}

export function FieldSelector({ value, onChange }: FieldSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredFields = search ? searchFields(search) : null;
  const sectionOrder = getSectionOrder();
  const fieldsBySection = getFieldsBySection();

  const allFields = Array.from(fieldsBySection.values()).flat();
  const currentField = allFields.find((f) => f.path === value);

  function handleSelect(field: FieldDefinition) {
    onChange(field.path);
    setOpen(false);
    setSearch('');
  }

  function renderFieldList(fields: FieldDefinition[]) {
    return fields.map((field) => (
      <button
        key={field.path}
        className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-primary/5 transition-colors ${
          field.path === value ? 'bg-primary/10 text-primary font-medium' : ''
        }`}
        onClick={() => handleSelect(field)}
        title={field.description || field.path}
      >
        <span className="block truncate font-medium">{field.label}</span>
        <span className="block text-[10px] text-base-content/35 truncate">{field.path}</span>
      </button>
    ));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md border transition-colors truncate ${
          open
            ? 'border-primary/50 bg-primary/5'
            : 'border-base-300 hover:border-base-content/20'
        }`}
        onClick={() => setOpen(!open)}
      >
        {currentField ? (
          <span className="truncate font-medium">{currentField.label}</span>
        ) : (
          <span className="text-base-content/35 truncate">Select field...</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col">
          <div className="p-1.5 border-b border-base-200">
            <input
              type="text"
              className="input input-xs input-bordered w-full text-xs"
              placeholder="Search fields..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredFields ? (
              filteredFields.length > 0 ? (
                renderFieldList(filteredFields)
              ) : (
                <div className="p-3 text-xs text-base-content/50">No fields found</div>
              )
            ) : (
              sectionOrder.map((section) => {
                const fields = fieldsBySection.get(section);
                if (!fields) return null;
                return (
                  <div key={section}>
                    <div className="px-3 py-1 text-[10px] font-bold text-base-content/40 bg-base-200/50 sticky top-0 uppercase tracking-wider">
                      {section}
                    </div>
                    {renderFieldList(fields)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
