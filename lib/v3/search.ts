/**
 * V3 search layer — Phase 1 foundation.
 *
 * This module is the ONLY place search queries should be resolved.
 * It defines a clean interface so that:
 *   1. The homepage and /search page can call one function.
 *   2. The index can be swapped (static JSON → database → vector search)
 *      without touching page components.
 *
 * Phase 1 state: no approved production knowledge-base data is loaded.
 * All searches return an empty result set.  The UI must display
 * honest empty/no-match behavior — never fabricated results.
 *
 * Phase 2+ will replace `INDEX` with real approved data.
 */

import type { SearchResult } from './types';

// ---------------------------------------------------------------------------
// Index — currently empty; will be populated in a later phase
// ---------------------------------------------------------------------------

/**
 * The live search index.
 * Replace this with an imported approved dataset when it becomes available.
 */
const INDEX: SearchResult[] = [];

// ---------------------------------------------------------------------------
// Public search API
// ---------------------------------------------------------------------------

export interface SearchQuery {
  /** Raw text entered by the user */
  raw: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  /** True when the index contains no entries at all (pre-data state) */
  indexEmpty: boolean;
  /** True when a non-empty query produced zero matches */
  noMatch: boolean;
}

/**
 * Perform a search against the V3 index.
 *
 * Phase 1: always returns an empty result set because no approved data
 * has been loaded.  The calling page should surface an honest message
 * explaining that content is being built.
 */
export function search(query: SearchQuery): SearchResponse {
  const q = query.raw.trim().toLowerCase();

  if (INDEX.length === 0) {
    return {
      query: query.raw,
      results: [],
      indexEmpty: true,
      noMatch: false,
    };
  }

  if (!q) {
    return {
      query: query.raw,
      results: [],
      indexEmpty: false,
      noMatch: false,
    };
  }

  const results = INDEX.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q)
  );

  return {
    query: query.raw,
    results,
    indexEmpty: false,
    noMatch: results.length === 0,
  };
}

/**
 * Resolve a denial workflow by its slug.
 * Phase 1: returns null (no data loaded).
 */
export function getDenialWorkflowBySlug(_slug: string): null {
  return null;
}

/**
 * Resolve a CARC entry by its slug (e.g. "co-16").
 * Phase 1: returns null (no data loaded).
 */
export function getCarcBySlug(_slug: string): null {
  return null;
}

/**
 * Resolve a RARC entry by its slug (e.g. "n382").
 * Phase 1: returns null (no data loaded).
 */
export function getRarcBySlug(_slug: string): null {
  return null;
}

/**
 * Resolve a payer by its slug.
 * Phase 1: returns null (no data loaded).
 */
export function getPayerBySlug(_slug: string): null {
  return null;
}

/**
 * Resolve a guide by its slug.
 * Phase 1: returns null (no data loaded).
 */
export function getGuideBySlug(_slug: string): null {
  return null;
}
