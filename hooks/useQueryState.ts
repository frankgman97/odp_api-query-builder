import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { Condition, ConditionGroup, QueryAST, BooleanOperator, ComparisonOperator } from '../lib/query-engine/types';
import { generateLuceneQuery } from '../lib/query-engine/generator';
import { parseLuceneQuery } from '../lib/query-engine/parser';

// ─── State ─────────────────────────────────────────────

export interface QueryState {
  ast: QueryAST;
  activeTab: 'visual' | 'raw' | 'saved';
  rawQuery: string;
  rawEditorDirty: boolean;
}

function createEmptyAST(): QueryAST {
  return {
    id: crypto.randomUUID(),
    kind: 'group',
    booleanOperator: 'AND',
    children: [],
  };
}

export function createInitialState(): QueryState {
  const ast = createEmptyAST();
  return {
    ast,
    activeTab: 'visual',
    rawQuery: '',
    rawEditorDirty: false,
  };
}

// ─── Actions ───────────────────────────────────────────

type Action =
  | { type: 'SET_TAB'; tab: QueryState['activeTab'] }
  | { type: 'ADD_CONDITION'; groupId: string }
  | { type: 'REMOVE_CONDITION'; conditionId: string }
  | { type: 'UPDATE_CONDITION'; conditionId: string; updates: Partial<Pick<Condition, 'fieldPath' | 'operator' | 'value' | 'valueTo'>> }
  | { type: 'ADD_GROUP'; parentGroupId: string; operator: BooleanOperator }
  | { type: 'REMOVE_GROUP'; groupId: string }
  | { type: 'SET_GROUP_OPERATOR'; groupId: string; operator: BooleanOperator }
  | { type: 'SET_RAW_QUERY'; rawQuery: string }
  | { type: 'SYNC_FROM_RAW' }
  | { type: 'LOAD_AST'; ast: QueryAST; rawQuery: string }
  | { type: 'CLEAR' };

// ─── Helpers ───────────────────────────────────────────

function createCondition(): Condition {
  return {
    id: crypto.randomUUID(),
    kind: 'condition',
    fieldPath: '',
    operator: 'equals',
    value: '',
  };
}

function createGroup(operator: BooleanOperator): ConditionGroup {
  return {
    id: crypto.randomUUID(),
    kind: 'group',
    booleanOperator: operator,
    children: [createCondition()],
  };
}

/** Recursively add a condition to a group by ID */
function addConditionToGroup(group: ConditionGroup, groupId: string): ConditionGroup {
  if (group.id === groupId) {
    return { ...group, children: [...group.children, createCondition()] };
  }
  return {
    ...group,
    children: group.children.map((child) =>
      child.kind === 'group' ? addConditionToGroup(child, groupId) : child,
    ),
  };
}

/** Recursively remove a child (condition or group) by ID */
function removeChildById(group: ConditionGroup, childId: string): ConditionGroup {
  const filtered = group.children.filter((c) => c.id !== childId);
  if (filtered.length !== group.children.length) {
    return { ...group, children: filtered };
  }
  return {
    ...group,
    children: group.children.map((child) =>
      child.kind === 'group' ? removeChildById(child, childId) : child,
    ),
  };
}

/** Recursively update a condition by ID */
function updateConditionById(
  group: ConditionGroup,
  conditionId: string,
  updates: Partial<Pick<Condition, 'fieldPath' | 'operator' | 'value' | 'valueTo'>>,
): ConditionGroup {
  return {
    ...group,
    children: group.children.map((child) => {
      if (child.kind === 'condition' && child.id === conditionId) {
        return { ...child, ...updates };
      }
      if (child.kind === 'group') {
        return updateConditionById(child, conditionId, updates);
      }
      return child;
    }),
  };
}

/** Recursively add a nested group to a parent group by ID */
function addGroupToGroup(group: ConditionGroup, parentGroupId: string, operator: BooleanOperator): ConditionGroup {
  if (group.id === parentGroupId) {
    return { ...group, children: [...group.children, createGroup(operator)] };
  }
  return {
    ...group,
    children: group.children.map((child) =>
      child.kind === 'group' ? addGroupToGroup(child, parentGroupId, operator) : child,
    ),
  };
}

/** Recursively set the boolean operator of a group by ID */
function setGroupOperator(group: ConditionGroup, groupId: string, operator: BooleanOperator): ConditionGroup {
  if (group.id === groupId) {
    return { ...group, booleanOperator: operator };
  }
  return {
    ...group,
    children: group.children.map((child) =>
      child.kind === 'group' ? setGroupOperator(child, groupId, operator) : child,
    ),
  };
}

// ─── Reducer ───────────────────────────────────────────

function queryReducer(state: QueryState, action: Action): QueryState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'ADD_CONDITION': {
      const ast = addConditionToGroup(state.ast, action.groupId);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'REMOVE_CONDITION': {
      const ast = removeChildById(state.ast, action.conditionId);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'UPDATE_CONDITION': {
      const ast = updateConditionById(state.ast, action.conditionId, action.updates);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'ADD_GROUP': {
      const ast = addGroupToGroup(state.ast, action.parentGroupId, action.operator);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'REMOVE_GROUP': {
      const ast = removeChildById(state.ast, action.groupId);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'SET_GROUP_OPERATOR': {
      const ast = setGroupOperator(state.ast, action.groupId, action.operator);
      return { ...state, ast, rawQuery: generateLuceneQuery(ast), rawEditorDirty: false };
    }

    case 'SET_RAW_QUERY':
      return { ...state, rawQuery: action.rawQuery, rawEditorDirty: true };

    case 'SYNC_FROM_RAW': {
      const parsed = parseLuceneQuery(state.rawQuery);
      if (parsed) {
        return { ...state, ast: parsed, rawEditorDirty: false };
      }
      // Parsing failed — keep raw as-is, visual builder is out of sync
      return { ...state, rawEditorDirty: true };
    }

    case 'LOAD_AST':
      return { ...state, ast: action.ast, rawQuery: action.rawQuery, rawEditorDirty: false, activeTab: 'visual' };

    case 'CLEAR': {
      const ast = createEmptyAST();
      return { ...state, ast, rawQuery: '', rawEditorDirty: false };
    }

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────

interface QueryContextValue {
  state: QueryState;
  dispatch: React.Dispatch<Action>;
}

export const QueryContext = createContext<QueryContextValue | null>(null);

export function useQueryState() {
  const ctx = useContext(QueryContext);
  if (!ctx) throw new Error('useQueryState must be used within a QueryProvider');
  return ctx;
}

export function useQueryReducer() {
  return useReducer(queryReducer, undefined, createInitialState);
}
