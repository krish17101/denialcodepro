/**
 * Rule: public-integrity
 * Verifies public dataset synchronization (deep equality with guide files on disk),
 * checks that internal QA fields do not leak into public outputs,
 * and ensures anchor / section ID uniqueness.
 */

const fs = require('fs');
const path = require('path');

function validatePublicIntegrity(datasetPath, guidesDir) {
  const issues = [];

  if (!fs.existsSync(datasetPath)) {
    issues.push({
      rule: 'public-integrity',
      code: 'DATASET_MISSING',
      severity: 'FATAL',
      message: `Public dataset file not found at: ${datasetPath}`,
      location: datasetPath
    });
    return issues;
  }

  const rawDataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const denialFingerprints = rawDataset.denial_fingerprints || [];

  // =========================================================================
  // 1. Internal QA Leak Checks
  // =========================================================================
  const forbiddenKeys = ['update_trigger', 'internal_qa', 'draft_notes', 'research_state', 'private_notes'];

  for (const df of denialFingerprints) {
    for (const key of forbiddenKeys) {
      if (df[key] !== undefined) {
        issues.push({
          rule: 'public-integrity',
          code: 'INTERNAL_QA_LEAK',
          severity: 'FATAL',
          message: `Internal QA field "${key}" leaked into public denial fingerprint [${df.record_id}].`,
          location: `denial_fingerprints[${df.record_id}].${key}`,
          context: { recordId: df.record_id, key }
        });
      }
    }
  }

  // =========================================================================
  // 2. Guide Synchronization & Deep Equality Checks
  // =========================================================================
  const guideFiles = fs.readdirSync(guidesDir).filter(f => f.endsWith('.json'));
  const guideMap = new Map();

  for (const f of guideFiles) {
    const fullPath = path.join(guidesDir, f);
    try {
      const guideData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      guideMap.set(guideData.guide_id, guideData);
    } catch (e) {
      issues.push({
        rule: 'public-integrity',
        code: 'GUIDE_SYNTAX_ERROR',
        severity: 'FATAL',
        message: `Failed to parse guide JSON at ${f}: ${e.message}`,
        location: f
      });
    }
  }

  for (const df of denialFingerprints) {
    if (df.structured_guide) {
      const compiledGuide = df.structured_guide;
      const diskGuide = guideMap.get(compiledGuide.guide_id);

      if (!diskGuide) {
        issues.push({
          rule: 'public-integrity',
          code: 'GUIDE_FILE_MISSING',
          severity: 'FATAL',
          message: `Structured guide "${compiledGuide.guide_id}" attached to [${df.record_id}] does not exist on disk in ${guidesDir}.`,
          location: `denial_fingerprints[${df.record_id}].structured_guide`
        });
        continue;
      }

      // Deep equality check
      const diskStr = JSON.stringify(diskGuide);
      const compiledStr = JSON.stringify(compiledGuide);

      if (diskStr !== compiledStr) {
        issues.push({
          rule: 'public-integrity',
          code: 'DATASET_DESYNC',
          severity: 'FATAL',
          message: `Public dataset record [${df.record_id}] structured_guide is out of sync with disk file for ${compiledGuide.guide_id}. Run compile-dataset.js to synchronize.`,
          location: `denial_fingerprints[${df.record_id}].structured_guide`,
          context: { recordId: df.record_id, guideId: compiledGuide.guide_id }
        });
      }

      // Check search publication policy: workflow_available must be true
      if (!df.publication.workflow_available) {
        issues.push({
          rule: 'public-integrity',
          code: 'SEARCH_POLICY_MISMATCH',
          severity: 'FATAL',
          message: `Record [${df.record_id}] has an active structured guide, but publication.workflow_available is false. This prevents search from distinguishing it as a comprehensive resolution guide.`,
          location: `denial_fingerprints[${df.record_id}].publication.workflow_available`
        });
      }
    }
  }

  // =========================================================================
  // 3. Anchor & Section ID Integrity for all guides
  // =========================================================================
  Array.from(guideMap.entries()).forEach(([guideId, guide]) => {
    const seenScenarioIds = new Set();
    for (const sc of guide.detailed_scenarios) {
      if (seenScenarioIds.has(sc.id)) {
        issues.push({
          rule: 'public-integrity',
          code: 'ANCHOR_OR_ID_DUPLICATION',
          severity: 'FATAL',
          message: `Duplicate scenario ID "${sc.id}" found in guide ${guideId}. Scenario IDs must be globally unique within the guide.`,
          location: `${guideId}.detailed_scenarios[${sc.id}]`
        });
      }
      seenScenarioIds.add(sc.id);
    }

    const seenStepNumbers = new Set();
    for (const step of guide.investigation_steps) {
      if (seenStepNumbers.has(step.step_number)) {
        issues.push({
          rule: 'public-integrity',
          code: 'ANCHOR_OR_ID_DUPLICATION',
          severity: 'FATAL',
          message: `Duplicate investigation step number "${step.step_number}" found in guide ${guideId}.`,
          location: `${guideId}.investigation_steps[${step.step_number}]`
        });
      }
      seenStepNumbers.add(step.step_number);
    }
  });

  return issues;
}

module.exports = { validatePublicIntegrity };
