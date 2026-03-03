import { describe, it, expect } from 'vitest';
import { generateLuceneQuery } from '../generator';
import type { Condition, ConditionGroup, QueryAST } from '../types';

function makeCondition(
  fieldPath: string,
  operator: Condition['operator'],
  value: string,
  valueTo?: string,
): Condition {
  return { id: 'c1', kind: 'condition', fieldPath, operator, value, valueTo };
}

function makeGroup(
  booleanOperator: ConditionGroup['booleanOperator'],
  children: ConditionGroup['children'],
): ConditionGroup {
  return { id: 'g1', kind: 'group', booleanOperator, children };
}

describe('generateLuceneQuery', () => {
  it('generates a simple equals query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.patentNumber', 'equals', 'D1011682'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.patentNumber:D1011682');
  });

  it('quotes values with spaces', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'equals', 'Autonomous Robot System'),
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.inventionTitle:"Autonomous Robot System"',
    );
  });

  it('generates a contains query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'contains', 'robot'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.inventionTitle:*robot*');
  });

  it('generates a startsWith query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'startsWith', 'Auto'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.inventionTitle:Auto*');
  });

  it('generates an endsWith query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'endsWith', 'system'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.inventionTitle:*system');
  });

  it('generates a wildcard query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'wildcard', 'te?t'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.inventionTitle:te?t');
  });

  it('generates a fuzzy query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.inventionTitle', 'fuzzy', 'robot'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.inventionTitle:robot~');
  });

  it('generates a date range query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.filingDate', 'range', '2020-01-01', '2023-12-31'),
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.filingDate:[2020-01-01 TO 2023-12-31]',
    );
  });

  it('generates a greaterThan query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.filingDate', 'greaterThan', '2020-01-01'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.filingDate:[2020-01-01 TO *]');
  });

  it('generates a lessThan query', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.filingDate', 'lessThan', '2023-12-31'),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.filingDate:[* TO 2023-12-31]');
  });

  it('generates boolean true/false', () => {
    const ast: QueryAST = makeGroup('AND', [
      makeCondition('applicationMetaData.nationalStageIndicator', 'isTrue', ''),
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.nationalStageIndicator:true');
  });

  it('joins multiple conditions with AND', () => {
    const ast: QueryAST = makeGroup('AND', [
      { ...makeCondition('applicationMetaData.inventionTitle', 'contains', 'robot'), id: 'c1' },
      {
        ...makeCondition('applicationMetaData.filingDate', 'range', '2020-01-01', '2023-12-31'),
        id: 'c2',
      },
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.inventionTitle:*robot* AND applicationMetaData.filingDate:[2020-01-01 TO 2023-12-31]',
    );
  });

  it('joins multiple conditions with OR', () => {
    const ast: QueryAST = makeGroup('OR', [
      { ...makeCondition('applicationMetaData.inventorBag.lastName', 'equals', 'Smith'), id: 'c1' },
      { ...makeCondition('applicationMetaData.inventorBag.lastName', 'equals', 'Jones'), id: 'c2' },
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.inventorBag.lastName:Smith OR applicationMetaData.inventorBag.lastName:Jones',
    );
  });

  it('handles nested groups with parentheses', () => {
    const ast: QueryAST = makeGroup('AND', [
      { ...makeCondition('applicationMetaData.inventionTitle', 'contains', 'robot'), id: 'c1' },
      {
        id: 'g2',
        kind: 'group',
        booleanOperator: 'OR',
        children: [
          { ...makeCondition('applicationMetaData.inventorBag.lastName', 'equals', 'Smith'), id: 'c2' },
          { ...makeCondition('applicationMetaData.inventorBag.lastName', 'equals', 'Jones'), id: 'c3' },
        ],
      },
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.inventionTitle:*robot* AND (applicationMetaData.inventorBag.lastName:Smith OR applicationMetaData.inventorBag.lastName:Jones)',
    );
  });

  it('handles NOT groups', () => {
    const ast: QueryAST = makeGroup('AND', [
      { ...makeCondition('applicationMetaData.inventionTitle', 'contains', 'robot'), id: 'c1' },
      {
        id: 'g2',
        kind: 'group',
        booleanOperator: 'NOT',
        children: [
          { ...makeCondition('applicationMetaData.applicationTypeCode', 'equals', 'DES'), id: 'c2' },
        ],
      },
    ]);
    expect(generateLuceneQuery(ast)).toBe(
      'applicationMetaData.inventionTitle:*robot* AND NOT applicationMetaData.applicationTypeCode:DES',
    );
  });

  it('returns empty string for empty group', () => {
    const ast: QueryAST = makeGroup('AND', []);
    expect(generateLuceneQuery(ast)).toBe('');
  });

  it('skips conditions with empty values', () => {
    const ast: QueryAST = makeGroup('AND', [
      { ...makeCondition('applicationMetaData.inventionTitle', 'equals', ''), id: 'c1' },
      { ...makeCondition('applicationMetaData.patentNumber', 'equals', '12345'), id: 'c2' },
    ]);
    expect(generateLuceneQuery(ast)).toBe('applicationMetaData.patentNumber:12345');
  });
});
