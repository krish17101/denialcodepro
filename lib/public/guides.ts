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
  "slug": "choose-a-correction-or-review",
  "title": "Should you correct the claim or ask for a review?",
  "summary": "Check whether the submitted information is wrong, the processing is wrong, or you disagree with a decision. Each finding needs a different response.",
  "firstCheck": "Put the submitted claim, the response and the documented service side by side. Write down the exact value or decision you dispute. Also establish whether the receiver returned the claim, is still processing it, or issued a decision.",
  "updatedOn": "31 October 2026",
  "sourcesCheckedOn": "31 October 2026",
  "scopeNote": "These are investigation recommendations, with Medicare FFS rules labeled separately. Do not change accurate data to seek payment. Confirm the applicable deadline promptly: a Medicare reopening request does not pause the appeal clock (see the Medicare section below). This guide does not determine appeal eligibility or patient liability.",
  "branches": [
    {
      "finding": "The claim was returned or rejected before a decision on the disputed service.",
      "action": "Read the actual error and compare the submitted value with the source record. If an error is confirmed, follow the receiver’s return/correction instructions. Ask whether the original claim remains in its system and which submission method applies. If the data is accurate or the stage is unclear, request clarification before treating the message as an appealable denial.",
      "keep": "The original submission, full response, confirmed error or open question, receiver instructions and any new receipt record."
    },
    {
      "finding": "The claim contains a documented reporting error.",
      "action": "Have the responsible billing or coding staff validate the correct value against the service record. Then establish the payer’s correction route for this claim’s current status. Confirm how to identify the original claim and what information to include. Do not guess a replacement indicator or change an unrelated field.",
      "keep": "The original and corrected values, evidence supporting the change, applicable payer instructions and the submitted version."
    },
    {
      "finding": "The submitted data is accurate, but there is evidence of a processing discrepancy.",
      "action": "Show the payer the specific difference between the submitted record and its processing or received record. Ask for the appropriate processing inquiry or correction. Confirm whether a separate formal review must be filed to protect an available right; do not assume a service ticket substitutes for it.",
      "keep": "Matched claim references, comparison records, the disputed processing detail, ticket number and any separate review requirements."
    },
    {
      "finding": "The data is accurate and you dispute a coverage, policy or payment decision.",
      "action": "Obtain the stated rationale and the rule that applies to this product, service and date. Identify the review route available to the requester, its submission channel, deadline trigger and required evidence. Address why the rule or its application is disputed. Repeating an unchanged claim does not explain that dispute.",
      "keep": "Decision notice, applicable policy or contract passage, evidence supporting and weakening the argument, and any required representative authorization."
    },
    {
      "finding": "You cannot establish the error, claim status or available route.",
      "action": "Make a short list of the missing facts and ask the receiver to resolve them. Assign a follow-up owner. Escalate promptly if a deadline may be approaching or instructions conflict. Do not fill the gap with an invented correction, assumed appeal right or estimated filing period.",
      "keep": "Unanswered questions, notices and event dates, conflicting instructions and contact attempts."
    }
  ],
  "sections": [
    {
      "title": "1. Name the problem before choosing a form",
      "paragraphs": [
        "Use a specific statement: “The submitted service date differs from the signed record,” “The payer received a different value,” or “The cited policy appears to address a different setting.” Treat each as a hypothesis until the records support it. A balance on the account is not enough to choose a remedy.",
        "A correction changes supported claim information. A processing inquiry asks what happened to the information received. A formal review challenges a decision through an established process. Payers may use labels such as replacement, reconsideration or appeal differently; confirm the procedure behind the label. These descriptions organize your investigation, not prescribe a transaction."
      ]
    },
    {
      "title": "2. If Medicare returned the claim as unprocessable",
      "paragraphs": [
        "For incomplete or invalid information handled under Medicare Claims Processing Manual Chapter 1, sections 80.3.1–80.3.2, an unprocessable return is not a denial carrying appeal rights. The supported correction channel depends on how it was returned. Confirm that classification; some edits have different instructions. Do not classify every remittance message as an appealable decision."
      ],
      "sourceUrls": [
        "https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c01.pdf"
      ]
    },
    {
      "title": "3. If a Medicare claim needs a clerical correction",
      "paragraphs": [
        "CMS separates minor-error corrections from appeals. Chapter 34 describes reopenings and also permits eligible Part A providers to continue using adjusted claims. Ask the MAC which route fits the error and claim type; not every correction requires the same method.",
        "A Medicare reopening request does not pause the time to request an appeal. Confirm any separate action promptly. Do not assume a reopening will be granted or use it as a substitute for an unavailable appeal."
      ],
      "sourceUrls": [
        "https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/clm104c34.pdf"
      ]
    },
    {
      "title": "4. If you are considering a Medicare redetermination",
      "paragraphs": [
        "CMS describes redetermination as review of an initial claim determination by MAC staff who did not make that determination. First establish an appealable determination and that the requester is a proper party or representative. Use the applicable MAC instructions and supporting evidence; a telephone inquiry alone is not the written redetermination request described by CMS.",
        "These Medicare FFS distinctions do not establish the process for Medicare Advantage, Medicaid, a commercial plan, or a contracted provider dispute. For those cases, obtain the instructions for the actual product and requesting party. A member appeal page is not enough to establish a provider’s contractual dispute process."
      ],
      "sourceUrls": [
        "https://www.cms.gov/medicare/appeals-grievances/fee-for-service/first-level-appeal-redetermination-medicare-contractor"
      ]
    },
    {
      "title": "5. Confirm the route, timing and evidence before sending",
      "paragraphs": [
        "Ask: Which process applies to this claim and issue? Who can submit it? What identifies the original claim? Which channel and attachments are required? What event starts the deadline, how is it counted, and where is that requirement written? Keep the answer with its source. If a phone answer conflicts with written instructions, preserve both and escalate the conflict.",
        "Keep sending evidence separate from receipt evidence. Do not assume an inquiry, correction or informal review extends another deadline. Use your organization’s approved system for case details; do not put patient information into this website’s search or contact messages."
      ]
    },
    {
      "title": "6. Verify the result and reduce repeat work",
      "paragraphs": [
        "Check whether the response addresses the intended claim, field or policy dispute. A received submission is not a promise of payment. If the next response raises a new issue, record it separately instead of repeatedly sending the same request.",
        "For recurring problems, identify who owns the cause: source documentation, billing entry, transmission mapping or payer processing. Use confirmed cases to improve that part of the process. Preserve both versions and the reason for any change rather than erasing the original record."
      ]
    }
  ],
  "examples": [
    {
      "title": "Fictional example: a documented date-entry error",
      "facts": "The saved submitted claim has a service date that differs from the signed service record. The response identifies that date as a problem.",
      "reasoning": "The comparison supports a reporting error, but does not establish whether to send a new claim, a replacement or another correction request. The claim’s processing status still matters.",
      "action": "Validate the date with the responsible staff, confirm status and the receiver’s correction instructions, and keep the original and corrected versions. If the records conflict, resolve that conflict first. A corrected date does not establish coverage or guarantee payment."
    },
    {
      "title": "Fictional example: accurate data, disputed policy scope",
      "facts": "A claim and service record agree. The decision cites a policy, but the available version appears to describe a different setting.",
      "reasoning": "This supports investigating the policy’s applicability; it does not prove the payer is wrong or justify changing accurate data.",
      "action": "Retrieve the policy version effective for the service and the decision rationale. If the mismatch is confirmed, establish the requester’s available review process and timing, then submit the relevant argument and evidence. If the policy does apply, reassess the case rather than repeating the same unsupported dispute."
    }
  ],
  "sourceLinks": [
    {
      "title": "CMS: Incomplete or invalid claims — Chapter 1 (PDF)",
      "url": "https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c01.pdf",
      "scope": "Medicare FFS; sections 80.3.1–80.3.2, PDF pages 217–219. Section revisions 1588 and 4388; chapter cover revision 13725 (10 April 2026). Checked 31 October 2026. Supports the unprocessable-return distinction; specific edit exceptions and submission instructions still matter."
    },
    {
      "title": "CMS: Reopenings — Chapter 34 (PDF)",
      "url": "https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/clm104c34.pdf",
      "scope": "Medicare FFS; sections 10, 10.4 and 10.4.1, PDF pages 3 and 5–6. Cover revision 4219 (25 January 2019). Checked 31 October 2026. Supports the correction/appeal distinction and clock warning; not a guarantee of reopening."
    },
    {
      "title": "CMS: First-level appeal — redetermination",
      "url": "https://www.cms.gov/medicare/appeals-grievances/fee-for-service/first-level-appeal-redetermination-medicare-contractor",
      "scope": "Original Medicare FFS; opening paragraph, Requesting a Redetermination, and Dismissal of a Redetermination Request. Page modified 10 March 2026; checked 31 October 2026. Supports requester and process distinctions; this guide does not calculate a case-specific deadline."
    }
  ]
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
