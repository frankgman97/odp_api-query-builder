import { getOperatorsForType } from '../../lib/field-schema/helpers';
import type { FieldType } from '../../lib/field-schema/types';
import type { ComparisonOperator } from '../../lib/query-engine/types';

interface OperatorSelectorProps {
  fieldType: FieldType;
  value: ComparisonOperator;
  onChange: (operator: ComparisonOperator) => void;
}

export function OperatorSelector({ fieldType, value, onChange }: OperatorSelectorProps) {
  const operators = getOperatorsForType(fieldType);

  return (
    <select
      className="select select-xs select-bordered min-w-0 text-xs shrink-0"
      value={value}
      onChange={(e) => onChange(e.target.value as ComparisonOperator)}
    >
      {operators.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}
