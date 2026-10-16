import fs from 'node:fs';
import path from 'node:path';
import { ComprehensiveDenialGuide, ApprovedKnowledgeBase } from '../types';
import {
  ControlledCarcRecord,
  ControlledRarcRecord,
  ControlledGroupCodeRecord,
  ControlledAuthorityRecord,
  ValidationIssue,
  GuideValidationResult,
  DatasetValidationResult,
  FixtureTestResult
} from './types';
import { validateCodeIntegrity } from './rules/code-integrity';
import { validateRemarkRelationships } from './rules/remark-relationships';
import { validateScopeSensitivity } from './rules/scope-sensitive';
import { validateProvenanceAndCurrency } from './rules/provenance-currency';
import { validatePublicIntegrity } from './rules/public-integrity';

export class KnowledgeQualityValidator {
  private controlledCarcs: Map<string, ControlledCarcRecord> = new Map();
  private controlledRarcs: Map<string, ControlledRarcRecord> = new Map();
  private controlledGroupCodes: Map<string, ControlledGroupCodeRecord> = new Map();
  private controlledAuthorities: Map<string, ControlledAuthorityRecord> = new Map();

  constructor(registryDir?: string) {
    const baseDir = registryDir || path.join(__dirname, 'registry');
    this.loadRegistries(baseDir);
  }

  private loadRegistries(registryDir: string): void {
    const carcsPath = path.join(registryDir, 'controlled_carcs.json');
    const rarcsPath = path.join(registryDir, 'controlled_rarcs.json');
    const groupCodesPath = path.join(registryDir, 'controlled_group_codes.json');
    const authoritiesPath = path.join(registryDir, 'controlled_authorities.json');

    if (fs.existsSync(carcsPath)) {
      const list: ControlledCarcRecord[] = JSON.parse(fs.readFileSync(carcsPath, 'utf8'));
      list.forEach(c => this.controlledCarcs.set(c.code, c));
    }

    if (fs.existsSync(rarcsPath)) {
      const list: ControlledRarcRecord[] = JSON.parse(fs.readFileSync(rarcsPath, 'utf8'));
      list.forEach(r => this.controlledRarcs.set(r.code, r));
    }

    if (fs.existsSync(groupCodesPath)) {
      const list: ControlledGroupCodeRecord[] = JSON.parse(fs.readFileSync(groupCodesPath, 'utf8'));
      list.forEach(g => this.controlledGroupCodes.set(g.code, g));
    }

    if (fs.existsSync(authoritiesPath)) {
      const list: ControlledAuthorityRecord[] = JSON.parse(fs.readFileSync(authoritiesPath, 'utf8'));
      list.forEach(a => this.controlledAuthorities.set(a.id, a));
    }
  }

  public getCarcRegistry(): Map<string, ControlledCarcRecord> {
    return this.controlledCarcs;
  }

  public getRarcRegistry(): Map<string, ControlledRarcRecord> {
    return this.controlledRarcs;
  }

  public validateGuide(guide: ComprehensiveDenialGuide): GuideValidationResult {
    const issues: ValidationIssue[] = [];

    // 1. Code integrity
    issues.push(...validateCodeIntegrity(guide, this.controlledCarcs, this.controlledRarcs));

    // 2. Remark-code relationships
    issues.push(...validateRemarkRelationships(guide, this.controlledRarcs));

    // 3. Scope sensitivity
    issues.push(...validateScopeSensitivity(guide));

    // 4. Provenance and currency
    issues.push(...validateProvenanceAndCurrency(guide));

    const fatalCount = issues.filter(i => i.severity === 'FATAL').length;
    const warningCount = issues.filter(i => i.severity === 'WARNING').length;

    return {
      guide_id: guide.guide_id,
      title: guide.guide_title,
      carc: guide.code_explanation.carc_code,
      status: fatalCount > 0 ? 'BLOCKED' : 'PASSED',
      fatal_count: fatalCount,
      warning_count: warningCount,
      issues
    };
  }

  public validateDataset(datasetPath: string, guidesDir: string): DatasetValidationResult {
    const rawDataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    const allIssues: ValidationIssue[] = [];
    const guideResults: GuideValidationResult[] = [];

    const checkedCarcs = new Set<string>();
    const checkedRarcs = new Set<string>();

    // 1. Check dataset CARCs against controlled registry
    for (const c of rawDataset.carcs || []) {
      checkedCarcs.add(c.code);
      const controlled = this.controlledCarcs.get(c.code);
      if (!controlled) {
        allIssues.push({
          rule: 'code-integrity',
          code: 'CODE_NOT_FOUND',
          severity: 'FATAL',
          message: `Dataset CARC ${c.code} is not in the controlled registry.`,
          location: `carcs[${c.code}]`
        });
      }
    }

    // 2. Check dataset RARCs against controlled registry
    for (const r of rawDataset.rarcs || []) {
      checkedRarcs.add(r.code);
      const controlled = this.controlledRarcs.get(r.code);
      if (!controlled) {
        allIssues.push({
          rule: 'code-integrity',
          code: 'CODE_NOT_FOUND',
          severity: 'FATAL',
          message: `Dataset RARC ${r.code} is not in the controlled registry.`,
          location: `rarcs[${r.code}]`
        });
      }
    }

    // 3. Check denial fingerprints (CARC & RARC references)
    for (const df of rawDataset.denial_fingerprints || []) {
      if (df.carc) {
        const parts = df.carc.split('/').map((p: string) => p.trim());
        parts.forEach((c: string) => {
          checkedCarcs.add(c);
          if (!this.controlledCarcs.has(c)) {
            allIssues.push({
              rule: 'code-integrity',
              code: 'CODE_NOT_FOUND',
              severity: 'FATAL',
              message: `Denial fingerprint [${df.record_id}] references unknown CARC "${c}".`,
              location: `denial_fingerprints[${df.record_id}].carc`
            });
          }
        });
      }
      if (df.rarc) {
        checkedRarcs.add(df.rarc);
        if (!this.controlledRarcs.has(df.rarc)) {
          allIssues.push({
            rule: 'code-integrity',
            code: 'CODE_NOT_FOUND',
            severity: 'FATAL',
            message: `Denial fingerprint [${df.record_id}] references unknown RARC "${df.rarc}".`,
            location: `denial_fingerprints[${df.record_id}].rarc`
          });
        }
      }
    }

    // 4. Check search synonyms (CARC & RARC references)
    for (const [idx, s] of (rawDataset.search_synonyms || []).entries()) {
      if (s.CARC) {
        checkedCarcs.add(s.CARC);
        if (!this.controlledCarcs.has(s.CARC)) {
          allIssues.push({
            rule: 'code-integrity',
            code: 'CODE_NOT_FOUND',
            severity: 'FATAL',
            message: `Search synonym [${idx}] (${s['Canonical Search Concept']}) references unknown CARC "${s.CARC}".`,
            location: `search_synonyms[${idx}].CARC`
          });
        }
      }
      if (s.RARC) {
        checkedRarcs.add(s.RARC);
        if (!this.controlledRarcs.has(s.RARC)) {
          allIssues.push({
            rule: 'code-integrity',
            code: 'CODE_NOT_FOUND',
            severity: 'FATAL',
            message: `Search synonym [${idx}] (${s['Canonical Search Concept']}) references unknown RARC "${s.RARC}".`,
            location: `search_synonyms[${idx}].RARC`
          });
        }
      }
    }

    // 5. Check guides in guidesDir
    let totalGuides = 0;
    const guideFiles = fs.readdirSync(guidesDir).filter(f => f.endsWith('.json'));
    const rarcRegex = /\b(MA[0-9]+|[MN][0-9]+)\b/g;

    for (const f of guideFiles) {
      totalGuides++;
      const fullPath = path.join(guidesDir, f);
      const guideData: ComprehensiveDenialGuide = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const res = this.validateGuide(guideData);
      guideResults.push(res);
      allIssues.push(...res.issues);

      if (guideData.code_explanation && guideData.code_explanation.carc_code) {
        checkedCarcs.add(guideData.code_explanation.carc_code);
      }
      let m;
      const str = JSON.stringify(guideData);
      while ((m = rarcRegex.exec(str)) !== null) {
        checkedRarcs.add(m[1].toUpperCase());
      }
    }

    // 6. Public integrity checks
    const publicIssues = validatePublicIntegrity(datasetPath, guidesDir);
    allIssues.push(...publicIssues);

    const fatalCount = allIssues.filter(i => i.severity === 'FATAL').length;
    const warningCount = allIssues.filter(i => i.severity === 'WARNING').length;

    return {
      status: fatalCount > 0 ? 'BLOCKED' : 'PASSED',
      total_carcs_checked: checkedCarcs.size,
      total_rarcs_checked: checkedRarcs.size,
      registry_carcs_count: this.controlledCarcs.size,
      registry_rarcs_count: this.controlledRarcs.size,
      total_fingerprints_checked: (rawDataset.denial_fingerprints || []).length,
      total_guides_checked: totalGuides,
      fatal_count: fatalCount,
      warning_count: warningCount,
      issues: allIssues,
      guide_results: guideResults
    };
  }

  public testFixture(
    fixturePath: string,
    expectedOutcome: 'SHOULD_FAIL' | 'SHOULD_PASS',
    expectedErrorCode?: string
  ): FixtureTestResult {
    const fixtureData: ComprehensiveDenialGuide = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const res = this.validateGuide(fixtureData);
    const fixtureName = path.basename(fixturePath);

    const actualOutcome: 'FAILED' | 'PASSED' = res.status === 'BLOCKED' ? 'FAILED' : 'PASSED';
    let testPassed = false;
    let notes = '';

    if (expectedOutcome === 'SHOULD_FAIL') {
      if (actualOutcome === 'FAILED') {
        if (expectedErrorCode) {
          const matched = res.issues.some(i => i.code === expectedErrorCode);
          testPassed = matched;
          notes = matched
            ? `Successfully blocked with expected error code [${expectedErrorCode}].`
            : `Blocked, but expected code [${expectedErrorCode}] was not among detected issues: ${res.issues.map(i => i.code).join(', ')}`;
        } else {
          testPassed = true;
          notes = `Successfully blocked with ${res.fatal_count} fatal issue(s).`;
        }
      } else {
        testPassed = false;
        notes = `FAILED: Fixture was expected to fail, but validator passed it with 0 fatal issues.`;
      }
    } else {
      if (actualOutcome === 'PASSED') {
        testPassed = true;
        notes = `Successfully passed with 0 fatal issues.`;
      } else {
        testPassed = false;
        notes = `FAILED: Valid fixture was blocked with ${res.fatal_count} fatal issue(s): ${res.issues.map(i => i.message).join('; ')}`;
      }
    }

    return {
      fixture_name: fixtureName,
      expected_outcome: expectedOutcome,
      expected_error_code: expectedErrorCode,
      actual_outcome: actualOutcome,
      detected_issues: res.issues,
      test_passed: testPassed,
      notes
    };
  }
}
