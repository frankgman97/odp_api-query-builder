import type { Condition, ConditionGroup, QueryAST } from './types';

/** Characters that have special meaning in Lucene and need escaping in values */
const SPECIAL_CHARS = /([+\-&|!(){}\[\]^"~*?:\\/])/g;

/** Escape special Lucene characters in a value string */
function escapeValue(value: string): string {
  // Don't escape if the user is intentionally using wildcards
  return value.replace(SPECIAL_CHARS, '\\$1');
}

/** Wrap value in quotes if it contains spaces, otherwise return as-is */
function quoteIfNeeded(value: string): string {
  if (value.includes(' ')) {
    return `"${value}"`;
  }
  return value;
}

/** Serialize a single Condition to a Lucene query fragment */
function serializeCondition(condition: Condition): string {
  const { fieldPath, operator, value, valueTo } = condition;

  if (!fieldPath || (!value && operator !== 'isTrue' && operator !== 'isFalse')) {
    return '';
  }

  switch (operator) {
    case 'equals':
      return `${fieldPath}:${quoteIfNeeded(value)}`;

    case 'contains':
      return `${fieldPath}:*${escapeValue(value)}*`;

    case 'startsWith':
      return `${fieldPath}:${escapeValue(value)}*`;

    case 'endsWith':
      return `${fieldPath}:*${escapeValue(value)}`;

    case 'wildcard':
      // User provides the pattern directly (with ? and *)
      return `${fieldPath}:${value}`;

    case 'fuzzy':
      return `${fieldPath}:${escapeValue(value)}~`;

    case 'range':
      return `${fieldPath}:[${value} TO ${valueTo || '*'}]`;

    case 'rangeExclusive':
      return `${fieldPath}:{${value} TO ${valueTo || '*'}}`;

    case 'greaterThan':
      return `${fieldPath}:[${value} TO *]`;

    case 'lessThan':
      return `${fieldPath}:[* TO ${value}]`;

    case 'isTrue':
      return `${fieldPath}:true`;

    case 'isFalse':
      return `${fieldPath}:false`;

    default:
      return '';
  }
}

/** Serialize a ConditionGroup (possibly nested) to a Lucene query string */
function serializeGroup(group: ConditionGroup, isRoot: boolean = false): string {
  const parts: string[] = [];

  for (const child of group.children) {
    let fragment: string;
    if (child.kind === 'condition') {
      fragment = serializeCondition(child);
    } else {
      fragment = serializeGroup(child, false);
    }
    if (fragment) {
      parts.push(fragment);
    }
  }

  if (parts.length === 0) {
    return '';
  }

  if (parts.length === 1) {
    const inner = parts[0];
    if (group.booleanOperator === 'NOT') {
      return `NOT ${inner}`;
    }
    // Single condition at root — no parens needed
    return isRoot ? inner : inner;
  }

  const joined = parts.join(` ${group.booleanOperator} `);

  if (group.booleanOperator === 'NOT') {
    // NOT applies to a group: NOT (a OR b)
    return `NOT (${joined})`;
  }

  // Wrap in parens if nested (not root)
  return isRoot ? joined : `(${joined})`;
}

/** Generate a Lucene query string from a QueryAST */
export function generateLuceneQuery(ast: QueryAST): string {
  return serializeGroup(ast, true);
}
