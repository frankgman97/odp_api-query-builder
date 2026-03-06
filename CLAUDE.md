# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ipOS - ODP** is a Chrome extension (side panel) that builds structured Lucene queries for the USPTO Open Data Portal (ODP) patent search API. Built with WXT + React + TypeScript + Tailwind CSS v4 + DaisyUI.

The extension has four tabs: **Builder** (visual query builder), **AI** (natural language to Lucene via LLM), **Raw** (direct text editing), and **Saved** (persisted queries).

## Commands

```bash
npm run dev          # Start WXT dev server (hot reload, loads extension in Chrome)
npm run build        # Production build
npm run zip          # Build + zip for distribution
npm run compile      # TypeScript type checking (tsc --noEmit)
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
```

## Architecture

### Entrypoints (WXT convention)
- `entrypoints/background.ts` — Service worker; opens side panel on icon click
- `entrypoints/sidepanel/` — The React app (main.tsx, App.tsx, index.html, style.css)

### Core query engine (`lib/query-engine/`)
- `types.ts` — AST types: `QueryAST` (root `ConditionGroup`), `Condition`, `ConditionGroup`, operators
- `generator.ts` — `generateLuceneQuery(ast)`: serializes AST → Lucene query string
- `parser.ts` — `parseLuceneQuery(query)`: tokenizes + parses Lucene string → AST (best-effort)
- `validator.ts` — `validateQuery(ast)`: validates conditions against the field schema

The AST is a tree of `ConditionGroup` nodes (with `booleanOperator`: AND/OR/NOT) containing `Condition` leaves (with `fieldPath`, `operator`, `value`). Every node has `kind: 'group' | 'condition'` for discrimination.

### Field schema (`lib/field-schema/`)
- `schema.ts` — `FIELD_SCHEMA`: complete array of ~100 `FieldDefinition` entries mapping every USPTO ODP API field (path, label, type, section, enum values, examples)
- `helpers.ts` — Lookup/search utilities: `getFieldByPath()`, `searchFields()`, `getFieldsBySection()`, `getOperatorsForType()`
- `types.ts` — `FieldDefinition`, `FieldType` (string/date/number/boolean), `FieldSection`

### State management (`hooks/`)
- `useQueryState.ts` — React context + `useReducer` for the query AST. All mutations (ADD_CONDITION, UPDATE_CONDITION, SET_RAW_QUERY, SYNC_FROM_RAW, LOAD_AST, CLEAR, etc.) go through the reducer. Visual changes auto-regenerate `rawQuery` via the generator.
- `useSavedQueries.ts` — CRUD for saved queries via `lib/storage.ts`

### Storage (`lib/storage.ts`)
Uses `browser.storage.local` in extension context, falls back to `localStorage` for dev. Stores saved queries and LLM settings.

### LLM integration (`lib/llm.ts`)
Calls Anthropic or OpenAI APIs directly from the browser (no backend). Sends the full field schema as context in the system prompt. The API key is stored locally and configured in Settings.

### Components
- `QueryBuilder/` — Visual builder: `ConditionGroup` → `ConditionRow` → `FieldSelector` + `OperatorSelector` + `ValueInput`
- `RawEditor/` — Direct Lucene text editing with sync-to-AST
- `AiQueryBuilder` — Natural language prompt → LLM → Lucene query
- `QueryPreview` — Shows the generated query string
- `ActionBar` — Copy, Save, Open ODP, Clear actions
- `Settings` — LLM provider/model/API key configuration
- `SavedQueries` — List of saved queries with load/delete

## Key Patterns

- **Styling**: Tailwind CSS v4 with DaisyUI plugin (configured via CSS `@plugin` directive in style.css, not tailwind.config). Light/dark theme via `data-theme` on `<html>`.
- **WXT auto-imports**: `browser` and `defineBackground` are auto-imported by WXT (no explicit imports needed).
- **Tests**: Vitest. Test files live next to their source in `__tests__/` directories.
- **API reference**: `docs/api-reference.md` documents the full USPTO ODP API fields and Lucene query syntax.
