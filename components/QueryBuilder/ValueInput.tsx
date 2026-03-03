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

export function ValueInput({ fieldType, operator, value, valueTo, field, onChange }: ValueInputProps) {
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
        <span className="text-[10px] text-base-content/40 shrink-0">to</span>
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
