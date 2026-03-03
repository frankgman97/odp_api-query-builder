import type { Condition, ConditionGroup, QueryAST, ValidationError } from './types';
import { getFieldByPath } from '../field-schema/helpers';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateCondition(condition: Condition): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!condition.fieldPath) {
    errors.push({
      conditionId: condition.id,
      type: 'empty-field',
      message: 'No field selected',
    });
  }

  if (
    condition.operator !== 'isTrue' &&
    condition.operator !== 'isFalse' &&
    !condition.value
  ) {
    errors.push({
      conditionId: condition.id,
      type: 'empty-value',
      message: 'Value is required',
    });
  }

  // Validate field exists in schema
  if (condition.fieldPath && !getFieldByPath(condition.fieldPath)) {
    errors.push({
      conditionId: condition.id,
      type: 'unknown-field',
      message: `Unknown field: ${condition.fieldPath}`,
    });
  }

  // Validate date format
  const field = condition.fieldPath ? getFieldByPath(condition.fieldPath) : undefined;
  if (field?.type === 'date') {
    if (condition.value && !DATE_REGEX.test(condition.value)) {
      errors.push({
        conditionId: condition.id,
        type: 'invalid-date',
        message: 'Date must be in YYYY-MM-DD format',
      });
    }
    if (condition.valueTo && !DATE_REGEX.test(condition.valueTo)) {
      errors.push({
        conditionId: condition.id,
        type: 'invalid-date',
        message: 'End date must be in YYYY-MM-DD format',
      });
    }
  }

  // Validate range order
  if (
    (condition.operator === 'range' || condition.operator === 'rangeExclusive') &&
    condition.value &&
    condition.valueTo
  ) {
    if (condition.value > condition.valueTo) {
      errors.push({
        conditionId: condition.id,
        type: 'invalid-range',
        message: 'Start value must be less than or equal to end value',
      });
    }
  }

  return errors;
}

function validateGroup(group: ConditionGroup): ValidationError[] {
  const errors: ValidationError[] = [];

  if (group.children.length === 0) {
    errors.push({
      conditionId: group.id,
      type: 'empty-group',
      message: 'Group has no conditions',
    });
  }

  for (const child of group.children) {
    if (child.kind === 'condition') {
      errors.push(...validateCondition(child));
    } else {
      errors.push(...validateGroup(child));
    }
  }

  return errors;
}

/** Validate a QueryAST and return any validation errors */
export function validateQuery(ast: QueryAST): ValidationError[] {
  return validateGroup(ast);
}
