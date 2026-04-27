import type { LLMSettings } from './storage';
import { FIELD_SCHEMA } from './field-schema/schema';

function buildSystemPrompt(): string {
  const fieldSummary = FIELD_SCHEMA.map((f) => {
    let line = `- ${f.path} (${f.type}) — ${f.label}`;
    if (f.enumValues) line += ` [values: ${f.enumValues.join(', ')}]`;
    if (f.example) line += ` e.g. ${f.example}`;
    return line;
  }).join('\n');

  return `You are a USPTO Open Data Portal (ODP) Lucene query generator.

The user will describe what patents they want to find in plain English. You MUST respond with ONLY the raw Lucene query string — no explanation, no markdown, no code fences, no extra text.

LUCENE SYNTAX RULES:
- Field queries: fieldPath:value
- Quoted phrases: fieldPath:"multi word value"
- Wildcards: fieldPath:*partial* or fieldPath:prefix*
- Fuzzy: fieldPath:value~
- Ranges (inclusive): fieldPath:[2020-01-01 TO 2023-12-31]
- Ranges (exclusive): fieldPath:{100 TO 200}
- Boolean: AND, OR, NOT
- Grouping: (condition1 AND condition2) OR condition3
- Dates use YYYY-MM-DD format

AVAILABLE FIELDS:
${fieldSummary}

RULES:
1. Output ONLY the Lucene query string. Nothing else.
2. Use the exact field paths listed above.
3. Use AND/OR/NOT for boolean logic.
4. For date ranges, use the [X TO Y] syntax.
5. Use wildcards (*) for partial text matching.
6. If the user's request is ambiguous, make reasonable assumptions using the most common fields.`;
}

export interface LLMResponse {
  query: string;
  error?: undefined;
}

export interface LLMError {
  query?: undefined;
  error: string;
}

export async function generateQueryWithLLM(
  userPrompt: string,
  settings: LLMSettings,
): Promise<LLMResponse | LLMError> {
  if (!settings.apiKey) {
    return { error: 'No API key configured. Open Settings to add your API key.' };
  }

  if (!userPrompt.trim()) {
    return { error: 'Please enter a description of what patents you want to find.' };
  }

  const systemPrompt = buildSystemPrompt();

  try {
    if (settings.provider === 'anthropic') {
      return await callAnthropic(systemPrompt, userPrompt, settings);
    } else {
      return await callOpenAI(systemPrompt, userPrompt, settings);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: `API call failed: ${message}` };
  }
}

async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  settings: LLMSettings,
): Promise<LLMResponse | LLMError> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.model || 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    if (resp.status === 401) return { error: 'Invalid API key. Check your Anthropic API key in Settings.' };
    if (resp.status === 429) return { error: 'Rate limited. Please wait a moment and try again.' };
    return { error: `Anthropic API error ${resp.status}: ${body.slice(0, 200)}` };
  }

  const data = await resp.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return { error: 'Empty response from API.' };

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
  return { query: cleaned };
}

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  settings: LLMSettings,
): Promise<LLMResponse | LLMError> {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    if (resp.status === 401) return { error: 'Invalid API key. Check your OpenAI API key in Settings.' };
    if (resp.status === 429) return { error: 'Rate limited. Please wait a moment and try again.' };
    return { error: `OpenAI API error ${resp.status}: ${body.slice(0, 200)}` };
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) return { error: 'Empty response from API.' };

  const cleaned = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
  return { query: cleaned };
}
