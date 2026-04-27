import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { ConditionGroup } from './ConditionGroup';
import { useQueryState } from '../../hooks/useQueryState';
import type { Condition, ConditionGroup as ConditionGroupType } from '../../lib/query-engine/types';
import { getFieldByPath } from '../../lib/field-schema/helpers';

/** Find which group contains a child by ID, and at what index */
function findChildLocation(
  group: ConditionGroupType,
  childId: string,
): { groupId: string; index: number } | null {
  for (let i = 0; i < group.children.length; i++) {
    if (group.children[i].id === childId) {
      return { groupId: group.id, index: i };
    }
    const child = group.children[i];
    if (child.kind === 'group') {
      const found = findChildLocation(child, childId);
      if (found) return found;
    }
  }
  return null;
}

export function QueryBuilder() {
  const { state, dispatch } = useQueryState();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeLocation = findChildLocation(state.ast, active.id as string);
      const overLocation = findChildLocation(state.ast, over.id as string);

      if (!activeLocation || !overLocation) return;

      // Only support reordering within the same group for now
      if (activeLocation.groupId === overLocation.groupId) {
        dispatch({
          type: 'MOVE_CHILD',
          groupId: activeLocation.groupId,
          fromIndex: activeLocation.index,
          toIndex: overLocation.index,
        });
      }
    },
    [state.ast, dispatch],
  );

  // Find the active item for the drag overlay
  const activeItem = activeId ? findItemById(state.ast, activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="py-2">
        <ConditionGroup group={state.ast} isRoot />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem && activeItem.kind === 'condition' ? (
          <DragOverlayCondition condition={activeItem} />
        ) : activeItem && activeItem.kind === 'group' ? (
          <DragOverlayGroup group={activeItem} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/** Recursively find a condition or group by ID */
function findItemById(
  group: ConditionGroupType,
  id: string,
): Condition | ConditionGroupType | null {
  for (const child of group.children) {
    if (child.id === id) return child;
    if (child.kind === 'group') {
      const found = findItemById(child, id);
      if (found) return found;
    }
  }
  return null;
}

/** Minimal preview shown while dragging a condition */
function DragOverlayCondition({ condition }: { condition: Condition }) {
  const field = condition.fieldPath ? getFieldByPath(condition.fieldPath) : undefined;
  return (
    <div className="bg-base-100 border-2 border-primary/40 rounded-lg px-3 py-2 shadow-xl opacity-90 max-w-64">
      <div className="text-xs font-medium truncate">
        {field?.label || 'No field selected'}
      </div>
      {condition.value && (
        <div className="text-[10px] text-base-content/50 truncate mt-0.5">
          {condition.operator}: {condition.value}
        </div>
      )}
    </div>
  );
}

/** Minimal preview shown while dragging a group */
function DragOverlayGroup({ group }: { group: ConditionGroupType }) {
  return (
    <div className="bg-base-100 border-2 border-secondary/40 rounded-lg px-3 py-2 shadow-xl opacity-90 max-w-64">
      <div className="text-xs font-semibold">
        {group.booleanOperator} group
      </div>
      <div className="text-[10px] text-base-content/50">
        {group.children.length} item{group.children.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
