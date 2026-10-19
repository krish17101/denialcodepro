#!/usr/bin/env node

/**
 * DenialCodePro V3 — Source-Grounded Knowledge Quality Gate
 * Validates the knowledge base, CARC/RARC registries, and operational guides.
 * Exits 0 on success; exits 1 on blocking fatal failures.
 */

const path = require('path');
const { KnowledgeQualityValidator } = require('./quality/validator');

function run() {
  console.log('===============================================================');
  console.log('   DENIALCODEPRO V3 — SOURCE-GROUNDED KNOWLEDGE QUALITY GATE   ');
  console.log('===============================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const qualityDir = path.join(rootDir, 'lib', 'v3', 'knowledge', 'quality');
  const registryDir = path.join(qualityDir, 'registry');
  const fixturesDir = path.join(qualityDir, 'fixtures');
  const guidesDir = path.join(rootDir, 'lib', 'v3', 'knowledge', 'guides');
  const datasetPath = path.join(rootDir, 'lib', 'v3', 'knowledge', 'v3_public_dataset.json');

  const validator = new KnowledgeQualityValidator(registryDir);

  // -------------------------------------------------------------------------
  // PHASE 1: Regression Test Fixtures Suite
  // -------------------------------------------------------------------------
  console.log('PHASE 1: Executing Regression Test Fixtures Suite...');

  const fixtureDefinitions = [
    {
      file: 'invalid-n382-cob.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'RARC_SEMANTIC_MISMATCH',
      description: 'N382 incorrectly described as coordination of benefits'
    },
    {
      file: 'invalid-n300-n301-cob.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'RARC_SEMANTIC_MISMATCH',
      description: 'N300/N301 assigned to missing COB information'
    },
    {
      file: 'invalid-m51-modifier.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'RARC_SEMANTIC_MISMATCH',
      description: 'M51 treated as inherently indicating a modifier error'
    },
    {
      file: 'invalid-commercial-deadlines.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'DEADLINE_SCOPE_MISMATCH',
      description: 'Commercial appeal deadline presented as universal corrected-claim deadline'
    },
    {
      file: 'invalid-universal-unprocessable.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'UNPROCESSABLE_SCOPE_OVERREACH',
      description: 'Every CARC 16 adjustment incorrectly treated as an unprocessable return'
    },
    {
      file: 'invalid-clearinghouse-835-conflation.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'REJECTION_REMITTANCE_CONFLATION',
      description: 'Clearinghouse 277CA rejection conflated with an 835 adjudicated adjustment'
    },
    {
      file: 'invalid-co-blanket-liability.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'GROUP_CODE_LIABILITY_OVERREACH',
      description: 'Group Code CO asserted as automatically deciding all patient liability'
    },
    {
      file: 'invalid-unverified-provenance.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'PROVENANCE_MISSING',
      description: 'Guide claiming full verification despite missing source provenance'
    },
    {
      file: 'invalid-unknown-rarc.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'CODE_NOT_FOUND',
      description: 'Guide referencing unverified RARC N9999 missing from controlled registry'
    },
    {
      file: 'invalid-carc18-universal-co.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'CARC_18_GROUP_CODE_OVERREACH',
      description: 'CARC 18 duplicate denial asserting Group Code CO is universal or omitting OA standard'
    },
    {
      file: 'invalid-carc18-blanket-liability.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'CARC_18_PATIENT_LIABILITY_OVERREACH',
      description: 'CARC 18 asserting blanket zero patient liability merely because adjustment uses OA or CO'
    },
    {
      file: 'invalid-co22-model-cob-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'COB_MODEL_RULE_OVERREACH',
      description: 'NAIC Model #120 asserted as federal mandate or Medicare asserted as always secondary'
    },
    {
      file: 'invalid-co197-emergency-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'EMERGENCY_PROTECTION_OVERREACH',
      description: 'EMTALA asserted as universal reimbursement mandate or No Surprises Act overgeneralized to elective care'
    },
    {
      file: 'invalid-co197-retro-auth-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'RETRO_AUTH_SCOPE_OVERREACH',
      description: 'Retrospective authorization 24-72h window asserted as universal rule for all care/elective procedures'
    },
    {
      file: 'invalid-alert-rarc-cause.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'ALERT_RARC_CONFLATION',
      description: 'Informational Alert RARC treated as substantive diagnostic cause or appeal guarantee'
    },
    {
      file: 'invalid-co197-nsa-waiver-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'NO_SURPRISES_ACT_WAIVER_OVERREACH',
      description: 'No Surprises Act 45 CFR § 149.420 notice-and-consent misapplied as in-network prior-auth waiver'
    },
    {
      file: 'invalid-co197-ma-nsa-conflation.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'MA_NSA_CONFLATION',
      description: 'Medicare Advantage emergency protections conflated with federal No Surprises Act instead of 42 CFR § 422.113'
    },
    {
      file: 'invalid-co197-emergency-impossible.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'CARC_197_EMERGENCY_IMPOSSIBLE_OVERREACH',
      description: 'CARC 197 asserted as impossible or categorically banned from all emergency claims'
    },
    {
      file: 'invalid-bpr16-appeal-trigger.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'BPR16_UNIVERSAL_APPEAL_TRIGGER',
      description: 'BPR16 asserted as universal denial date or universal appeal trigger'
    },
    {
      file: 'invalid-universal-auth-validity.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'UNIVERSAL_AUTH_VALIDITY_OVERREACH',
      description: 'Prior authorization validity span asserted as universal 60 to 180 days across healthcare'
    },
    {
      file: 'invalid-universal-p2p-window.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'UNIVERSAL_P2P_WINDOW_OVERREACH',
      description: 'Peer-to-peer clinical discussion window asserted as universal 5 to 14 days across all payers'
    },
    {
      file: 'invalid-emergency-indicator-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'EMERGENCY_INDICATOR_OVERREACH',
      description: 'POS 20/23 or emergency diagnosis codes asserted as conclusively proving prior-auth exemption'
    },
    {
      file: 'invalid-co197-opd-abn-overreach.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'CMS_OPD_ABN_OVERREACH',
      description: 'Bypassing Medicare OPD prior auth asserted as permitting ABN issuance or charging the patient'
    },
    {
      file: 'invalid-ma-appeal-notice-date.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'MA_APPEAL_RECEIPT_SCOPE_OVERREACH',
      description: 'Medicare Advantage reconsideration asserted as universally due 60 days from notice date without receipt presumption'
    },
    {
      file: 'invalid-erisa-provider-deadline.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'ERISA_APPEAL_SCOPE_OVERREACH',
      description: 'ERISA claimant appeal period asserted as a universal provider payment-dispute deadline'
    },
    {
      file: 'invalid-erisa-aob-representation.json',
      expectedOutcome: 'SHOULD_FAIL',
      expectedCode: 'ERISA_AOB_REPRESENTATION_OVERREACH',
      description: 'Assignment of benefits asserted as automatically authorizing every provider to appeal for the claimant under ERISA'
    },
    {
      file: 'valid-sample-guide.json',
      expectedOutcome: 'SHOULD_PASS',
      description: 'Valid, properly qualified denial-resolution guide fixture'
    }
  ];

  let fixturesPassed = 0;

  for (const def of fixtureDefinitions) {
    const fullPath = path.join(fixturesDir, def.file);
    const res = validator.testFixture(fullPath, def.expectedOutcome, def.expectedCode);

    const icon = res.test_passed ? '✔ PASS' : '✖ FAIL';
    console.log(`  [${icon}] ${def.file}`);
    console.log(`         Test: ${def.description}`);
    console.log(`         Result: ${res.notes}`);
    if (res.test_passed) {
      fixturesPassed++;
    }
  }

  const allFixturesPassed = fixturesPassed === fixtureDefinitions.length;
  console.log(`\n  Fixtures Summary: ${fixturesPassed}/${fixtureDefinitions.length} passed.\n`);

  // -------------------------------------------------------------------------
  // PHASE 2 & 3: Live Knowledge Base & Guides Validation
  // -------------------------------------------------------------------------
  console.log('PHASE 2 & 3: Validating Live Knowledge Base & Operational Guides...');
  const datasetResult = validator.validateDataset(datasetPath, guidesDir);

  console.log(`  Controlled Registries Coverage:`);
  console.log(`    - Controlled CARCs registered: ${datasetResult.registry_carcs_count}`);
  console.log(`    - Controlled RARCs registered: ${datasetResult.registry_rarcs_count}`);
  console.log(`  Public Content References Validated:`);
  console.log(`    - Unique CARCs referenced & checked: ${datasetResult.total_carcs_checked}`);
  console.log(`    - Unique RARCs referenced & checked: ${datasetResult.total_rarcs_checked}`);
  console.log(`    - Denial fingerprints checked: ${datasetResult.total_fingerprints_checked}`);
  console.log(`    - Operational structured guides checked: ${datasetResult.total_guides_checked}`);
  console.log(`    - Fatal issues detected: ${datasetResult.fatal_count}`);
  console.log(`    - Warning issues detected: ${datasetResult.warning_count}\n`);

  for (const guideRes of datasetResult.guide_results) {
    const statusIcon = guideRes.status === 'PASSED' ? '✔ PASSED' : '✖ BLOCKED';
    console.log(`  Guide [${guideRes.guide_id}] (${guideRes.title}): ${statusIcon}`);
    if (guideRes.issues.length > 0) {
      for (const issue of guideRes.issues) {
        console.log(`    - [${issue.severity}] [${issue.rule}/${issue.code}] ${issue.message}`);
      }
    }
  }

  // Any dataset-level issues (desync, QA leaks, missing codes)
  const nonGuideIssues = datasetResult.issues.filter(
    i => !datasetResult.guide_results.some(gr => gr.issues.includes(i))
  );

  if (nonGuideIssues.length > 0) {
    console.log('\n  Dataset Integrity Issues:');
    for (const issue of nonGuideIssues) {
      console.log(`    - [${issue.severity}] [${issue.rule}/${issue.code}] ${issue.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // FINAL VERDICT
  // -------------------------------------------------------------------------
  console.log('\n===============================================================');
  const isOverallSuccess = allFixturesPassed && datasetResult.status === 'PASSED';

  if (isOverallSuccess) {
    console.log('  QUALITY GATE STATUS: PASSED (All checks & fixtures clean)');
    console.log('===============================================================\n');
    process.exit(0);
  } else {
    console.error('  QUALITY GATE STATUS: BLOCKED (Blocking validation failures found)');
    console.error('===============================================================\n');
    process.exit(1);
  }
}

run();
