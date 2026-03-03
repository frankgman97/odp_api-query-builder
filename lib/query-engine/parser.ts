import type { Condition, ConditionGroup, QueryAST, ComparisonOperator } from './types';

let _idCounter = 0;
function nextId(): string {
  return `parsed_${++_idCounter}`;
}

/** Reset ID counter (for testing) */
export function resetParserIds(): void {
  _idCounter = 0;
}

// Token types for the Lucene tokenizer
type TokenType =
  | 'FIELD_VALUE'  // field:value
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'LPAREN'
  | 'RPAREN'
  | 'RAW';         // anything we can't parse

interface Token {
  type: TokenType;
  value: string;
  // For FIELD_VALUE tokens:
  field?: string;
  fieldValue?: string;
}

/** Tokenize a Lucene query string */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    // Skip whitespace
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }

    // Parentheses
    if (input[i] === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (input[i] === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Boolean operators (must check before general word parsing)
    if (input.slice(i, i + 3) === 'AND' && (i + 3 >= len || /[\s()]/.test(input[i + 3]))) {
      tokens.push({ type: 'AND', value: 'AND' });
      i += 3;
      continue;
    }
    if (input.slice(i, i + 2) === 'OR' && (i + 2 >= len || /[\s()]/.test(input[i + 2]))) {
      tokens.push({ type: 'OR', value: 'OR' });
      i += 2;
      continue;
    }
    if (input.slice(i, i + 3) === 'NOT' && (i + 3 >= len || /[\s()]/.test(input[i + 3]))) {
      tokens.push({ type: 'NOT', value: 'NOT' });
      i += 3;
      continue;
    }
    if (input.slice(i, i + 2) === '&&') {
      tokens.push({ type: 'AND', value: '&&' });
      i += 2;
      continue;
    }
    if (input.slice(i, i + 2) === '||') {
      tokens.push({ type: 'OR', value: '||' });
      i += 2;
      continue;
    }

    // Try to match field:value pattern
    // Fields contain dots and alphanumeric chars
    const fieldMatch = input.slice(i).match(/^([a-zA-Z_][a-zA-Z0-9_.]*):(.+?)(?=\s+(AND|OR|NOT|&&|\|\|)\s+|\s*[()]|$)/);
    if (fieldMatch) {
      const field = fieldMatch[1];
      const rawValue = fieldMatch[2].trim();
      tokens.push({
        type: 'FIELD_VALUE',
        value: fieldMatch[0],
        field,
        fieldValue: rawValue,
      });
      i += fieldMatch[0].length;
      continue;
    }

    // Fallback: consume until whitespace or paren
    let word = '';
    while (i < len && !/[\s()]/.test(input[i])) {
      word += input[i];
      i++;
    }
    if (word) {
      tokens.push({ type: 'RAW', value: word });
    }
  }

  return tokens;
}

/** Determine the comparison operator from a raw value string */
function parseFieldValue(rawValue: string): { operator: ComparisonOperator; value: string; valueTo?: string } {
  // Boolean values
  if (rawValue === 'true') return { operator: 'isTrue', value: 'true' };
  if (rawValue === 'false') return { operator: 'isFalse', value: 'false' };

  // Range: [X TO Y] or {X TO Y}
  const rangeMatch = rawValue.match(/^[\[{](.+?)\s+TO\s+(.+?)[\]}]$/);
  if (rangeMatch) {
    const from = rangeMatch[1].trim();
    const to = rangeMatch[2].trim();
    const isInclusive = rawValue.startsWith('[');

    if (from === '*') return { operator: 'lessThan', value: to };
    if (to === '*') return { operator: 'greaterThan', value: from };
    return {
      operator: isInclusive ? 'range' : 'rangeExclusive',
      value: from,
      valueTo: to,
    };
  }

  // Fuzzy: value~
  if (rawValue.endsWith('~') && !rawValue.endsWith('\\~')) {
    return { operator: 'fuzzy', value: rawValue.slice(0, -1) };
  }

  // Contains: *value*
  if (rawValue.startsWith('*') && rawValue.endsWith('*') && rawValue.length > 2) {
    return { operator: 'contains', value: rawValue.slice(1, -1) };
  }

  // Starts with: value*
  if (rawValue.endsWith('*') && !rawValue.startsWith('*')) {
    return { operator: 'startsWith', value: rawValue.slice(0, -1) };
  }

  // Ends with: *value
  if (rawValue.startsWith('*') && !rawValue.endsWith('*')) {
    return { operator: 'endsWith', value: rawValue.slice(1) };
  }

  // Has wildcards (? or *) anywhere else — wildcard operator
  if (/[?*]/.test(rawValue)) {
    return { operator: 'wildcard', value: rawValue };
  }

  // Quoted value: strip quotes
  if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
    return { operator: 'equals', value: rawValue.slice(1, -1) };
  }

  // Default: equals
  return { operator: 'equals', value: rawValue };
}

/** Recursive descent parser for token stream */
function parseExpression(tokens: Token[], pos: { index: number }): (Condition | ConditionGroup)[] {
  const items: (Condition | ConditionGroup)[] = [];
  let currentOp: 'AND' | 'OR' | 'NOT' | null = null;

  while (pos.index < tokens.length) {
    const token = tokens[pos.index];

    if (token.type === 'RPAREN') {
      break; // End of a group
    }

    if (token.type === 'AND' || token.type === 'OR') {
      currentOp = token.type;
      pos.index++;
      continue;
    }

    if (token.type === 'NOT') {
      pos.index++;
      // NOT can precede a parenthesized group or a single field:value
      const nextToken = tokens[pos.index];
      if (nextToken && nextToken.type === 'LPAREN') {
        pos.index++; // consume (
        const children = parseExpression(tokens, pos);
        if (pos.index < tokens.length && tokens[pos.index].type === 'RPAREN') {
          pos.index++; // consume )
        }
        const group: ConditionGroup = {
          id: nextId(),
          kind: 'group',
          booleanOperator: 'NOT',
          children,
        };
        items.push(group);
      } else if (nextToken && nextToken.type === 'FIELD_VALUE') {
        const parsed = parseFieldValue(nextToken.fieldValue!);
        const condition: Condition = {
          id: nextId(),
          kind: 'condition',
          fieldPath: nextToken.field!,
          ...parsed,
        };
        const group: ConditionGroup = {
          id: nextId(),
          kind: 'group',
          booleanOperator: 'NOT',
          children: [condition],
        };
        items.push(group);
        pos.index++;
      }
      continue;
    }

    if (token.type === 'LPAREN') {
      pos.index++; // consume (
      const children = parseExpression(tokens, pos);
      if (pos.index < tokens.length && tokens[pos.index].type === 'RPAREN') {
        pos.index++; // consume )
      }
      // Determine the boolean operator from children context
      const innerOp = currentOp || 'AND';
      if (children.length === 1) {
        items.push(children[0]);
      } else {
        const group: ConditionGroup = {
          id: nextId(),
          kind: 'group',
          booleanOperator: innerOp,
          children,
        };
        items.push(group);
      }
      currentOp = null;
      continue;
    }

    if (token.type === 'FIELD_VALUE') {
      const parsed = parseFieldValue(token.fieldValue!);
      const condition: Condition = {
        id: nextId(),
        kind: 'condition',
        fieldPath: token.field!,
        ...parsed,
      };
      items.push(condition);
      pos.index++;
      continue;
    }

    // RAW token — skip it
    pos.index++;
  }

  return items;
}

/**
 * Parse a Lucene query string into a QueryAST.
 * Returns null if parsing fails completely.
 * Best-effort: may not perfectly round-trip for all queries.
 */
export function parseLuceneQuery(query: string): QueryAST | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    resetParserIds();
    const tokens = tokenize(trimmed);
    if (tokens.length === 0) return null;

    // Determine the root boolean operator from the tokens
    let rootOp: 'AND' | 'OR' = 'AND';
    for (const token of tokens) {
      if (token.type === 'OR') {
        rootOp = 'OR';
        break;
      }
      if (token.type === 'AND') {
        rootOp = 'AND';
        break;
      }
    }

    const pos = { index: 0 };
    const children = parseExpression(tokens, pos);

    if (children.length === 0) return null;

    return {
      id: nextId(),
      kind: 'group',
      booleanOperator: rootOp,
      children,
    };
  } catch {
    return null;
  }
}
