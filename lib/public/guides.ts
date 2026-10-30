/** Original editorial workflows. No official code descriptions or proprietary tables. */
export type PublicGuide = {
 slug: string; title: string; summary: string; firstCheck: string;
 updatedOn?: string; sourcesCheckedOn?: string; scopeNote?: string;
 sections: { title: string; paragraphs: string[]; sourceUrls?: string[] }[];
 branches: { finding: string; action: string; keep: string }[];
 examples: { title: string; facts: string; reasoning: string; action: string }[];
 sourceLinks: { title: string; url: string; scope: string }[];
};
export const publicGuides: PublicGuide[] = [
 {
  "slug": "find-the-claim-response",
  "title": "Work out which claim response needs attention",
  "summary": "Find out whether the message reports a submission problem, a processing status, or a payment decision. Then choose the right investigation.",
  "firstCheck": "Open the actual response, not just the account status. Match its sender and claim reference to the submission you sent. Read whether it identifies a rejection, a pending item, or a decision on a particular claim or line.",
  "updatedOn": "30 October 2026",
  "sourcesCheckedOn": "30 October 2026",
  "scopeNote": "The steps below are editorial investigation recommendations. The CMS facts are labeled for Original Medicare fee-for-service; other payers need their own instructions. This page does not interpret an adjustment code, establish a deadline or appeal right, or authorize patient billing.",
  "branches": [
    {
      "finding": "You cannot match the response to a submission, or two responses conflict.",
      "action": "Ask the sender which submission and claim or line the message describes. Compare the references, dates and service details in your approved system. If the records still conflict, ask the clearinghouse or payer to trace the specific submission before choosing a correction.",
      "keep": "Both responses, outbound submission references, the conflicting details and the trace or contact reference."
    },
    {
      "finding": "The response identifies a submission error or rejection.",
      "action": "Find the exact field or requirement cited. Compare the saved outbound claim with the documented service and the receiver’s instructions. Correct only a confirmed error, then follow that receiver’s submission method. If the reported data is accurate or the message is vague, request clarification rather than changing a value to get past the edit.",
      "keep": "Full rejection message, original claim, evidence for any correction, applicable instructions and the next acknowledgment."
    },
    {
      "finding": "You have an acknowledgment or a pending status, but no matching payment decision.",
      "action": "Find out what the acknowledgment actually accepted. Check the payer’s current claim status and any request for information. Ask what remains outstanding, who must act and which timing rule applies. Do not treat acceptance as payment approval or send another unchanged claim merely because payment has not appeared.",
      "keep": "Acknowledgment, current status and retrieval date, any information request, response evidence and follow-up owner."
    },
    {
      "finding": "A remittance or decision identifies the affected claim or service line.",
      "action": "Read the full explanation for that item and compare the reported claim with the source record. A documented reporting error points toward the payer’s correction process; accurate data with a disputed decision calls for investigating the applicable review route. Confirm who may request it and the governing deadline before acting.",
      "keep": "Item-level decision, reported data, supporting records, dated payer rule and the requirements for the selected route."
    },
    {
      "finding": "The outbound claim and the payer’s received record show different values.",
      "action": "First confirm they are the same submission and the same field. Ask the clearinghouse or payer to trace the difference. Once its cause is established, confirm who must correct it and how. Do not alter an accurate source record to match an unexplained received value.",
      "keep": "Source record, saved outbound version, received version and trace findings. These are comparison records, not automatic proof of payer error."
    }
  ],
  "sections": [
    {
      "title": "1. Build a record of this submission",
      "paragraphs": [
        "In your organization’s approved system, record the payer and product, sender of each response, submission reference, payer claim reference if available, service dates, and affected line or item. Keep the submitted version of the claim beside the response. A current billing screen may show edits made after transmission.",
        "Label each date by its event: service, sending, acknowledgment, notice or receipt. Do not collapse them into one “claim date.” Keep patient details out of this website’s search and contact messages. If a deadline may be close, escalate the uncertainty promptly; do not assume a phone inquiry extends it."
      ]
    },
    {
      "title": "2. Know what the Medicare response tells you",
      "paragraphs": [
        "For Original Medicare fee-for-service, CMS describes submission checks followed by coverage and payment checks. Passing an earlier check does not establish the result of the later ones. The response needs to be read for the actual error or decision, rather than treating “sent” as “approved.”"
      ],
      "sourceUrls": [
        "https://www.cms.gov/medicare/coding-billing/electronic-billing/electronic-healthcare-claims"
      ]
    },
    {
      "title": "3. Look up status when the outcome is missing",
      "paragraphs": [
        "For Medicare Administrative Contractor claims, CMS lists provider portals, telephone status systems and electronic claim-status inquiries as options; direct data entry is available to some providers. Use a supported channel to locate the claim. For another payer, confirm its own status process.",
        "Useful questions are: “Can you locate this submission? What stage is it at? Is an action required from us? Which written instruction and deadline apply?” If the payer cannot locate it, reconcile routing and transmission evidence with the submitter before deciding whether a new submission is appropriate."
      ],
      "sourceUrls": [
        "https://www.cms.gov/medicare/coding-billing/electronic-billing/claim-status-request-response"
      ]
    },
    {
      "title": "4. Read the affected item, not just the payment total",
      "paragraphs": [
        "CMS explains that a Medicare remittance can contain decisions for several claims, with information at claim or service-line level and adjustments at provider level. Find the item being investigated before connecting a message or amount to it. A difference in the total deposit does not, on its own, identify that item’s problem."
      ],
      "sourceUrls": [
        "https://www.cms.gov/medicare/coding-billing/electronic-billing/health-care-payment-remittance-advice"
      ]
    },
    {
      "title": "5. Close the loop after taking action",
      "paragraphs": [
        "Check that the next response refers to the intended submission and addresses the problem you investigated. Keep the original, any supported change, the chosen process and the outcome together. Acceptance of a corrected submission is a checkpoint, not a promised payment.",
        "To reduce repeat work, give each unresolved case an owner and a follow-up date based on the applicable instructions. Track transmission problems separately from disputed payment decisions. If the same discrepancy recurs, have the responsible billing or system team examine its cause before changing an entire queue."
      ]
    }
  ],
  "examples": [
    {
      "title": "Fictional example: a rejection and a remittance on one account",
      "facts": "An account contains a Monday remittance for one service date and a Tuesday rejection for a different submission. The dashboard gives the account one overall status.",
      "reasoning": "The dashboard label is not enough to identify which submission needs attention. The dates and references point to two separate items.",
      "action": "Match each message to its own outbound claim. Investigate the Tuesday rejection’s stated problem and follow its receiver’s instructions if an error is confirmed. Review the Monday decision separately only if there is a dispute. Keep both records; this example establishes no payment or appeal entitlement."
    },
    {
      "title": "Fictional example: an accepted file with no decision found",
      "facts": "The clearinghouse shows a file as accepted. The biller has not found a payer decision for one claim in that file.",
      "reasoning": "The label does not establish what the payer accepted or whether it decided that claim. A missing decision is a reason to trace status, not evidence of a denial.",
      "action": "Retrieve the claim-specific response and check payer status using the correct reference. If it is pending, identify outstanding requests and follow-up instructions. If it cannot be found, reconcile routing with the clearinghouse. Preserve the acceptance message, status result and trace record before choosing a submission route."
    }
  ],
  "sourceLinks": [
    {
      "title": "CMS: Electronic Health Care Claims",
      "url": "https://www.cms.gov/medicare/coding-billing/electronic-billing/electronic-healthcare-claims",
      "scope": "Original Medicare FFS. Locator: “How Electronic Claims Submission Works.” Page modified 25 August 2026; checked 30 October 2026. Supports the distinction between submission checks and later coverage/payment checks, not a universal correction procedure."
    },
    {
      "title": "CMS: Claim Status Request and Response",
      "url": "https://www.cms.gov/medicare/coding-billing/electronic-billing/claim-status-request-response",
      "scope": "Medicare Administrative Contractor status inquiries. Locator: opening list of provider options. Page modified 10 September 2024; checked 30 October 2026. Does not set a follow-up interval or establish receipt of a particular claim."
    },
    {
      "title": "CMS: Health Care Payment and Remittance Advice",
      "url": "https://www.cms.gov/medicare/coding-billing/electronic-billing/health-care-payment-remittance-advice",
      "scope": "Medicare remittance information. Locator: “Electronic Remit Advice (ERA) and Standard Paper Remit (SPR),” opening paragraphs. Page modified 10 September 2024; checked 30 October 2026. Supports item-level investigation; does not determine this reader’s payment or patient liability."
    }
  ]
},
 {
  slug:'choose-a-correction-or-review',title:'Should you correct the claim or ask for a review?',
  summary:'Separate an actual reporting error from a disputed decision on accurately reported information.',
  firstCheck:'Compare the reported information with the documented source record. Establish what, if anything, is actually wrong.',
  sections:[
   {title:'Describe the finding before naming the process',paragraphs:['Write one sentence identifying the discrepancy or disputed decision. For example: “The transmitted value differs from the approved record,” or “The reported value is accurate, but the payer applied a rule whose scope is disputed.” If neither statement can be supported, gather evidence first.','A correction, replacement, new submission, processing inquiry, reconsideration, and formal appeal can have different requirements. Terminology and availability depend on the payer, program, claim status, and requesting party. Confirm the actual process; these labels are not interchangeable instructions.']},
   {title:'Confirm the route and its requirements',paragraphs:['Ask the payer which channel applies, how the submission should link to the original claim, who may request it, and what notice or rule governs timing. Keep the answer and its source with the case. A customer-service explanation should be checked against the applicable written requirement where a consequential conflict remains.','Do not change a diagnosis, service, date, or units simply because the change might improve payment. A coding question belongs with appropriately qualified staff and the documented service. Do not infer patient liability from the existence of an adjustment.']},
   {title:'Check the result and prevent a repeat',paragraphs:['Preserve the original information, the evidence supporting any change, the selected route, required attachments, submission contents, and receipt evidence. After the next response, confirm whether it addresses the disputed fact. A new response can raise a different issue that needs its own investigation.','For recurring problems, distinguish a source-data issue from a transmission mapping or payer-processing issue before changing your workflow. Review a small sample of affected cases rather than assuming the same cause across an entire queue.']}
  ],
  branches:[
   {finding:'A supported reporting discrepancy is confirmed.',action:'Validate the correct value, then use the applicable payer correction process. Confirm linkage and submission requirements.',keep:'Original and supported corrected values; governing instructions; submission evidence.'},
   {finding:'Reported data is accurate and a processing discrepancy is identified.',action:'Ask for the appropriate processing review and establish any separate deadline or escalation route.',keep:'Accurate claim, received record, disputed processing detail, reference number.'},
   {finding:'The decision is disputed under a policy or benefit rule.',action:'Establish whether a reconsideration, appeal, or provider dispute is available to the requester and what evidence it requires.',keep:'Decision, applicable rule/version, standing or authorization where required, and supporting records.'},
   {finding:'The facts or applicable route are unknown.',action:'Seek clarification without inventing a correction. Escalate a potentially approaching deadline.',keep:'Open questions, notices and dates, contact attempts, and unresolved conflicts.'}
  ],
  examples:[
   {title:'Fictional example: a documented data-entry mistake',facts:'An approved billing record differs from the claim value sent to the payer.',reasoning:'There is evidence of a reporting discrepancy, but the right replacement method is still payer-dependent.',action:'Validate the documented value, confirm the correction channel and linkage, and preserve both versions. No payment outcome is assumed.'},
   {title:'Fictional example: accurate data, disputed policy',facts:'The record and claim agree, but staff believe the cited policy does not cover this setting.',reasoning:'Changing accurate data would not resolve the applicability question.',action:'Obtain the dated policy and decision rationale, then confirm the available review route and evidence requirements.'}
  ],
  sourceLinks:[{title:'CMS: Original Medicare fee-for-service appeals',url:'https://www.cms.gov/medicare/appeals-grievances/fee-for-service',scope:'Program-specific authority hub. Do not transfer Medicare FFS appeal processes to Medicare Advantage, Medicaid, or commercial provider disputes.'}]
 },
 {
  slug:'build-a-deadline-evidence-record',title:'Check the rule before calculating a claim deadline',
  summary:'Record the rule, triggering event, and counting method instead of guessing a universal filing or appeal period.',
  firstCheck:'Identify which action is due, who is taking it, and which payer, program, contract, or notice governs that action.',
  sections:[
   {title:'Keep the clocks separate',paragraphs:['Create a separate entry for initial filing, claim correction, review, or appeal where those actions have distinct requirements. Do not reuse one date or time period simply because the same claim is involved. Record whether the source refers to service, discharge, submission, receipt, notice, or another event.','This is a recommended evidence worksheet, not a deadline calculator. It intentionally supplies no default number of days. If the governing rule is unclear, obtain qualified help promptly rather than treating an estimated date as reliable.']},
   {title:'Complete the evidence record',paragraphs:['For each action, record: the requesting party; applicable payer/product and setting; source title and exact section; effective period; triggering event; evidence of that event; time unit; counting convention; any supported exception; and the person who checked the calculation. Record uncertainties explicitly.','Keep proof of sending separate from proof of receipt or acceptance. Ask what the applicable rule requires and which record establishes it. A conversation, corrected submission, or request for review should not be assumed to restart or pause a clock.']},
   {title:'Resolve conflicts before relying on a date',paragraphs:['If a notice, provider manual, and phone answer disagree, preserve all three. Check whether they cover the same product, requesting party, action, and effective period. Seek clarification of the conflict instead of choosing the most generous period.','For internal prevention, assign an owner to each unresolved timing question, keep the source with the recorded date, and recheck when the payer or process changes. Use your organization’s approved systems for real claim details.']}
  ],
  branches:[
   {finding:'The action, controlling rule, and trigger are established.',action:'Calculate using that rule, verify the arithmetic and counting convention, and retain the source and trigger evidence.',keep:'Source section/version, trigger record, calculation, and reviewer.'},
   {finding:'The rule is known but the triggering event is uncertain.',action:'Obtain evidence of the relevant event; do not substitute a convenient date.',keep:'Notice envelope/portal history or other relevant receipt evidence, with limitations.'},
   {finding:'Sources conflict or requester rights are unclear.',action:'Escalate promptly to the appropriate payer contact or specialist. Keep uncertainty visible and do not assume an extension.',keep:'Conflicting passages, scope comparison, contact record, and pending questions.'}
  ],
  examples:[
   {title:'Fictional example: a print date and a received date',facts:'A notice shows one date; the office records receiving it later.',reasoning:'Neither date can be selected without identifying the triggering event in the governing rule.',action:'Retain both records and verify the rule before calculating. The example establishes no specific appeal period.'},
   {title:'Fictional example: member and provider processes',facts:'A biller finds a member appeal page while handling a contracted provider payment dispute.',reasoning:'The page may concern a different requesting party and action.',action:'Find the applicable provider process and authority. Do not copy the member deadline into the case worksheet.'}
  ],
  sourceLinks:[{title:'CMS: Original Medicare fee-for-service appeals',url:'https://www.cms.gov/medicare/appeals-grievances/fee-for-service',scope:'One official program reference. The appropriate authority for another payer or provider dispute must be established separately.'}]
 }
];
export const getPublicGuide = (slug:string) => publicGuides.find(g=>g.slug===slug);
