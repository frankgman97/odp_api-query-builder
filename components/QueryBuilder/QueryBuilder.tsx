import { ConditionGroup } from './ConditionGroup';
import { useQueryState } from '../../hooks/useQueryState';

export function QueryBuilder() {
  const { state } = useQueryState();

  return (
    <div className="py-2">
      <ConditionGroup group={state.ast} isRoot />
    </div>
  );
}
