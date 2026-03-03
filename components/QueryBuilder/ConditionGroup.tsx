import { ConditionRow } from './ConditionRow';
import { useQueryState } from '../../hooks/useQueryState';
import type { ConditionGroup as ConditionGroupType, BooleanOperator } from '../../lib/query-engine/types';

interface ConditionGroupProps {
  group: ConditionGroupType;
  depth?: number;
  isRoot?: boolean;
}

const DEPTH_STYLES = [
  { border: 'border-primary/20', bg: 'bg-primary/5', badge: 'bg-primary/10 text-primary' },
  { border: 'border-secondary/20', bg: 'bg-secondary/5', badge: 'bg-secondary/10 text-secondary' },
  { border: 'border-accent/20', bg: 'bg-accent/5', badge: 'bg-accent/10 text-accent' },
];

export function ConditionGroup({ group, depth = 0, isRoot = false }: ConditionGroupProps) {
  const { dispatch } = useQueryState();
  const style = DEPTH_STYLES[depth % DEPTH_STYLES.length];

  function handleAddCondition() {
    dispatch({ type: 'ADD_CONDITION', groupId: group.id });
  }

  function handleAddGroup() {
    dispatch({ type: 'ADD_GROUP', parentGroupId: group.id, operator: 'OR' });
  }

  function handleOperatorChange(operator: BooleanOperator) {
    dispatch({ type: 'SET_GROUP_OPERATOR', groupId: group.id, operator });
  }

  function handleRemoveGroup() {
    dispatch({ type: 'REMOVE_GROUP', groupId: group.id });
  }

  const isEmpty = group.children.length === 0;

  return (
    <div
      className={`${
        isRoot ? '' : `border-l-2 ${style.border} ${style.bg} rounded-r-lg pl-2.5 ml-1 py-2 pr-1`
      }`}
    >
      {/* Group header */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex items-center bg-base-200/60 rounded-md overflow-hidden">
          {(['AND', 'OR', 'NOT'] as BooleanOperator[]).map((op) => (
            <button
              key={op}
              type="button"
              className={`px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                group.booleanOperator === op
                  ? style.badge
                  : 'text-base-content/30 hover:text-base-content/50'
              }`}
              onClick={() => handleOperatorChange(op)}
            >
              {op}
            </button>
          ))}
        </div>

        {!isRoot && (
          <button
            type="button"
            className="btn btn-xs btn-ghost text-base-content/30 hover:text-error btn-square"
            onClick={handleRemoveGroup}
            title="Remove group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Empty state */}
      {isEmpty && isRoot && (
        <div className="text-center py-6">
          <p className="text-sm text-base-content/40 mb-3">No conditions yet</p>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleAddCondition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add condition
          </button>
        </div>
      )}

      {/* Children */}
      <div className="space-y-1.5">
        {group.children.map((child) => {
          if (child.kind === 'condition') {
            return <ConditionRow key={child.id} condition={child} />;
          }
          return (
            <ConditionGroup
              key={child.id}
              group={child}
              depth={depth + 1}
            />
          );
        })}
      </div>

      {/* Add buttons */}
      {(!isEmpty || !isRoot) && (
        <div className="flex gap-1.5 mt-2">
          <button
            type="button"
            className="btn btn-xs btn-ghost text-base-content/40 hover:text-primary"
            onClick={handleAddCondition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Condition
          </button>
          {depth < 2 && (
            <button
              type="button"
              className="btn btn-xs btn-ghost text-base-content/40 hover:text-secondary"
              onClick={handleAddGroup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Group
            </button>
          )}
        </div>
      )}
    </div>
  );
}
