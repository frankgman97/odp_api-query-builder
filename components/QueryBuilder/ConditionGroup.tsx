import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ConditionRow } from './ConditionRow';
import { useQueryState } from '../../hooks/useQueryState';
import type { ConditionGroup as ConditionGroupType, BooleanOperator } from '../../lib/query-engine/types';

interface ConditionGroupProps {
  group: ConditionGroupType;
  depth?: number;
  isRoot?: boolean;
}

const DEPTH_COLORS = [
  { border: 'border-l-primary', bg: 'bg-primary/5', badge: 'text-primary', activeBg: 'bg-primary/15' },
  { border: 'border-l-secondary', bg: 'bg-secondary/5', badge: 'text-secondary', activeBg: 'bg-secondary/15' },
  { border: 'border-l-accent', bg: 'bg-accent/5', badge: 'text-accent', activeBg: 'bg-accent/15' },
];

export function ConditionGroup({ group, depth = 0, isRoot = false }: ConditionGroupProps) {
  const { dispatch } = useQueryState();
  const colors = DEPTH_COLORS[depth % DEPTH_COLORS.length];

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
  const childIds = group.children.map((c) => c.id);

  return (
    <div
      className={
        isRoot
          ? ''
          : `border-l-3 ${colors.border} ${colors.bg} rounded-r-lg pl-3 ml-1 py-2.5 pr-1.5`
      }
    >
      {/* Group header */}
      <div className="flex items-center gap-1.5 mb-2">
        {/* Boolean operator toggle */}
        <div className="inline-flex rounded-lg overflow-hidden border border-base-300">
          {(['AND', 'OR', 'NOT'] as BooleanOperator[]).map((op) => (
            <button
              key={op}
              type="button"
              className={`px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all ${
                group.booleanOperator === op
                  ? `${colors.activeBg} ${colors.badge}`
                  : 'text-base-content/25 hover:text-base-content/50 hover:bg-base-200/50'
              }`}
              onClick={() => handleOperatorChange(op)}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {!isRoot && (
          <button
            type="button"
            className="btn btn-xs btn-ghost text-base-content/25 hover:text-error btn-square"
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
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-base-200/60 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-base-content/40 mb-1">No conditions yet</p>
          <p className="text-[10px] text-base-content/25 mb-4">
            Build your query by adding conditions and groups
          </p>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleAddCondition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add first condition
          </button>
        </div>
      )}

      {/* Children with sortable context */}
      <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {group.children.map((child) => (
            <SortableItem key={child.id} id={child.id}>
              {child.kind === 'condition' ? (
                <ConditionRow condition={child} />
              ) : (
                <ConditionGroup group={child} depth={depth + 1} />
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      {/* Add buttons */}
      {(!isEmpty || !isRoot) && (
        <div className="flex gap-1 mt-2">
          <button
            type="button"
            className="btn btn-xs btn-ghost text-base-content/35 hover:text-primary gap-1"
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
              className="btn btn-xs btn-ghost text-base-content/35 hover:text-secondary gap-1"
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
