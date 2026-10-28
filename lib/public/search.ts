import { publicGuides } from './guides';

export const suggestedTopics = ['Claim rejection', 'Corrected claim', 'Appeal deadline'];
const keywords: Record<string, string> = {
  'find-the-claim-response': 'rejection rejected clearinghouse acknowledgement acknowledgment era eob remittance response transmission',
  'choose-a-correction-or-review': 'correction corrected resubmit resubmission replacement reconsideration appeal dispute review coding error',
  'build-a-deadline-evidence-record': 'deadline deadlines timely filing late appeal receipt received date days notice time limit',
};
const stopWords = new Set(['a', 'an', 'the', 'my', 'is', 'was', 'has', 'have', 'to', 'for', 'of', 'and', 'or', 'how', 'do', 'i', 'with', 'what', 'claim', 'claims']);
export function normalizeQuery(query: string) { return query.trim().slice(0, 180); }
export function isCodeQuery(query: string) {
  return /^(?:(?:carc|rarc|co|pr|oa|pi)\s*[-:]?\s*)?(?:\d+|[nm]\d+)$/i.test(query.trim());
}
export function searchGuides(query: string) {
  const q = normalizeQuery(query).toLowerCase();
  if (!q || isCodeQuery(q)) return [];
  const terms = Array.from(new Set(q.split(/[^a-z0-9]+/).filter(t => t.length > 1 && !stopWords.has(t))));
  if (!terms.length) return [];
  return publicGuides.map(guide => {
    const title = guide.title.toLowerCase();
    const tags = keywords[guide.slug] || '';
    const body = [guide.summary, guide.firstCheck, ...guide.sections.flatMap(s => [s.title, ...s.paragraphs])].join(' ').toLowerCase();
    const score = terms.reduce((sum, t) => sum + (title.includes(t) ? 5 : tags.includes(t) ? 4 : body.includes(t) ? 1 : 0), 0);
    return { guide, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).map(r => r.guide);
}
