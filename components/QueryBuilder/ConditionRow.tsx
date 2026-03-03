import { FieldSelector } from './FieldSelector';
import { OperatorSelector } from './OperatorSelector';
import { ValueInput } from './ValueInput';
import { useQueryState } from '../../hooks/useQueryState';
import { getFieldByPath, getDefaultOperator } from '../../lib/field-schema/helpers';
import type { Condition, ComparisonOperator } from '../../lib/query-engine/types';

interface ConditionRowProps {
  condition: Condition;
}

export function ConditionRow({ condition }: ConditionRowProps) {
  const { dispatch } = useQueryState();
  const field = condition.fieldPath ? getFieldByPath(condition.fieldPath) : undefined;
  const fieldType = field?.type || 'string';

  function handleFieldChange(fieldPath: string) {
    const newField = getFieldByPath(fieldPath);
    const newType = newField?.type || 'string';
    const newOperator = getDefaultOperator(newType) as ComparisonOperator;
    dispatch({
      type: 'UPDATE_CONDITION',
      conditionId: condition.id,
      updates: { fieldPath, operator: newOperator, value: '', valueTo: undefined },
    });
  }

  function handleOperatorChange(operator: ComparisonOperator) {
    dispatch({
      type: 'UPDATE_CONDITION',
      conditionId: condition.id,
      updates: { operator, value: condition.value, valueTo: undefined },
    });
  }

  function handleValueChange(value: string, valueTo?: string) {
    dispatch({
      type: 'UPDATE_CONDITION',
      conditionId: condition.id,
      updates: { value, valueTo },
    });
  }

  function handleRemove() {
    dispatch({ type: 'REMOVE_CONDITION', conditionId: condition.id });
  }

  return (
    <div className="bg-base-200/40 rounded-lg p-2 space-y-1.5 group relative">
      {/* Remove button */}
      <button
        type="button"
        className="absolute top-1.5 right-1.5 btn btn-xs btn-ghost btn-square text-base-content/30 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
        title="Remove condition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Field selector - full width */}
      <FieldSelector value={condition.fieldPath} onChange={handleFieldChange} />

      {/* Operator + Value - row */}
      <div className="flex items-center gap-1.5">
        <OperatorSelector
          fieldType={fieldType}
          value={condition.operator}
          onChange={handleOperatorChange}
        />
        <ValueInput
          fieldType={fieldType}
          operator={condition.operator}
          value={condition.value}
          valueTo={condition.valueTo}
          field={field}
          onChange={handleValueChange}
        />
      </div>
    </div>
  );
}
