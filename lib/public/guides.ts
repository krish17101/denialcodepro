/** Original editorial workflows. No official code descriptions or proprietary tables. */
export type PublicGuide = {
 slug: string; title: string; summary: string; firstCheck: string;
 sections: { title: string; paragraphs: string[] }[];
 branches: { finding: string; action: string; keep: string }[];
 examples: { title: string; facts: string; reasoning: string; action: string }[];
 sourceLinks: { title: string; url: string; scope: string }[];
};
export const publicGuides: PublicGuide[] = [
 {
  slug: 'find-the-claim-response', title: 'Work out which claim response needs attention',
  summary: 'Compare the claim you sent with the response you received before deciding what to change.',
  firstCheck: 'Identify who issued the response, which submission it refers to, and whether it concerns the whole claim or a service line.',
  sections: [
   {title:'Build a short evidence trail',paragraphs:['Start with the outbound claim, the clearinghouse or payer response, and the original billing record in your approved work system. Record their identifiers and dates separately. A screenshot of the billing screen may not show what was transmitted or what the receiver processed.','For each document, note its author, event, and claim or line reference. Distinguish sending a file, receiving a file, accepting a claim for processing, and issuing a payment decision. Do not assume the latest message describes every earlier submission. These are recommended investigation distinctions, not a replacement for the applicable transaction guide.']},
   {title:'Ask a question that resolves the missing fact',paragraphs:['If the record is unclear, ask: “Which submission and line does this message refer to? What was received, and what specific field or requirement caused this response?” Request a reference number or written explanation you can retain.','Do not send another unchanged claim simply to see what happens. First establish the status and the appropriate route with the receiver. If a deadline may be approaching, escalate the uncertainty promptly; waiting for clarification should not be assumed to extend the time available.']},
   {title:'Finish the investigation',paragraphs:['Compare the next response with the disputed fact, not only the payment total. A corrected identifier or accepted transmission does not by itself establish that the claim was paid correctly. Retain the before-and-after evidence and document what remains unresolved.','To reduce repeats, consider a team checklist that records the original submission, receiver acknowledgement, and final decision separately. Use only records your organization is authorized to access and retain.']}
  ],
  branches:[
   {finding:'The response cannot be linked confidently to a submission.',action:'Obtain the receiver’s claim or transaction reference and reconcile it before choosing a correction.',keep:'Original response, submission reference, and clarification record.'},
   {finding:'The received value differs from the documented outbound value.',action:'Investigate the transmission or processing discrepancy. Ask which correction method applies after the discrepancy is confirmed.',keep:'Documented source value, outbound value, received value, and timestamps.'},
   {finding:'The values agree, but the decision is disputed.',action:'Identify the rule or rationale and the review route available to the relevant party. Do not invent a data change.',keep:'Decision notice, dated rule, supporting and contradictory evidence.'}
  ],
  examples:[
   {title:'Fictional example: two messages, different submissions',facts:'A biller sees a recent rejection and an older remittance in the same account.',reasoning:'Their presence in one account does not show that they describe the same submission.',action:'Match references and dates first. Retain both messages; choose a route only after the actual affected submission is identified.'},
   {title:'Fictional example: a value changed in transit',facts:'The billing record and saved outbound claim agree, but the payer’s received image shows a different value.',reasoning:'The discrepancy needs investigation before changing the clinical or billing source record.',action:'Request a processing/transmission review with the compared records. This may establish the cause; it does not promise payment.'}
  ],
  sourceLinks:[{title:'CMS: Electronic Billing & EDI Transactions',url:'https://www.cms.gov/medicare/coding-billing/electronic-billing',scope:'Official Medicare electronic-billing reference hub. Use the applicable program and transaction guidance; this editorial checklist does not supply segment locators.'}]
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
