export type BooleanOperator = 'AND' | 'OR' | 'NOT';

export type ComparisonOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'wildcard'
  | 'fuzzy'
  | 'range'
  | 'rangeExclusive'
  | 'greaterThan'
  | 'lessThan'
  | 'isTrue'
  | 'isFalse';

export interface Condition {
  id: string;
  kind: 'condition';
  fieldPath: string;
  operator: ComparisonOperator;
  value: string;
  valueTo?: string;
}

export interface ConditionGroup {
  id: string;
  kind: 'group';
  booleanOperator: BooleanOperator;
  children: Array<Condition | ConditionGroup>;
}

export type QueryAST = ConditionGroup;

export interface ValidationError {
  conditionId: string;
  type: 'empty-field' | 'empty-value' | 'invalid-date' | 'invalid-range' | 'unknown-field' | 'empty-group';
  message: string;
}

export interface Operator {
  value: ComparisonOperator;
  label: string;
}
