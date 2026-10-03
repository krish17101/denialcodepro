import type { SearchResult, SearchResultKind } from './types';
import {
  knowledgeBase,
  carcsBySlug,
  rarcsBySlug,
  fingerprintsBySlug,
  payersBySlug,
  getCarcSlug,
  getRarcSlug,
  getDenialSlug,
  getPayerSlug,
  payerFingerprintsBySlug,
} from './knowledge/data';
import { ApprovedCarc, ApprovedRarc, ApprovedDenialFingerprint, ApprovedPayerIntelligence, ApprovedSource, ApprovedPayerFingerprint } from './knowledge/types';

export interface SearchQuery {
  raw: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  indexEmpty: boolean;
  noMatch: boolean;
}

// Convert Phase 2 Approved structures to Phase 1 SearchResult
function mapCarcToResult(carc: ApprovedCarc): SearchResult {
  return {
    kind: 'carc',
    slug: getCarcSlug(carc.code),
    title: `CARC ${carc.code}`,
    summary: carc.meaning,
    href: `/denial-codes/${getCarcSlug(carc.code)}`,
  };
}

function mapRarcToResult(rarc: ApprovedRarc): SearchResult {
  return {
    kind: 'rarc',
    slug: getRarcSlug(rarc.code),
    title: `RARC ${rarc.code}`,
    summary: rarc.meaning,
    href: `/remark-codes/${getRarcSlug(rarc.code)}`,
  };
}

function mapDenialToResult(df: ApprovedDenialFingerprint): SearchResult {
  const codePair = df.group_code ? `${df.group_code}-${df.carc} ${df.rarc}` : `CARC ${df.carc} RARC ${df.rarc}`;
  return {
    kind: 'denial',
    slug: getDenialSlug(df),
    title: `Denial Guide: ${codePair}`,
    summary: df.practical_diagnosis || df.code_meaning,
    href: `/denial/${getDenialSlug(df)}`,
  };
}

function mapPayerToResult(payer: ApprovedPayerIntelligence): SearchResult {
  return {
    kind: 'payer',
    slug: getPayerSlug(payer.Payer),
    title: `Payer: ${payer.Payer}`,
    summary: payer['Important Operational Rule'] || payer['Market/Scope'],
    href: `/payers/${getPayerSlug(payer.Payer)}`,
  };
}

function mapPayerFingerprintToResult(pf: ApprovedPayerFingerprint): SearchResult {
  return {
    kind: 'payer_fingerprint',
    slug: pf.record_id.toLowerCase(),
    title: `Payer Guide: ${pf.payer || pf.record_id}`,
    summary: pf.practical_diagnosis,
    href: `/payer-guides/${pf.record_id.toLowerCase()}`,
  };
}

export function search(query: SearchQuery): SearchResponse {
  const q = query.raw.trim().toLowerCase();

  if (!q) {
    return { query: query.raw, results: [], indexEmpty: false, noMatch: false };
  }

  // Pre-process query: strip punctuation for easier exact matching
  const normalizedQuery = q.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const tokens = q.split(/[\s,;-]+/).filter(Boolean);
  
  const rankedResults = new Map<string, SearchResult & { score: number }>();

  const addResult = (res: SearchResult, score: number) => {
    const existing = rankedResults.get(res.href);
    if (!existing || score > existing.score) {
      rankedResults.set(res.href, { ...res, score });
    }
  };

  // 1. Exact controlled denial fingerprint (e.g. "co-16 n382")
  knowledgeBase.denial_fingerprints?.forEach((df) => {
    if (!df.publication.searchable) return;
    const dfSlug = getDenialSlug(df);
    const searchForms = [
      dfSlug,
      `${df.carc}-${df.rarc}`.toLowerCase(),
      `${df.group_code}-${df.carc} ${df.rarc}`.toLowerCase(),
      `carc ${df.carc} rarc ${df.rarc}`.toLowerCase()
    ];
    
    if (searchForms.some(f => f === q || f === normalizedQuery)) {
      addResult(mapDenialToResult(df), 1000);
    }
  });

  // 3. Exact CARC
  tokens.forEach(token => {
    let carcStr = token;
    if (carcStr.startsWith('co-') || carcStr.startsWith('pr-') || carcStr.startsWith('oa-') || carcStr.startsWith('pi-') || carcStr.startsWith('cr-')) {
      carcStr = carcStr.substring(3);
    }
    const carc = carcsBySlug.get(carcStr);
    if (carc && carc.publication.searchable) {
      addResult(mapCarcToResult(carc), 800);
    }
  });

  // 4. Exact RARC
  tokens.forEach(token => {
    let rarcStr = token;
    if (rarcStr.startsWith('rarc-')) rarcStr = rarcStr.substring(5);
    const rarc = rarcsBySlug.get(rarcStr);
    if (rarc && rarc.publication.searchable) {
      addResult(mapRarcToResult(rarc), 700);
    }
  });

  // 5. Payer match
  knowledgeBase.payer_intelligence?.forEach(payer => {
    if (q.includes(payer.Payer.toLowerCase()) || payer.Payer.toLowerCase().includes(q)) {
      addResult(mapPayerToResult(payer), 500);
    }
  });

  const searchTerms = [q];

  // 5.5 Normalizations handling
  const normalizations = knowledgeBase.search_normalization || [];
  normalizations.forEach(norm => {
    const pattern = (norm['Input Pattern'] || '').toLowerCase();
    const target = (norm['Normalize To'] || '').toLowerCase();
    if (q.includes(pattern) || pattern === q) {
      const rules = target.split(';').map(s => s.trim());
      let normCarc: string | null = null;
      let normRarc: string | null = null;

      rules.forEach(rule => {
        if (rule.startsWith('concept=')) {
          const concept = rule.split('=')[1];
          // Do not push broad concepts like 'authorization' to global keyword search to prevent dilution
          if (concept === 'timely filing') {
            const carc29 = carcsBySlug.get('29');
            if (carc29) addResult(mapCarcToResult(carc29), 600);
            const df037 = fingerprintsBySlug.get('co-29');
            if (df037) addResult(mapDenialToResult(df037), 600);
          }
          if (concept === 'authorization') {
            const carc197 = carcsBySlug.get('197');
            if (carc197) addResult(mapCarcToResult(carc197), 600);
            const df042 = fingerprintsBySlug.get('co-197-n210');
            if (df042) addResult(mapDenialToResult(df042), 600);
          }
        }
        if (rule.startsWith('carc=')) {
          normCarc = rule.split('=')[1];
        }
        if (rule.startsWith('rarc=')) {
          normRarc = rule.split('=')[1];
        }
      });

      if (normCarc) {
        const c = carcsBySlug.get(normCarc);
        if (c) addResult(mapCarcToResult(c), 600);
      }
      if (normRarc) {
        const r = rarcsBySlug.get(normRarc);
        if (r) addResult(mapRarcToResult(r), 600);
      }
    }
  });

  // 6. Controlled synonym / broader keyword match
  // Synonyms handling
  const synonyms = knowledgeBase.search_synonyms || [];
  synonyms.forEach(syn => {
    const concept = (syn['Canonical Search Concept'] || '').toLowerCase();
    const examples = (syn['Example User Queries'] || '').toLowerCase();
    if (concept.includes(q) || examples.includes(q) || q.includes(concept)) {
      searchTerms.push(concept);
      if (syn.RARC) {
        const rarc = rarcsBySlug.get(syn.RARC.toLowerCase());
        if (rarc && rarc.publication.searchable) {
          addResult(mapRarcToResult(rarc), 400);
        }
      }
    }
  });

  // Search through all searchable entities for keyword matches
  const keywordSearch = (text: string) => {
    if (!text) return false;
    const t = text.toLowerCase();
    return searchTerms.some(term => t.includes(term));
  };

  knowledgeBase.denial_fingerprints?.forEach((df) => {
    if (!df.publication.searchable) return;
    if (keywordSearch(df.code_meaning) || keywordSearch(df.likely_root_causes) || keywordSearch(df.practical_diagnosis)) {
      addResult(mapDenialToResult(df), 100);
    }
  });

  knowledgeBase.carcs?.forEach((carc) => {
    if (!carc.publication.searchable || carc.code === '15') return;
    if (keywordSearch(carc.meaning)) {
      addResult(mapCarcToResult(carc), 100);
    }
  });

  knowledgeBase.rarcs?.forEach((rarc) => {
    if (!rarc.publication.searchable) return;
    if (keywordSearch(rarc.meaning) || rarc.synonyms?.some(s => keywordSearch(s))) {
      addResult(mapRarcToResult(rarc), 100);
    }
  });

  knowledgeBase.payer_fingerprints?.forEach((pf) => {
    if (!pf.publication.searchable) return;
    if (keywordSearch(pf.practical_diagnosis) || keywordSearch(pf.action_type) || keywordSearch(pf.source)) {
      addResult(mapPayerFingerprintToResult(pf), 100);
    }
  });

  const finalResults = Array.from(rankedResults.values())
    .sort((a, b) => b.score - a.score)
    .map(r => {
      const { score, ...rest } = r;
      return rest as SearchResult;
    });

  return {
    query: query.raw,
    results: finalResults,
    indexEmpty: false,
    noMatch: finalResults.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Resolvers
// ---------------------------------------------------------------------------

export function getDenialWorkflowBySlug(slug: string): ApprovedDenialFingerprint | null {
  return fingerprintsBySlug.get(slug.toLowerCase()) || null;
}

export function getCarcBySlug(slug: string): ApprovedCarc | null {
  return carcsBySlug.get(slug.toLowerCase()) || null;
}

export function getRarcBySlug(slug: string): ApprovedRarc | null {
  return rarcsBySlug.get(slug.toLowerCase()) || null;
}

export function getPayerBySlug(slug: string): ApprovedPayerIntelligence | null {
  return payersBySlug.get(slug.toLowerCase()) || null;
}

export function getPayerFingerprintBySlug(slug: string): ApprovedPayerFingerprint | null {
  return payerFingerprintsBySlug.get(slug.toLowerCase()) || null;
}

export function getGuideBySlug(_slug: string): null {
  return null;
}

export function getSources(): ApprovedSource[] {
  return knowledgeBase.authoritative_sources || [];
}
