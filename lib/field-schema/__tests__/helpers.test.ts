import { describe, it, expect } from 'vitest';
import { getFieldsBySection, getFieldByPath, searchFields, getOperatorsForType, getSectionOrder } from '../helpers';

describe('getFieldsBySection', () => {
  it('returns a map with multiple sections', () => {
    const map = getFieldsBySection();
    expect(map.size).toBeGreaterThan(10);
    expect(map.has('Application Info')).toBe(true);
    expect(map.has('Inventors')).toBe(true);
    expect(map.has('Assignments')).toBe(true);
  });

  it('has correct fields in Application Info', () => {
    const map = getFieldsBySection();
    const appInfo = map.get('Application Info')!;
    const paths = appInfo.map((f) => f.path);
    expect(paths).toContain('applicationMetaData.inventionTitle');
    expect(paths).toContain('applicationMetaData.filingDate');
    expect(paths).toContain('applicationMetaData.patentNumber');
  });
});

describe('getFieldByPath', () => {
  it('finds a field by path', () => {
    const field = getFieldByPath('applicationMetaData.filingDate');
    expect(field).toBeDefined();
    expect(field!.label).toBe('Filing Date');
    expect(field!.type).toBe('date');
  });

  it('returns undefined for unknown path', () => {
    expect(getFieldByPath('nonexistent.field')).toBeUndefined();
  });
});

describe('searchFields', () => {
  it('finds fields matching label', () => {
    const results = searchFields('inventor');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((f) => f.label.toLowerCase().includes('inventor'))).toBe(true);
  });

  it('finds fields matching path', () => {
    const results = searchFields('filingDate');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty for no match', () => {
    const results = searchFields('xyznonexistent');
    expect(results.length).toBe(0);
  });
});

describe('getOperatorsForType', () => {
  it('returns string operators', () => {
    const ops = getOperatorsForType('string');
    expect(ops.map((o) => o.value)).toContain('equals');
    expect(ops.map((o) => o.value)).toContain('contains');
    expect(ops.map((o) => o.value)).toContain('fuzzy');
  });

  it('returns date operators', () => {
    const ops = getOperatorsForType('date');
    expect(ops.map((o) => o.value)).toContain('range');
    expect(ops.map((o) => o.value)).toContain('greaterThan');
    expect(ops.map((o) => o.value)).toContain('lessThan');
  });

  it('returns boolean operators', () => {
    const ops = getOperatorsForType('boolean');
    expect(ops.map((o) => o.value)).toContain('isTrue');
    expect(ops.map((o) => o.value)).toContain('isFalse');
    expect(ops.length).toBe(2);
  });

  it('returns number operators', () => {
    const ops = getOperatorsForType('number');
    expect(ops.map((o) => o.value)).toContain('equals');
    expect(ops.map((o) => o.value)).toContain('range');
  });
});

describe('getSectionOrder', () => {
  it('returns sections in schema order', () => {
    const sections = getSectionOrder();
    expect(sections.length).toBeGreaterThan(10);
    expect(sections[0]).toBe('Application Info');
  });
});
