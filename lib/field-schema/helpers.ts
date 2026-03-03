import type { FieldDefinition, FieldSection, FieldType } from './types';
import type { Operator } from '../query-engine/types';
import { FIELD_SCHEMA } from './schema';

/** Group all fields by their section */
export function getFieldsBySection(): Map<FieldSection, FieldDefinition[]> {
  const map = new Map<FieldSection, FieldDefinition[]>();
  for (const field of FIELD_SCHEMA) {
    const existing = map.get(field.section);
    if (existing) {
      existing.push(field);
    } else {
      map.set(field.section, [field]);
    }
  }
  return map;
}

/** Look up a single field by its dot-path */
export function getFieldByPath(path: string): FieldDefinition | undefined {
  return FIELD_SCHEMA.find((f) => f.path === path);
}

/** Search fields by matching label or path (case-insensitive) */
export function searchFields(query: string): FieldDefinition[] {
  const lower = query.toLowerCase();
  return FIELD_SCHEMA.filter(
    (f) =>
      f.label.toLowerCase().includes(lower) ||
      f.path.toLowerCase().includes(lower) ||
      (f.description && f.description.toLowerCase().includes(lower)),
  );
}

/** Get the valid operators for a given field type */
export function getOperatorsForType(type: FieldType): Operator[] {
  switch (type) {
    case 'string':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'contains', label: 'contains' },
        { value: 'startsWith', label: 'starts with' },
        { value: 'endsWith', label: 'ends with' },
        { value: 'wildcard', label: 'wildcard' },
        { value: 'fuzzy', label: 'fuzzy match' },
      ];
    case 'date':
      return [
        { value: 'equals', label: 'on' },
        { value: 'range', label: 'between' },
        { value: 'greaterThan', label: 'after' },
        { value: 'lessThan', label: 'before' },
      ];
    case 'number':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'range', label: 'between' },
        { value: 'greaterThan', label: 'greater than' },
        { value: 'lessThan', label: 'less than' },
      ];
    case 'boolean':
      return [
        { value: 'isTrue', label: 'is true' },
        { value: 'isFalse', label: 'is false' },
      ];
  }
}

/** Get a default operator for a given field type */
export function getDefaultOperator(type: FieldType): string {
  switch (type) {
    case 'string':
      return 'equals';
    case 'date':
      return 'equals';
    case 'number':
      return 'equals';
    case 'boolean':
      return 'isTrue';
  }
}

/** Get all unique sections in display order */
export function getSectionOrder(): FieldSection[] {
  const seen = new Set<FieldSection>();
  const order: FieldSection[] = [];
  for (const field of FIELD_SCHEMA) {
    if (!seen.has(field.section)) {
      seen.add(field.section);
      order.push(field.section);
    }
  }
  return order;
}
