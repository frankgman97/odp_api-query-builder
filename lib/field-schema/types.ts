export type FieldType = 'string' | 'date' | 'number' | 'boolean';

export type FieldSection =
  | 'Application Info'
  | 'Entity Status'
  | 'CPC Classifications'
  | 'Publications'
  | 'Correspondence'
  | 'Applicants'
  | 'Inventors'
  | 'Assignments'
  | 'Assignors'
  | 'Assignees'
  | 'Assignment Correspondence'
  | 'Domestic Representative'
  | 'Attorney / Agent'
  | 'Foreign Priority'
  | 'Parent Continuity'
  | 'Child Continuity'
  | 'Patent Term Adjustment'
  | 'PTA History'
  | 'Prosecution Events'
  | 'Pre-Grant Publication'
  | 'Grant Document';

export interface FieldDefinition {
  /** Dot-path used in Lucene queries, e.g. "applicationMetaData.filingDate" */
  path: string;
  /** Human-readable label, e.g. "Filing Date" */
  label: string;
  /** Data type — determines available operators and value input */
  type: FieldType;
  /** Section grouping for the categorized dropdown */
  section: FieldSection;
  /** Longer description for tooltips */
  description?: string;
  /** Example value shown as placeholder */
  example?: string;
  /** Known enum values for string fields (shown as select options) */
  enumValues?: string[];
}
