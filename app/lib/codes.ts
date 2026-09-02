export type ClaimCode = {
  id: string;
  group: string;
  type: string;
  problem: string;
  solution: string;
};

export const codes: ClaimCode[] = require('../data/full_codes.json');

export function getCodeById(id: string): ClaimCode | undefined {
  return codes.find((c) => c.id === id);
}

export function getRelatedCodes(id: string, limit = 4): ClaimCode[] {
  const current = getCodeById(id);
  if (!current) return [];
  const sameGroup = codes.filter(
    (c) => c.id !== id && c.group === current.group
  );
  if (sameGroup.length >= limit) return sameGroup.slice(0, limit);
  const others = codes.filter(
    (c) => c.id !== id && c.group !== current.group
  );
  return [...sameGroup, ...others].slice(0, limit);
}
