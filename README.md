# ODP API Query Builder

A Chrome extension that helps you build structured Lucene queries for the [USPTO Open Data Portal (ODP)](https://developer.uspto.gov/api-catalog/open-data-portal) patent search API — without memorizing field paths or syntax.

## Features

- **Visual Query Builder** — Pick fields from a categorized dropdown, choose operators (equals, contains, range, fuzzy, etc.), and combine conditions with AND/OR/NOT logic. Supports nested groups.
- **AI Query Generation** — Describe what patents you're looking for in plain English and get a Lucene query back. Works with Anthropic (Claude) or OpenAI (GPT) — bring your own API key.
- **Raw Editor** — Write or paste Lucene queries directly. Syncs back to the visual builder.
- **Saved Queries** — Save and reload queries you use often. Stored locally in your browser.
- **Full ODP Field Coverage** — All ~100 searchable fields from the USPTO ODP API are available, organized by section (Application Info, Inventors, Assignments, CPC Classifications, Patent Term Adjustment, and more).

## Installation

### Option 1: Download a Release

1. Go to the [Releases](https://github.com/frankgman97/odp_api-query-builder/releases) page
2. Download the latest `.zip` file
3. Unzip it to a folder on your computer
4. Open Chrome and navigate to `chrome://extensions`
5. Enable **Developer mode** (toggle in the top-right corner)
6. Click **Load unpacked**
7. Select the unzipped folder
8. The extension icon will appear in your toolbar — click it to open the side panel

### Option 2: Build from Source

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/frankgman97/odp_api-query-builder.git
cd odp_api-query-builder
npm install
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `.output/chrome-mv3` folder from the project directory
5. Click the extension icon to open the side panel

## Usage

### Visual Builder

1. Click **+ Condition** to add a search condition
2. Select a field (e.g., "Invention Title", "Filing Date", "Assignee Name")
3. Choose an operator (equals, contains, starts with, date range, etc.)
4. Enter your value
5. Add more conditions and combine them with AND/OR/NOT
6. Use **+ Group** to create nested logic like `(A OR B) AND C`
7. The generated Lucene query appears in the preview at the bottom
8. Click **Copy** to copy it to your clipboard

### AI Tab

1. Open **Settings** (gear icon) and add your Anthropic or OpenAI API key
2. Switch to the **AI** tab
3. Describe what patents you want to find (e.g., "Find utility patents about machine learning filed after 2022")
4. Click **Generate** — the AI returns a ready-to-use Lucene query
5. Click **Use this query** to load it into the builder

### Raw Editor

Switch to the **Raw** tab to type or paste a Lucene query directly. The builder will attempt to parse it back into the visual tree when you switch tabs.

## Development

```bash
npm run dev          # Start dev server with hot reload (auto-opens Chrome)
npm run build        # Production build to .output/chrome-mv3
npm run zip          # Build + zip for distribution
npm run compile      # TypeScript type checking
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## Tech Stack

- [WXT](https://wxt.dev) — Browser extension framework
- React 19 + TypeScript
- Tailwind CSS v4 + DaisyUI
- Vitest for testing

## License

MIT
