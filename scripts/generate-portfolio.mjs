import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

function write(relativePath, content) {
  const target = join(ROOT, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${content.trimStart()}\n`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const projects = [
  {
    slug: "media-inventory-console",
    title: "Season-Level Media Inventory Operations Console",
    shortTitle: "Media Inventory Console",
    status: "Production-facing internal tool",
    role: "Workflow designer and developer",
    period: "Media Operations Automation Projects - September 2025 to January 2026",
    users: "Media operations team",
    scale: "Approximately 10 seasons, 120 episodes and 1,000+ assets in a season inventory",
    technologies: ["JavaScript", "Browser APIs", "DOM observation", "CSV", "Bookmarklets"],
    output: "Searchable season inventory console with export, queue and confirmed action workflows",
    type: "Production operations tool",
    purpose: "Extended an authenticated media CMS with season-level inventory loading, search, filtering, classification, CSV export, download queues and confirmed delete/replace workflows.",
    result: "Reduced locate, verify and delete/replace work from about 4-7 minutes per asset to under one minute in large season inventories.",
    visual: "Virtualized CMS inventory hydration, filters and selected-file queue",
    demo: "inventory",
    problem: [
      "Operators needed to act on assets across an entire season, but the CMS exposed records through episode pages and virtualized lists.",
      "Records appeared only after scrolling, so a normal page search or single table export could miss files that had not been hydrated into the browser yet.",
      "Deletion and replacement work carried real operational risk, so the workflow needed review, selection and confirmation steps."
    ],
    constraints: [
      "No direct integration endpoint was available to the operator.",
      "The tool had to operate inside an existing authorized browser session.",
      "Published portfolio material cannot include real selectors, private titles, session details or unreleased identifiers.",
      "Virtualized loading required repeated passes until the season inventory stabilized."
    ],
    stakeholders: [
      "Media operations operators locating, exporting, replacing and verifying assets.",
      "Leads who needed faster status checks across seasons.",
      "Adjacent teams receiving CSV exports or file queues for follow-up."
    ],
    approach: [
      "Map the page behavior first: how episodes loaded, when rows entered the DOM, and which visible fields were reliable enough for classification.",
      "Hydrate the inventory deliberately, then keep a local state model of fictionalized records for filtering, selection and export.",
      "Classify filenames into useful operational categories such as video, audio, subtitles, captions, forced narrative, image and metadata.",
      "Separate read-only discovery actions from destructive actions, and require a confirmation modal for delete or replace steps."
    ],
    architecture: ["Authorized CMS page", "Bookmarklet or console launcher", "DOM observer and scroll hydrator", "Local inventory state", "Filters, CSV and action queue", "Human confirmation"],
    workflow: ["Open season inventory", "Hydrate virtualized rows", "Classify filenames", "Filter by type, locale and version", "Select files", "Export CSV or queue action", "Confirm delete/replace", "Log outcome"],
    details: [
      "The public demo uses fictional filenames and a simulated scroll hydrator rather than private selectors.",
      "Search supports multi-word AND matching, exact filename matching and regex matching.",
      "Locale normalization keeps variations such as en-US and en_us comparable.",
      "The selected-file queue is intentionally separate from the table so operators can review work before action."
    ],
    safeguards: [
      "No destructive operation occurs automatically in the public demo.",
      "Production-facing behavior required explicit human review before delete or replace actions.",
      "The public case study omits session capture, private selectors, employer data, production domains and real file identifiers."
    ],
    testing: [
      "Compared counts before and after hydration passes until the row count stabilized.",
      "Spot-checked filename classification against known asset categories.",
      "Tested selected-file queues and CSV output with large fictionalized inventories."
    ],
    results: [
      "Supported whole-season review instead of repeated single-episode inspection.",
      "Improved locate and verify speed for large inventories.",
      "Created a workflow that multiple team members could use without needing a direct backend integration."
    ],
    limitations: [
      "The original workflow depended on browser-visible data and the existing authorized session.",
      "It was intentionally an operator-side extension, not a permanent product integration.",
      "The public portfolio demo is reconstructed with fictional data."
    ],
    learned: [
      "A useful internal tool can begin as a thin operational layer when the data is already visible to authorized users.",
      "The most important design work was not the table itself; it was reducing ambiguity before risky actions."
    ],
    next: [
      "Add stronger saved filter presets.",
      "Add a private audit export format for action review.",
      "Move the concept into an approved integration path if a stable endpoint becomes available."
    ],
    codeLabel: "Virtualized-list hydration and safe action queue",
    code: `// Sanitized illustrative excerpt
async function hydrateInventory(scrollArea, readRows) {
  let previousCount = 0;
  let stablePasses = 0;

  while (stablePasses < 3) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
    await waitForIdleFrame();

    const rows = readRows();
    stablePasses = rows.length === previousCount ? stablePasses + 1 : 0;
    previousCount = rows.length;
  }

  return classifyRows(readRows()).filter((row) => row.fileName);
}

function requestDestructiveAction(selectedRows) {
  return {
    mode: "requires-human-confirmation",
    count: selectedRows.length,
    filenames: selectedRows.map((row) => row.fileName)
  };
}`
  },
  {
    slug: "file-linking-search",
    title: "Browser-Side File Linking Search and Inventory Hydration",
    shortTitle: "File Linking Search",
    status: "Working browser-side workflow extension",
    role: "Workflow designer, JavaScript developer and tester",
    period: "Media Operations Automation Projects",
    users: "Media operations users linking delivered assets",
    scale: "Lazy-loaded file locations containing dozens to hundreds of browser-visible rows",
    technologies: ["JavaScript", "DOM APIs", "Regex", "Browser session", "Chrome DevTools"],
    output: "Hydrated filename index with keyboard search, extension filters and candidate selection",
    type: "Browser-side operations tool",
    purpose: "Added a temporary search and filter layer to an authenticated file-linking modal so operators could find browser-visible assets without repeatedly navigating folders and clicking through long lists.",
    result: "Turned a multi-step manual file-browsing path into a hydrated, keyboard-first search while preserving the system's native link confirmation.",
    visual: "Dark Link File modal with a compact floating search index",
    demo: "linking",
    problem: [
      "The existing file-linking modal required operators to navigate nested folders and repeatedly click through results to locate an exact delivered asset.",
      "The built-in search worked only against rows already rendered in the modal, so valid files could remain invisible until the list was scrolled and hydrated.",
      "Filename conventions carried useful title, episode, language, asset-class and extension signals, but the interface did not expose them as fast operational filters."
    ],
    constraints: [
      "No direct API or service credential was available for the internal system.",
      "The tool ran only inside the operator's existing authenticated browser session and used browser-visible data.",
      "The file list was lazy-loaded, so indexing before hydration produced incomplete results.",
      "Published material cannot include private domains, selectors, storage paths, titles, account data or session material."
    ],
    stakeholders: [
      "Operators linking subtitles, captions, audio and video deliveries.",
      "Production leads who needed fewer repetitive navigation steps and clearer exception handling.",
      "Technical partners reviewing whether the workflow could move toward an approved integration."
    ],
    approach: [
      "Record the original linking path and inspect a saved DOM snapshot to understand the rendered modal, row structure and loading behavior.",
      "Hydrate the file list through controlled scroll passes until the visible filename count stabilized.",
      "Build a temporary in-memory filename and path index, then add debounced search, regex or AND/OR matching and extension filters.",
      "Keep candidate selection separate from the system's native confirmation so search acceleration did not bypass the operator's final link decision."
    ],
    architecture: ["Authenticated Link File modal", "Scroll hydrator", "Browser-visible row reader", "Temporary filename index", "Search and extension filters", "Candidate selection", "Native confirmation"],
    workflow: ["Open Link File modal", "Hydrate lazy-loaded rows", "Build temporary index", "Search filename or path", "Filter by extension", "Select one candidate", "Review target and candidate", "Confirm through native workflow"],
    details: [
      "The working search layer exposed .scc, .dfxp, .mov and .wav filters alongside text matching.",
      "A debounced input reduced repeated full-list filtering while the user typed.",
      "Hydration status and indexed-row counts made incomplete search coverage visible to the operator.",
      "The public demo reconstructs the interaction with fictional filenames and generic storage paths."
    ],
    safeguards: [
      "No separate internal-system credential was stored or distributed by the search layer.",
      "Session-derived access remained privileged and temporary; no token, cookie or session identifier is included in this portfolio.",
      "Search and selection did not bypass the system's human confirmation boundary.",
      "The public demo cannot connect to or modify any production system."
    ],
    testing: [
      "Captured the original multi-click flow as a browser recording before changing the workflow.",
      "Compared indexed counts before and after repeated scroll hydration passes.",
      "Tested AND/OR matching, regex handling, extension combinations and empty-result states.",
      "Checked that selecting a search result mapped back to the correct rendered file row."
    ],
    results: [
      "Reduced repetitive folder navigation and manual scanning during linking work.",
      "Made incomplete lazy-loaded coverage visible instead of silently returning partial search results.",
      "Created a faster operator workflow without requiring a direct API integration."
    ],
    limitations: [
      "The tool depended on an authenticated browser session and sufficiently stable rendered UI surfaces.",
      "A browser refresh, session expiry or interface update could require relaunching or adjusting the tool.",
      "The public demo is a functional reconstruction, not the private production script or DOM."
    ],
    learned: [
      "Search quality depends on hydration completeness when the source interface virtualizes or lazy-loads rows.",
      "A small operator-side layer can remove substantial friction when it exposes state the host interface already renders."
    ],
    next: [
      "Add saved search presets for recurring asset conventions.",
      "Add structured candidate scoring for title, episode, locale and asset class.",
      "Move the workflow to an approved integration path if a stable internal endpoint becomes available."
    ],
    codeLabel: "Lazy-list hydration and temporary filename index",
    code: `// Sanitized illustrative excerpt
async function buildVisibleFileIndex(scrollArea, readVisibleRows) {
  let previousCount = -1;
  let stablePasses = 0;

  while (stablePasses < 3) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
    await waitForRenderedRows();

    const count = readVisibleRows().length;
    stablePasses = count === previousCount ? stablePasses + 1 : 0;
    previousCount = count;
  }

  return readVisibleRows().map(toSearchableFileRecord);
}

function searchIndex(records, terms, extensions) {
  return records.filter((record) =>
    extensions.has(record.extension) &&
    terms.every((term) => record.searchText.includes(term))
  );
}`
  },
  {
    slug: "asset-reconciliation",
    title: "Ingest Status Reconciliation and Airtable Readiness Automation",
    shortTitle: "Ingest Status Reconciliation",
    status: "Working automation used by multiple operators",
    role: "Workflow designer, automation developer and tester",
    period: "Media Operations Automation Projects",
    users: "Operators maintaining localization and ingest-readiness trackers",
    scale: "Typical runs handled roughly 50-100 publishing tracker records",
    technologies: ["Puppeteer", "Airtable", "JavaScript", "Authenticated browser session", "Deterministic matching"],
    output: "Verified readiness-field updates with explainable exception logs",
    type: "Browser automation and reconciliation",
    purpose: "Used Puppeteer inside an operator's authenticated browser context to hydrate and read ingest records, verify completed asset matches, and update only the corresponding unchecked Airtable readiness fields.",
    result: "Converted repetitive cross-system status checks into a conservative batch pass while leaving incomplete, missing and ambiguous records unchanged for human review.",
    visual: "Ingest-status rows, browser automation activity and Airtable-style readiness fields",
    demo: "reconciliation",
    problem: [
      "Delivery presence alone did not prove that an asset had completed ingest and was linked successfully.",
      "Operators had to compare Airtable requirements against a separate authenticated ingest interface and update asset-specific linked fields one row at a time.",
      "The ingest list was lazy-loaded, so automation could miss valid rows unless it actively scrolled and hydrated the browser-visible inventory.",
      "False positives could create downstream launch risk, so ambiguous matches had to stop or produce review logs."
    ],
    constraints: [
      "The automation was deterministic browser automation, not AI.",
      "No direct API or service credential was available for the internal ingest system.",
      "Puppeteer reused the operator's existing authenticated browser context and read only what that logged-in user could already see.",
      "The Airtable write used a separate scoped token and could not blindly overwrite completed tracker fields.",
      "Private selectors, domains, session material, storage paths, titles and tracker identifiers are excluded from this public reconstruction."
    ],
    stakeholders: [
      "Publishing tracker owners who needed current readiness fields.",
      "Operators responsible for A/V, subtitle, caption, forced-narrative and descriptive-audio assets.",
      "Team members reviewing exception behavior before broader use.",
      "Technical partners evaluating browser automation against future approved integrations."
    ],
    approach: [
      "Represent each tracker row as a requirement with title alpha ID, episode, language, locale, asset class and expected extension.",
      "Launch Puppeteer against the authenticated ingest interface, then scroll and hydrate the result list until the rendered row count stabilized.",
      "Score candidates across language, locale, filename convention, extension, asset class and ingest stage.",
      "Update only the mapped unchecked Airtable field when exactly one completed candidate passed every required check.",
      "Leave processing, delivered-only, missing and ambiguous candidates unchanged, with a legible reason for manual review."
    ],
    architecture: ["Airtable requirements", "Rules engine", "Puppeteer in authenticated browser context", "Lazy-list hydrator", "Browser-visible ingest records", "Readiness update guard", "Exception log"],
    workflow: ["Read unchecked requirement", "Open authenticated search", "Hydrate rendered rows", "Collect candidates", "Match ID, locale and asset type", "Verify completed stage", "Update one scoped field", "Stop on ambiguity", "Write run log"],
    details: [
      "Locale maps normalized operational variations before comparison.",
      "Separate tracker fields represented A/V, DFXP, SCC, SCC with forced narrative, descriptive audio and exception state.",
      "The update guard prevented overwriting already-complete readiness fields.",
      "Candidate rejection reasons were logged so a human could understand why a row stopped.",
      "Pagination, scrolling and loaded-record handling were treated as correctness requirements, not performance details."
    ],
    safeguards: [
      "No match means no update.",
      "Multiple plausible matches route to manual review.",
      "Processing or delivered-only records do not satisfy a completed-ingest requirement.",
      "The browser session reduced credential distribution but remained sensitive and temporary; no session token, cookie or authentication value was stored in this portfolio.",
      "The public demo uses fictional rows and simulated browser activity."
    ],
    testing: [
      "Ran fixture sets for accepted, missing, wrong-locale and ambiguous candidates.",
      "Checked that already-complete tracker fields were not overwritten.",
      "Compared row counts before and after list hydration to detect incomplete browser reads.",
      "Reviewed logs with operators to make failures and skipped updates legible."
    ],
    results: [
      "Allowed multiple users or testers to run repeatable readiness checks.",
      "Made DONE verification explicit instead of assuming delivery meant processing was complete.",
      "Reduced repeated browser-to-tracker comparison work while preserving exception review.",
      "Created a safer path for high-volume tracker maintenance without a direct internal-system API."
    ],
    limitations: [
      "The automation depended on the operator's authenticated browser access and stable enough rendered UI surfaces.",
      "A refresh, session expiry or interface change could require relaunching or updating the browser automation.",
      "Some edge cases required manual review by design.",
      "The public demo is a reconstruction and does not include private selectors, session data or Airtable credentials."
    ],
    learned: [
      "Browser automation is most useful when it is conservative and explainable.",
      "Hydration completeness is part of data correctness when the source interface lazy-loads rows.",
      "A stopped run with a clear reason is better than a silent incorrect update."
    ],
    next: [
      "Add richer fixture coverage for edge locales.",
      "Add operator-facing run summaries grouped by failure reason.",
      "Move stable matching rules into a shared validation library if the workflow expands.",
      "Migrate to an approved API integration if a stable internal endpoint and service credentials become available."
    ],
    codeLabel: "Puppeteer hydration, completed-stage verification and update guard",
    code: `// Sanitized illustrative excerpt
async function reconcileRequirement(requirement, browserPage, tracker) {
  await hydrateSearchResults(browserPage);
  const candidates = await searchIngestResults(browserPage, requirement.alphaId);
  const matches = candidates.filter((candidate) =>
    candidate.status === "DONE" &&
    sameLocale(candidate.locale, requirement.locale) &&
    candidate.assetClass === requirement.assetClass &&
    candidate.fileName.endsWith(requirement.expectedExtension)
  );

  if (matches.length !== 1) {
    return logManualReview(requirement, matches);
  }

  if (!requirement.readinessChecked) {
    await tracker.markReady(
      requirement.rowId,
      requirement.readinessField
    );
  }

  return logAccepted(requirement, matches[0]);
}`
  },
  {
    slug: "video-version-comparison",
    title: "Automated Video Version Comparison and Difference Reporter",
    shortTitle: "Video Version Comparison",
    status: "Working prototype with preserved output; public demo reconstructed",
    role: "Workflow designer and prototype developer",
    period: "Media Operations Automation Projects - September 2025 to January 2026",
    users: "Media review and operations users comparing episode versions",
    scale: "Prototype workflow for same-episode version comparison",
    technologies: ["FFmpeg", "ffprobe", "VMAF", "Frame analysis", "Audio alignment", "Python"],
    output: "Difference ranges, representative screenshots and review report",
    type: "Media-analysis prototype",
    purpose: "Compared two versions of the same episode and exported representative screenshots of detected differences.",
    result: "Produced a reviewable report for commercial breaks, regional edits, duration mismatches, frame changes and audio offsets.",
    visual: "Synchronized panes, difference timeline and exported review ranges",
    demo: "video",
    problem: [
      "Two episode files could appear similar while containing editorial, timing or technical differences.",
      "Manual comparison was slow and easy to lose track of when mismatches occurred across many time ranges.",
      "Reviewers needed representative screenshots and technical context, not just a pass/fail result."
    ],
    constraints: [
      "Original source code is not currently preserved.",
      "The public demo is reconstructed from the workflow and preserved output behavior.",
      "Only public, open or generated sample media should be used in any future live demo."
    ],
    stakeholders: [
      "Reviewers comparing reference and comparison versions.",
      "Operations users investigating mismatched regions.",
      "Technical collaborators who need reproducible media-inspection steps."
    ],
    approach: [
      "Inspect both files with ffprobe before analysis.",
      "Normalize resolution, frame rate and timing where needed.",
      "Align audio, run perceptual-quality analysis and detect frame-difference clusters.",
      "Export representative screenshots for human review rather than hiding decisions in a score."
    ],
    architecture: ["Reference video", "Comparison video", "ffprobe inspection", "Normalization", "VMAF and frame-difference analysis", "Audio alignment", "Screenshot export", "Human review"],
    workflow: ["Load file metadata", "Normalize comparison inputs", "Align audio", "Calculate similarity signals", "Detect time ranges", "Export screenshots", "Review and annotate", "Export report"],
    details: [
      "VMAF and frame differences served different review purposes: one quality-focused, one mismatch-focused.",
      "Detected ranges were grouped so reviewers could inspect coherent segments instead of isolated frames.",
      "Audio offset results were shown beside visual differences because timing issues can appear in either channel."
    ],
    safeguards: [
      "The workflow produced evidence for human review rather than automatic editorial decisions.",
      "Public reconstruction avoids private media and private source code.",
      "Any future demo media should be public-domain, open-license or generated."
    ],
    testing: [
      "Validated output by inspecting representative screenshot ranges.",
      "Checked metadata and duration mismatches before deeper analysis.",
      "Compared audio-offset output with visible timeline differences."
    ],
    results: [
      "Created a structured report that made version differences easier to review.",
      "Supported investigation of commercial breaks, regional editorial changes and missing or added sections.",
      "Preserved enough output behavior to reconstruct a public demo honestly."
    ],
    limitations: [
      "The exact original source implementation is not available in this repo.",
      "The public page demonstrates the workflow concept, not private production code.",
      "Media-analysis thresholds would need calibration by content type and review need."
    ],
    learned: [
      "A useful comparison report should combine metrics, ranges and human-readable visual evidence.",
      "The export format matters because review work often happens after the analysis job finishes."
    ],
    next: [
      "Rebuild the public version with generated sample clips.",
      "Add a review-note export format.",
      "Add threshold presets for editorial, encoding and duration-focused investigations."
    ],
    codeLabel: "FFmpeg command construction and VMAF parsing",
    code: `// Sanitized illustrative excerpt
function buildVmafCommand(referencePath, comparisonPath, reportPath) {
  return [
    "ffmpeg",
    "-i", comparisonPath,
    "-i", referencePath,
    "-lavfi", "libvmaf=log_fmt=json:log_path=" + reportPath,
    "-f", "null",
    "-"
  ];
}

function summarizeRanges(frameScores, threshold) {
  return groupAdjacentFrames(
    frameScores.filter((frame) => frame.score < threshold)
  );
}`
  },
  {
    slug: "op-ed-detection",
    title: "Dataset-Assisted Opening and Ending Timestamp Detection",
    shortTitle: "OP/ED Timestamp Detection",
    status: "Experimental season-level prototype",
    role: "Prototype designer and media-analysis tester",
    period: "Earliest project in the September 2025 to January 2026 automation range",
    users: "Operations users preparing human-reviewed timestamp tables",
    scale: "Season-level prototype with human-validated reference timestamps",
    technologies: ["Python", "FFmpeg", "pandas", "openpyxl", "librosa", "OpenCV", "Whisper", "NumPy"],
    output: "Excel table with candidate OP and ED boundaries for review",
    type: "Experimental media-analysis workflow",
    purpose: "Used human-validated OP/ED reference timestamps, audio features and speech-recognition output to estimate opening and ending boundaries.",
    result: "Created candidate timestamp ranges for human review without claiming automatic final accuracy.",
    visual: "Waveform, reference examples, repeated-pattern regions and Excel output",
    demo: "oped",
    problem: [
      "Season-level timestamp work can be repetitive, especially when openings and endings recur with small episode-level variations.",
      "A tool could suggest likely ranges, but final values still needed human validation.",
      "The system needed to present supporting signals clearly instead of pretending to know narrative structure."
    ],
    constraints: [
      "No remembered accuracy number should be claimed.",
      "Whisper-derived speech or non-speech information is only a supporting signal.",
      "The Airtable timestamp collection is described as a human-validated reference dataset, not training data.",
      "The prototype was experimental."
    ],
    stakeholders: [
      "Operators preparing timestamp tables.",
      "Reviewers validating candidate OP and ED ranges.",
      "Teams needing repeatable spreadsheet output."
    ],
    approach: [
      "Use reference timestamps to compare repeated audio patterns across a season.",
      "Extract audio features and inspect recurring regions with supporting visual and speech-derived signals.",
      "Generate editable Excel output so humans could approve or correct candidates."
    ],
    architecture: ["Episode media", "FFmpeg extraction", "Audio feature analysis", "Reference timestamp dataset", "Speech/non-speech signal", "Candidate ranges", "Excel output", "Human validation"],
    workflow: ["Load episode list", "Extract audio", "Compare against references", "Identify repeated musical regions", "Add supporting signals", "Write candidate ranges", "Approve or edit", "Export reviewed table"],
    details: [
      "The prototype focused on candidate generation, not autonomous final timing.",
      "Repeated musical-pattern regions were a stronger OP/ED signal than transcript text alone.",
      "Excel output kept the result accessible to non-developer review workflows."
    ],
    safeguards: [
      "Final timestamps required human validation.",
      "Confidence labels are framed as supporting evidence, not certainty.",
      "The public demo uses fictional filenames and simulated waveform regions."
    ],
    testing: [
      "Compared candidate ranges against human-validated reference examples.",
      "Reviewed false starts and endings manually.",
      "Checked spreadsheet output structure for downstream editing."
    ],
    results: [
      "Demonstrated a practical path for accelerating repetitive timestamp review.",
      "Combined media-analysis signals with human approval controls.",
      "Clarified which signals were useful and which needed caution."
    ],
    limitations: [
      "Experimental prototype only.",
      "No final accuracy claim is made.",
      "Recurring audio can be ambiguous when previews, recaps or music cues overlap."
    ],
    learned: [
      "Human-validated references are valuable even without model fine-tuning.",
      "The best output was an editable review table, not a hidden automated decision."
    ],
    next: [
      "Add stronger visualization for repeated audio motifs.",
      "Compare candidates against all retained season references.",
      "Add reviewer notes and confidence rationale to the Excel export."
    ],
    codeLabel: "Candidate range scoring with human review output",
    code: `// Sanitized illustrative excerpt
function scoreCandidateRange(range, signals) {
  const support = [
    signals.musicRepeat ? 0.45 : 0,
    signals.lowDialogue ? 0.2 : 0,
    signals.referenceOverlap ? 0.25 : 0,
    signals.durationWithinExpectedWindow ? 0.1 : 0
  ];

  return {
    start: range.start,
    end: range.end,
    supportScore: support.reduce((sum, value) => sum + value, 0),
    validationStatus: "Needs human review"
  };
}`
  },
  {
    slug: "ktaekwondo-calendar",
    title: "Live Multi-Studio Schedule and Calendar Platform",
    shortTitle: "K-Taekwondo Calendar",
    status: "Live web application and operations prototype",
    role: "System designer, builder and workflow documenter",
    period: "Client operations platform - 2026",
    users: "Studio administrators, families, students and public website visitors",
    scale: "Multi-studio schedule, event and information platform",
    technologies: ["Squarespace", "Airtable", "Cloudflare Workers", "Softr", "HTML", "CSS", "JavaScript"],
    output: "Public calendar widget, studio-specific schedules and operational admin flows",
    type: "Live public web application",
    purpose: "Uses Airtable as the operational source of truth, a Cloudflare Worker/API layer for secure public data delivery, custom HTML/CSS/JavaScript embedded in Squarespace and Softr portals for authenticated studio users.",
    result: "Connected public-facing calendar presentation with maintainable studio operations data and role-based administrative workflows.",
    visual: "Public calendar screenshot, architecture flow and permissions matrix",
    demo: "calendar",
    problem: [
      "A multi-studio martial-arts organization needed public schedules and events that could stay aligned with operational updates.",
      "Studio-specific details, monthly events, weekly schedules and information sections needed one maintainable source of truth.",
      "Administrative editing had to remain separate from the public website presentation."
    ],
    constraints: [
      "Public pages can show authorized K-Taekwondo branding and public event information.",
      "Private Airtable identifiers, Cloudflare configuration, private Softr settings and user details are excluded.",
      "The final architecture must be documented from inspected public/local source, not guessed."
    ],
    stakeholders: [
      "Studio administrators editing schedules and events.",
      "Families and students viewing public schedules.",
      "Operators approving changes and maintaining information sections."
    ],
    approach: [
      "Use Airtable as the operational data source for studios, weekly schedules, monthly calendar events, event sessions, information sections, pending changes and publishing logs.",
      "Serve public schedule payloads through a Cloudflare Worker/API layer so the Squarespace widget does not expose private credentials.",
      "Use custom embedded HTML/CSS/JavaScript for the public calendar and Softr for authenticated studio-facing dashboards."
    ],
    architecture: ["Softr studio dashboards", "Airtable operations tables", "Cloudflare Worker/API layer", "Squarespace embedded widget", "Public calendar users", "Publishing logs and review"],
    workflow: ["Studio admin edits schedule", "Change reaches Airtable", "Restricted changes route to admin review", "Cloudflare returns public fields", "Squarespace widget refreshes", "Each studio sees applicable schedule and events"],
    details: [
      "Inspected source confirmed a public Squarespace widget, Airtable-backed payload handling and a Cloudflare Worker API layer.",
      "The live test page uses a Worker-backed public data path and fallback data when live data is unavailable.",
      "The platform supports weekly schedules, monthly events, event sessions, today views, overrides and English/Spanish presentation patterns."
    ],
    safeguards: [
      "Public code should never contain Airtable credentials or private admin URLs.",
      "Studio-specific filtering limits what each public view needs to render.",
      "Administrative review and publishing logs keep restricted changes visible before public presentation."
    ],
    testing: [
      "Checked public widget behavior from the live test page.",
      "Reviewed local widget source for data-flow comments and fallback behavior.",
      "Verified mobile and desktop presentation expectations through calendar screenshots and responsive layouts."
    ],
    results: [
      "Created a maintainable path from operational schedule data to public website presentation.",
      "Separated public display logic from private editing workflows.",
      "Provided a live public page for review: https://www.k-taekwondo.com/test"
    ],
    limitations: [
      "This case study intentionally omits private base IDs, private user records and administrative configuration.",
      "The public demo on this portfolio is a documentation mockup, not the live editor.",
      "Future production hardening would continue around auditing, versioning and admin ergonomics."
    ],
    learned: [
      "For small organizations, the strongest system is often a careful connection between familiar operational tools and a polished public view.",
      "Fallback data and clear source-state indicators make live public widgets easier to troubleshoot."
    ],
    next: [
      "Add a fuller admin review dashboard.",
      "Add publishing diff previews before changes go live.",
      "Expand bilingual content QA and logging for multi-studio operations."
    ],
    codeLabel: "Worker-shaped public calendar payload transformation",
    code: `// Sanitized illustrative excerpt
async function buildPublicCalendarPayload(studioSlug, language) {
  const records = await readScheduleSource(studioSlug);

  return {
    studio: filterPublicStudioFields(records.studio),
    weeklySchedule: records.weeklySchedule.map(toPublicScheduleRow),
    monthlyEvents: records.monthlyEvents.map((event) =>
      localizePublicEvent(event, language)
    ),
    generatedAt: new Date().toISOString()
  };
}`
  },
  {
    slug: "ktaekwondo-keyframes",
    title: "AI-Assisted Instructional Keyframe Selection",
    shortTitle: "Instructional Keyframes",
    status: "Computer-vision experiment",
    role: "Prototype designer and evaluator",
    period: "Creative technology experiment - 2026",
    users: "Instructional content creators and reviewers",
    scale: "Prototype frame-selection workflow for martial-arts videos",
    technologies: ["OpenCV", "NumPy", "TensorFlow/Keras", "ResNet50", "Cosine distance", "Python"],
    output: "Candidate instructional frames with similarity scores and human selection",
    type: "Computer-vision experiment",
    purpose: "Evaluated automated frame-selection approaches for converting martial-arts videos into representative instructional images while reducing repeated or visually redundant frames.",
    result: "Compared a pixel-difference baseline with an embedding-based experiment and clarified future improvements needed for global uniqueness.",
    visual: "Filmstrip, candidate frames, similarity scores and selected outputs",
    demo: "keyframes",
    problem: [
      "Instructional videos can contain many near-duplicate frames that are not useful as separate teaching images.",
      "Manual frame selection is slow when a reviewer only needs representative body positions or technique moments.",
      "The system needed to reduce redundant candidates while keeping final instructional judgment human-led."
    ],
    constraints: [
      "The supplied prototype compared consecutive frames.",
      "It did not guarantee global uniqueness across every saved image.",
      "The public page uses illustrative frame blocks because no clearly relevant instructional screenshot was found in the inspected generic image files."
    ],
    stakeholders: [
      "Instructional content creators selecting teaching images.",
      "Reviewers annotating and approving final frames.",
      "Technical collaborators evaluating computer-vision approaches."
    ],
    approach: [
      "Start with an OpenCV baseline: decode video, convert to grayscale, compare consecutive frames and export frames above a changed-pixel threshold.",
      "Evaluate an AI-assisted experiment using pretrained ResNet50 average-pooling embeddings and cosine distance between consecutive sampled frames.",
      "Keep human annotation as the final step because visual difference does not guarantee instructional usefulness."
    ],
    architecture: ["Source instructional video", "Frame sampling", "Pixel-difference baseline", "ResNet50 feature extraction", "Similarity filtering", "Candidate export", "Human annotation", "Instructional image"],
    workflow: ["Decode frames", "Sample at intervals", "Score consecutive change", "Extract embeddings", "Compare cosine distance", "Reject near-duplicates", "Export candidates", "Annotate selected frames"],
    details: [
      "The OpenCV baseline was simple and explainable but sensitive to lighting and camera movement.",
      "The ResNet50 experiment captured higher-level visual similarity but still compared consecutive frames in the prototype.",
      "Future versions should compare against all retained keyframes, not only the previous frame."
    ],
    safeguards: [
      "Frame candidates are suggestions for human review.",
      "The public demo does not imply pose correctness or automatic coaching judgment.",
      "No private instructional footage is included."
    ],
    testing: [
      "Compared saved candidate sets for obvious repeated frames.",
      "Reviewed similarity scores alongside visual differences.",
      "Documented failure modes where consecutive comparison retained later duplicates."
    ],
    results: [
      "Identified a practical baseline and a more semantic embedding approach.",
      "Clarified that global deduplication is required before the workflow can be relied on for larger instructional libraries.",
      "Produced a stronger technical roadmap for future computer-vision experiments."
    ],
    limitations: [
      "Consecutive-frame comparison does not guarantee global uniqueness.",
      "Technique usefulness requires human review.",
      "Pose estimation and clustering were not part of the initial prototype."
    ],
    learned: [
      "A simple baseline is valuable because it exposes the problem shape quickly.",
      "Embedding similarity improves the signal but still needs the right comparison strategy."
    ],
    next: [
      "Add perceptual hashes and clustering across all retained frames.",
      "Add scene detection and pose estimation.",
      "Compare candidate frames against every selected keyframe before export."
    ],
    codeLabel: "ResNet feature extraction and consecutive-frame filtering",
    code: `// Sanitized illustrative excerpt
function shouldSaveCandidate(previousEmbedding, currentEmbedding, threshold) {
  const distance = cosineDistance(previousEmbedding, currentEmbedding);

  return {
    save: distance > threshold,
    distance,
    reason: distance > threshold
      ? "visually distinct from previous sample"
      : "near-duplicate of previous sample"
  };
}`
  }
];

const capabilities = [
  "Production operations and asset readiness",
  "Animation, VFX and episodic delivery coordination",
  "Localization workflow tracking",
  "Browser automation and operational tooling",
  "Media analysis prototypes",
  "Airtable, Softr and lightweight data systems",
  "Documentation, operator training and QA",
  "AI-assisted workflow experimentation with human review"
];

function nav(prefix, active) {
  const links = [
    ["home", "Home", "index.html"],
    ["projects", "Work", "projects.html"],
    ["about", "About", "about.html"],
    ["resume", "Resume", "resume.html"]
  ];

  return `<header class="site-header" data-site-header>
    <nav class="nav shell" aria-label="Primary navigation">
      <a class="brand" href="${prefix}index.html" aria-label="Ali Aslam home">
        <span class="brand-mark" aria-hidden="true">AA</span>
        <span class="brand-copy"><strong>Ali Aslam</strong><small>Media Operations Systems</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
        <span class="sr-only">Toggle navigation</span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
      <div class="nav-links" id="primary-navigation">
        ${links.map(([key, label, href]) => `<a href="${prefix}${href}" data-nav="${key}"${key === active ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      </div>
    </nav>
  </header>`;
}

function footer(prefix) {
  return `<footer class="site-footer">
    <div class="shell footer-main">
      <div>
        <p class="footer-title">Ali Aslam</p>
        <p>Production operations, creative technology and human-in-the-loop workflow design.</p>
      </div>
      <a href="https://github.com/Ali1128/ali-aslam-portfolio" target="_blank" rel="noopener noreferrer">View GitHub</a>
    </div>
    <div class="shell footer-bottom">
      <span>&copy; <span data-current-year></span> Ali Aslam.</span>
      <span>Sanitized reconstructions and fictional operational data.</span>
    </div>
  </footer>`;
}

function layout({ title, description, active, prefix = "", body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${prefix}styles.css">
    <script src="${prefix}script.js" defer></script>
  </head>
  <body data-page="${escapeHtml(active)}">
    <a class="skip-link" href="#main">Skip to main content</a>
    ${nav(prefix, active)}
    <main id="main">
      ${body}
    </main>
    ${footer(prefix)}
  </body>
</html>`;
}

function tagList(tags) {
  return `<div class="tag-list">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function statusBadge(text) {
  return `<span class="status-badge">${escapeHtml(text)}</span>`;
}

function projectCard(project, prefix = "") {
  const visual = project.demo === "inventory"
    ? `<span class="project-visual project-visual-image"><img src="${prefix}assets/images/media-inventory-overlay-sanitized.jpeg" alt="Sanitized media inventory overlay interface"></span>`
    : project.demo === "calendar"
      ? `<span class="project-visual project-visual-image project-visual-calendar-image"><img src="${prefix}assets/images/ktaekwondo-calendar-august-2026.png" alt="Published multi-studio calendar artwork"></span>`
      : `<span class="project-visual project-visual-${project.demo}" aria-hidden="true"></span>`;

  return `<article class="project-card">
    <a class="project-card-link" href="${prefix}projects/${project.slug}/">
      ${visual}
      <span class="project-card-body">
        ${statusBadge(project.status)}
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.purpose)}</p>
        <strong>${escapeHtml(project.result)}</strong>
        ${tagList(project.technologies.slice(0, 4))}
      </span>
    </a>
  </article>`;
}

function sectionBlock(title, items) {
  return `<section class="case-section">
    <h2>${escapeHtml(title)}</h2>
    ${Array.isArray(items) ? `<ul class="clean-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : items}
  </section>`;
}

function architectureFlow(project) {
  return `<div class="flow-diagram" aria-label="${escapeHtml(project.title)} architecture flow">
    ${project.architecture.map((step, index) => `<div class="flow-node"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(step)}</div>`).join("")}
  </div>`;
}

function workflowSteps(project) {
  return `<ol class="workflow-steps">
    ${project.workflow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
  </ol>`;
}

function metaGrid(project) {
  const meta = [
    ["Status", project.status],
    ["Role", project.role],
    ["Scale", project.scale],
    ["Tools", project.technologies.slice(0, 4).join(", ")]
  ];

  return `<dl class="metadata-grid">
    ${meta.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
  </dl>`;
}

function projectDemo(project) {
  if (project.demo === "inventory") return inventoryDemo();
  if (project.demo === "linking") return linkingDemo();
  if (project.demo === "reconciliation") return reconciliationDemo();
  if (project.demo === "video") return videoDemo();
  if (project.demo === "oped") return opedDemo();
  if (project.demo === "calendar") return calendarDemo();
  if (project.demo === "keyframes") return keyframesDemo();
  return "";
}

function linkingDemo() {
  return `<section class="demo-panel standalone-demo-embed" aria-label="Interactive file linking search demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Sanitized interactive reconstruction</p>
        <h2>Hydrated file-linking search</h2>
      </div>
      <a class="button button-secondary" href="../../demos/file-linking-search/" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <div class="standalone-demo-frame linking-demo-frame">
      <iframe src="../../demos/file-linking-search/" title="Sanitized interactive file linking search" loading="eager"></iframe>
    </div>
    <div class="inventory-impact" aria-label="Workflow impact">
      <div><strong>37-step baseline</strong><span>recorded manual linking path before the search layer</span></div>
      <div><strong>Hydration-aware</strong><span>indexes rows only after lazy-loaded coverage stabilizes</span></div>
      <div><strong>Human confirmation</strong><span>native link decision remains with the operator</span></div>
    </div>
  </section>`;
}

function inventoryDemo() {
  return `<section class="demo-panel inventory-demo inventory-embed" aria-label="Interactive media inventory console demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Sanitized interactive reconstruction</p>
        <h2>Season inventory overlay</h2>
      </div>
      <a class="button button-secondary" href="../../demos/media-inventory-console/" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <div class="inventory-demo-frame">
      <iframe src="../../demos/media-inventory-console/" title="Sanitized interactive media inventory console" loading="eager"></iframe>
    </div>
    <div class="inventory-impact" aria-label="Workflow impact">
      <div><strong>1,000+</strong><span>assets supported in a season inventory</span></div>
      <div><strong>4-7 min to under 1 min</strong><span>reported locate, verify and delete/replace workflow</span></div>
      <div><strong>Human confirmation</strong><span>required before destructive operations</span></div>
    </div>
  </section>`;
}

function reconciliationDemo() {
  return `<section class="demo-panel standalone-demo-embed" aria-label="Interactive ingest status reconciliation demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Sanitized interactive reconstruction</p>
        <h2>Ingest status to readiness update</h2>
      </div>
      <a class="button button-secondary" href="../../demos/asset-status-reconciliation/" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <div class="standalone-demo-frame reconciliation-demo-frame">
      <iframe src="../../demos/asset-status-reconciliation/" title="Sanitized interactive ingest status reconciliation" loading="eager"></iframe>
    </div>
    <div class="inventory-impact" aria-label="Workflow safeguards">
      <div><strong>Browser-visible read</strong><span>uses the operator's existing authenticated context</span></div>
      <div><strong>Single-match guard</strong><span>updates only one mapped unchecked readiness field</span></div>
      <div><strong>Manual review</strong><span>processing, missing and ambiguous rows remain unchanged</span></div>
    </div>
  </section>`;
}

function videoDemo() {
  return `<section class="demo-panel video-demo" data-video-demo aria-label="Video version comparison demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Illustrative public reconstruction</p>
        <h2>VMAF-assisted version comparison</h2>
      </div>
      <button class="button button-primary" type="button" data-report-export>Export review report</button>
    </div>
    <div class="vmaf-summary">
      <div><span>VMAF mean</span><strong>91.8</strong></div>
      <div><span>Duration delta</span><strong>00:00:51</strong></div>
      <div><span>Review ranges</span><strong>03</strong></div>
      <div><span>Decision</span><strong>Human review</strong></div>
    </div>
    <div class="video-panes">
      <figure class="video-pane">
        <figcaption><span>Reference frame</span><small>00:11:48.120 | VMAF 96.4</small></figcaption>
        <div class="frame-art frame-a"><span class="frame-horizon"></span><span class="frame-subject"></span><span class="frame-monitor"></span><b>REF</b></div>
      </figure>
      <figure class="video-pane">
        <figcaption><span>Comparison frame</span><small>00:11:48.120 | VMAF 78.2</small></figcaption>
        <div class="frame-art frame-b"><span class="frame-horizon"></span><span class="frame-subject"></span><span class="frame-monitor"></span><span class="difference-box">region 02</span><b>CMP</b></div>
      </figure>
    </div>
    <div class="difference-timeline" aria-label="Detected difference timeline">
      <button type="button" data-diff-range="Commercial break" style="--start: 18%; --width: 9%;">Commercial break</button>
      <button type="button" data-diff-range="Regional edit" style="--start: 46%; --width: 6%;">Regional edit</button>
      <button type="button" data-diff-range="Audio offset" style="--start: 70%; --width: 12%;">Audio offset</button>
    </div>
    <div class="comparison-grid">
      <div><h3>Detected ranges</h3><ul><li>00:04:12-00:05:03 commercial break mismatch</li><li>00:11:42-00:12:09 regional editorial difference</li><li>00:18:20-00:21:14 audio offset requires review</li></ul></div>
      <div><h3>Representative frames</h3><div class="screenshot-strip"><span class="sample-one"></span><span class="sample-two"></span><span class="sample-three"></span></div><small>Generated visual placeholders for the public reconstruction, not source media.</small></div>
      <div><h3>Selected range</h3><p data-diff-output>Choose a range on the timeline.</p></div>
    </div>
  </section>`;
}

function opedDemo() {
  return `<section class="demo-panel oped-demo" data-oped-demo aria-label="OP and ED timestamp detection demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Experimental prototype</p>
        <h2>Candidate timestamp review</h2>
      </div>
      <button class="button button-primary" type="button" data-oped-approve>Approve selected candidates</button>
    </div>
    <div class="oped-layout">
      <aside class="episode-list">
        <h3>Season episodes</h3>
        <button type="button" class="active">demo_s01e01.mov</button>
        <button type="button">demo_s01e02.mov</button>
        <button type="button">demo_s01e03.mov</button>
      </aside>
      <div class="waveform-card">
        <div class="waveform" aria-label="Illustrative audio waveform with OP and ED candidates">
          <span class="candidate op" title="Candidate OP"></span>
          <span class="candidate ed" title="Candidate ED"></span>
        </div>
        <div class="signal-grid">
          <div><strong>OP candidate</strong><span>00:01:12 - 00:02:42</span><small>music repeat + reference overlap</small></div>
          <div><strong>ED candidate</strong><span>00:21:10 - 00:22:40</span><small>music repeat + low dialogue</small></div>
          <div><strong>Validation</strong><span data-oped-status>Needs human review</span><small>final timestamps are not automatic</small></div>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Filename</th><th>OP Start</th><th>OP End</th><th>ED Start</th><th>ED End</th><th>Validation Status</th></tr></thead>
        <tbody><tr><td>demo_s01e01.mov</td><td>00:01:12</td><td>00:02:42</td><td>00:21:10</td><td>00:22:40</td><td data-oped-table-status>Needs review</td></tr></tbody>
      </table>
    </div>
  </section>`;
}

function calendarDemo() {
  return `<section class="demo-panel calendar-demo" aria-label="K-Taekwondo calendar platform demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Live public project</p>
        <h2>Multi-studio calendar flow</h2>
      </div>
      <a class="button button-primary" href="https://www.k-taekwondo.com/test" target="_blank" rel="noopener noreferrer">Open live test page</a>
    </div>
    <div class="calendar-layout">
      <figure class="calendar-image">
        <img src="../../assets/images/ktaekwondo-calendar-august-2026.png" alt="K-Taekwondo Glendale August 2026 public calendar screenshot">
        <figcaption>Authorized public calendar artwork used for the K-Taekwondo case study.</figcaption>
      </figure>
      <div class="permissions-matrix">
        <h3>Verified public data flow</h3>
        <div class="flow-diagram compact">
          <div class="flow-node"><span>01</span>Softr studio dashboards</div>
          <div class="flow-node"><span>02</span>Airtable source of truth</div>
          <div class="flow-node"><span>03</span>Cloudflare Worker/API layer</div>
          <div class="flow-node"><span>04</span>Squarespace calendar widget</div>
        </div>
        <h3>Permissions matrix</h3>
        <table>
          <tbody>
            <tr><th>Public visitor</th><td>Read public schedule and event fields</td></tr>
            <tr><th>Studio admin</th><td>Edit applicable studio schedule through authenticated views</td></tr>
            <tr><th>Operator</th><td>Review restricted changes and publishing logs</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function keyframesDemo() {
  return `<section class="demo-panel keyframe-demo" aria-label="Instructional keyframe selection demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Computer-vision experiment</p>
        <h2>Representative frame selection</h2>
      </div>
      <span class="status-badge">Human annotation required</span>
    </div>
    <div class="filmstrip" aria-label="Illustrative sampled frames">
      <span class="frame selected">01<br><small>0.82</small></span>
      <span class="frame rejected">02<br><small>0.08</small></span>
      <span class="frame selected">03<br><small>0.71</small></span>
      <span class="frame rejected">04<br><small>0.12</small></span>
      <span class="frame selected">05<br><small>0.89</small></span>
    </div>
    <div class="comparison-grid">
      <div><h3>Baseline</h3><p>OpenCV grayscale absolute difference and changed-pixel threshold.</p></div>
      <div><h3>AI-assisted experiment</h3><p>ResNet50 embeddings with cosine-distance comparison between consecutive samples.</p></div>
      <div><h3>Future improvement</h3><p>Compare against all retained frames with hashes, clustering, scene detection and pose signals.</p></div>
    </div>
  </section>`;
}

function productionLens(project) {
  const shared = [
    "Turn evolving workflow behavior into clear operating steps and review expectations.",
    "Keep status, blockers and exception reasons visible to production and technical partners.",
    "Preserve human approval at decisions that affect creative output, readiness or destructive actions."
  ];

  const specific = {
    inventory: "Support operators with a documented, repeatable system for high-volume asset review.",
    linking: "Reduce repetitive linking work while keeping hydration coverage, candidate selection and operator confirmation visible.",
    reconciliation: "Track deliverables across systems and route ambiguous matches to course correction instead of silent updates.",
    video: "Organize review materials, time ranges and technical findings so creative and production stakeholders can act on them.",
    oped: "Introduce an experimental media-analysis workflow without presenting candidate outputs as final approvals.",
    calendar: "Maintain a shared schedule source of truth with clear permissions, publishing states and delivery paths.",
    keyframes: "Gather feedback on an emerging AI-assisted workflow and keep artist selection central to the final instructional output."
  };

  return [...shared, specific[project.demo]];
}

function renderProjectPage(project) {
  const body = `<section class="page-hero case-hero">
    <div class="shell">
      <p class="eyebrow">${escapeHtml(project.type)}</p>
      <h1>${escapeHtml(project.title)}</h1>
      <p>${escapeHtml(project.purpose)}</p>
      <div class="hero-actions">
        <a class="button button-secondary" href="../../projects.html">All projects</a>
        <a class="button button-ghost" href="#case-study">Read case study</a>
      </div>
      ${metaGrid(project)}
    </div>
  </section>
  <section class="section" id="case-study">
    <div class="shell">
      ${projectDemo(project)}
      <div class="impact-strip">
        <div><span>Outcome</span><strong>${escapeHtml(project.result)}</strong></div>
        <div><span>Public status</span><strong>${escapeHtml(project.status)}</strong></div>
        <div><span>Contribution</span><strong>${escapeHtml(project.role)}</strong></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="shell case-layout">
      <aside class="case-aside">
        <nav aria-label="Case study sections">
          <a href="#problem">Context</a>
          <a href="#approach">Contribution</a>
          <a href="#architecture">Workflow</a>
          <a href="#validation">Review + safeguards</a>
          <a href="#results">Outcome</a>
        </nav>
      </aside>
      <article class="case-content">
        <div id="problem">${sectionBlock("Operational problem", project.problem)}</div>
        ${sectionBlock("Constraints", project.constraints)}
        <div id="approach">${sectionBlock("My contribution", project.approach)}</div>
        ${sectionBlock("Production supervision lens", productionLens(project))}
        <section class="case-section" id="architecture"><h2>System architecture</h2>${architectureFlow(project)}</section>
        <section class="case-section"><h2>Workflow</h2>${workflowSteps(project)}</section>
        ${sectionBlock("Implementation notes", project.details)}
        ${sectionBlock("Human review and safeguards", project.safeguards)}
        <div id="validation">${sectionBlock("Testing and validation", project.testing)}</div>
        <div id="results">${sectionBlock("Outcome", project.results)}</div>
        ${sectionBlock("Limitations", project.limitations)}
        ${sectionBlock("Next iteration", project.next)}
        <section class="case-section code-section">
          <details class="code-disclosure">
            <summary>View sanitized illustrative code</summary>
            <h2>${escapeHtml(project.codeLabel)}</h2>
            <pre><code>${escapeHtml(project.code)}</code></pre>
          </details>
        </section>
      </article>
    </div>
  </section>`;

  return layout({
    title: `${project.title} | Ali Aslam`,
    description: project.purpose,
    active: "projects",
    prefix: "../../",
    body
  });
}

function homePage() {
  const featured = projects.slice(0, 4).map((project) => projectCard(project)).join("");
  const impactItems = [
    ["4-7 min -> under 1 min", "Reported per-asset locate, verify and delete/replace workflow."],
    ["1,000+ assets", "Season inventories supported by the browser-based operations console."],
    ["Human review", "Retained for ambiguous matches, media-analysis findings and AI-assisted outputs."]
  ];
  const productionPractices = [
    ["Plan + track", "Translate deliverables and dependencies into visible, reviewable production states."],
    ["Run reviews", "Prepare organized materials, decision points and clear follow-up actions."],
    ["Document workflows", "Update operating guidance as tools, constraints and handoffs evolve."],
    ["Surface blockers", "Report exceptions early with context and practical course-correction options."],
    ["Support users", "Make new systems understandable to operators, artists and production partners."],
    ["Partner with tech", "Turn workflow feedback into testable requirements for tools and pipeline improvements."]
  ];

  const body = `<section class="hero">
    <div class="shell home-hero">
      <div class="hero-copy">
        <p class="eyebrow">Production operations / Creative technology / AI-assisted workflow design</p>
        <h1>Ali Aslam</h1>
        <p class="hero-title">Production systems for evolving creative and GenAI workflows.</p>
        <p class="hero-text">I connect creative teams, production data, media assets and technical tools. My work focuses on clear tracking, organized reviews, workflow documentation, visible blockers and human approval inside fast-changing pipelines.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="projects.html">View selected work</a>
          <a class="button button-secondary" href="resume.html">Resume</a>
          <a class="button button-ghost" href="https://github.com/Ali1128/ali-aslam-portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <figure class="hero-work-sample">
        <img src="assets/images/media-inventory-overlay-sanitized.jpeg" alt="Sanitized season-level media inventory overlay showing fictional filenames and statuses">
        <figcaption><span>Production-facing inventory workflow</span><strong>Sanitized reconstruction</strong></figcaption>
      </figure>
    </div>
  </section>
  <section class="section">
    <div class="shell split-section">
      <div>
        <p class="section-kicker">Profile</p>
        <h2>A production operator who can shape the workflow with technical teams.</h2>
      </div>
      <div class="rich-text">
        <p>My background spans streaming media operations, localization and distribution, animation and VFX production, asset delivery, production tracking and workflow automation. I am most useful where teams need someone to understand the work, organize it, communicate it and improve the system around it.</p>
        <p>The case studies below show working tools, experimental prototypes and public reconstructions. Each one states what was operational, what was rebuilt for this portfolio and where human review remained required.</p>
      </div>
    </div>
  </section>
  <section class="section section-ruled">
    <div class="shell">
      <div class="section-heading">
        <p class="section-kicker">Selected work</p>
        <h2>Systems for assets, reviews and production visibility.</h2>
      </div>
      <div class="card-grid two-up">${featured}</div>
      <div class="section-action"><a class="text-link" href="projects.html">View all seven case studies</a></div>
    </div>
  </section>
  <section class="section">
    <div class="shell">
      <div class="section-heading">
        <p class="section-kicker">Production practice</p>
        <h2>What I bring to an evolving pipeline.</h2>
      </div>
      <div class="practice-list">${productionPractices.map(([title, copy], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></div></article>`).join("")}</div>
    </div>
  </section>
  <section class="section section-dark">
    <div class="shell">
      <div class="section-heading">
        <p class="section-kicker">Selected operational impact</p>
        <h2>Evidence, with limits stated plainly.</h2>
      </div>
      <div class="metric-grid">${impactItems.map(([value, label]) => `<div class="metric-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div>
    </div>
  </section>
  <section class="section">
    <div class="shell split-section">
      <div>
        <p class="section-kicker">AI-assisted development</p>
        <h2>Faster iteration, human-defined production logic.</h2>
      </div>
      <div class="rich-text">
        <p>Gemini and Codex supported iterative development, debugging, interface prototyping and code refinement. I defined the production problems, workflow architecture, domain logic, validation requirements and operational testing.</p>
        <p><a class="text-link" href="about.html#ai-workflow">Read the workflow and safeguards</a></p>
      </div>
    </div>
  </section>`;

  return layout({
    title: "Ali Aslam | Production Systems for GenAI Workflows",
    description: "Production operations, creative technology and AI-assisted workflow portfolio for Ali Aslam.",
    active: "home",
    body
  });
}

function projectsPage() {
  const core = projects.slice(0, 4).map((project) => projectCard(project)).join("");
  const additional = projects.slice(4).map((project) => projectCard(project)).join("");
  const body = `<section class="page-hero">
    <div class="shell">
      <p class="eyebrow">Selected systems</p>
      <h1>Production workflow case studies.</h1>
      <p>Working tools, experimental prototypes and sanitized public reconstructions across asset tracking, browser automation, media review and AI-assisted production support.</p>
    </div>
  </section>
  <section class="section">
    <div class="shell">
      <div class="section-heading"><p class="section-kicker">Core workflow systems</p><h2>Assets, readiness, review and production data.</h2></div>
      <div class="project-index-grid">${core}</div>
    </div>
  </section>
  <section class="section section-ruled">
    <div class="shell">
      <div class="section-heading"><p class="section-kicker">Additional systems</p><h2>Scheduling and instructional-media experiments.</h2></div>
      <div class="project-index-grid">${additional}</div>
    </div>
  </section>`;

  return layout({
    title: "Projects | Ali Aslam",
    description: "Selected portfolio case studies for Ali Aslam.",
    active: "projects",
    body
  });
}

function aboutPage() {
  const body = `<section class="page-hero">
    <div class="shell">
      <p class="eyebrow">About</p>
      <h1>Production clarity inside changing technical workflows.</h1>
      <p>I work between creative production, media operations and technical systems, turning complicated handoffs into documented, trackable and reviewable work.</p>
    </div>
  </section>
  <section class="section">
    <div class="shell split-section">
      <div><p class="section-kicker">Background</p><h2>Creative operations experience with a systems mindset.</h2></div>
      <div class="rich-text">
        <p>My experience connects streaming media operations, animation and VFX production, localization, media quality control, asset delivery, vendor coordination, production tracking and operational documentation.</p>
        <p>The common thread is practical coordination: understand what the team needs to deliver, make the status visible, prepare reviews, identify blockers early and work with technical partners when the process or tool needs to change.</p>
      </div>
    </div>
  </section>
  <section class="section section-ruled">
    <div class="shell">
      <div class="section-heading"><p class="section-kicker">Evolving pipelines</p><h2>Production responsibilities I design around.</h2></div>
      <div class="practice-list">
        ${[
          ["Schedules + deliverables", "Track work against dependencies, deadlines and review states."],
          ["Crew information", "Give users a reliable place to understand status, requirements and next actions."],
          ["Reviews + approvals", "Organize materials, labels, expectations, notes and follow-up tasks."],
          ["Status reporting", "Summarize progress, exceptions, risks and tooling blockers without hiding uncertainty."],
          ["Workflow documentation", "Capture new operating steps and update them as hybrid processes evolve."],
          ["Technical collaboration", "Translate production feedback into requirements, test cases and process improvements."]
        ].map(([title, copy], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></div></article>`).join("")}
      </div>
    </div>
  </section>
  <section class="section" id="ai-workflow">
    <div class="shell split-section">
      <div><p class="section-kicker">GenAI workflow approach</p><h2>Use emerging tools without losing production accountability.</h2></div>
      <div class="rich-text">
        <p>I use Gemini and Codex to accelerate exploration, debugging, documentation and interface iteration. I remain responsible for the production problem, workflow architecture, domain rules, test cases and final judgment.</p>
        <p>For AI-assisted creative or media workflows, I separate suggestions from approvals, show the evidence behind a recommendation, document known limits and route uncertain output to a person. The goal is useful support for artists and operators, not an automated claim of creative ownership.</p>
      </div>
    </div>
  </section>
  <section class="section section-dark">
    <div class="shell split-section">
      <div><p class="section-kicker">Tool fluency</p><h2>Comfortable learning the system around the show.</h2></div>
      <div class="rich-text"><p>Production tracking and coordination experience includes browser-based content systems, Airtable, spreadsheet reporting, media-analysis tools, automation scripts and production-facing documentation. The portfolio demonstrates the underlying practices that transfer to shot and asset tracking environments: structured status, ownership, dependencies, exceptions and review history.</p></div>
    </div>
  </section>`;

  return layout({
    title: "About | Ali Aslam",
    description: "About Ali Aslam and his work between production, media operations and technical systems.",
    active: "about",
    body
  });
}

function resumePage() {
  const body = `<section class="page-hero">
    <div class="shell">
      <p class="eyebrow">Resume</p>
      <h1>Production operations + emerging workflow systems.</h1>
      <p>A simple web resume focused on production tracking, creative operations, media pipelines and human-in-the-loop AI workflows.</p>
      <div class="hero-actions"><a class="button button-primary" href="docs/resume.txt">Plain-text resume</a><a class="button button-secondary" href="projects.html">Selected work</a></div>
    </div>
  </section>
  <section class="section">
    <div class="shell resume-sheet">
      <section class="resume-section"><h2>Summary</h2><ul class="clean-list">
        <li>Production operations and media workflow professional with experience across animation, VFX, streaming media, localization, digital distribution and post-production.</li>
        <li>Coordinates creative stakeholders, vendors and technical teams through delivery schedules, review cycles, asset tracking and release-critical workflows.</li>
        <li>Creates workflow documents, trackers and status reports that make due work, blockers, approvals and escalation needs visible.</li>
        <li>Comfortable supporting experimental GenAI/traditional hybrid environments where tools and operating requirements change quickly.</li>
      </ul></section>
      <section class="resume-section"><h2>Selected projects</h2><ul class="clean-list">${projects.slice(0, 4).map((project) => `<li><strong>${escapeHtml(project.shortTitle)}:</strong> ${escapeHtml(project.result)}</li>`).join("")}</ul></section>
      <section class="resume-section"><h2>Relevant experience</h2><ul class="clean-list">
        <li><strong>Media operations:</strong> asset readiness, ingest, localization, delivery tracking, timed text, metadata, partner distribution and release support.</li>
        <li><strong>VFX production coordination:</strong> artist assignments, ShotGrid tracking, review preparation, notes, assets, vendor coordination and delivery escalation.</li>
        <li><strong>Creative operations:</strong> schedules, budgets, campaign assets, approvals, documentation and cross-functional production support.</li>
        <li><strong>Workflow development:</strong> browser automation, Airtable systems, media-analysis prototypes and operator-facing tools.</li>
      </ul></section>
      <section class="resume-section"><h2>Tools</h2><p>ShotGrid, Ftrack, Airtable, Jira, Asana, Google Workspace, Microsoft Office, Aspera, AWS/S3, Google Cloud, DAM/MAM systems, JavaScript, Puppeteer, Python, FFmpeg, OpenCV, Gemini and Codex.</p></section>
    </div>
  </section>`;

  return layout({
    title: "Resume | Ali Aslam",
    description: "Ali Aslam resume summary for media operations, production workflow and creative technology roles.",
    active: "resume",
    body
  });
}

const inventoryFixture = [
  { id: "INV-1001", fileName: "demo_s01e02_master_fhd_2398.mov", class: "video", locale: "-", version: "simulcast", status: "Ready" },
  { id: "INV-1002", fileName: "demo_s01e02_master_fhd_2398_proxy.mp4", class: "video", locale: "-", version: "proxy", status: "Ready" },
  { id: "INV-1003", fileName: "demo_s01e02_audio_en-us_51.wav", class: "audio", locale: "en-US", version: "simulcast", status: "Ready" },
  { id: "INV-1004", fileName: "demo_s01e02_audio_ja-jp_20.wav", class: "audio", locale: "ja-JP", version: "simulcast", status: "Ready" },
  { id: "INV-1005", fileName: "demo_s01e02_subtitle_en-us_full.vtt", class: "subtitle", locale: "en-US", version: "simulcast", status: "Ready" },
  { id: "INV-1006", fileName: "demo_s01e02_subtitle_en-us_forced.vtt", class: "forced", locale: "en-US", version: "simulcast", status: "Review" },
  { id: "INV-1007", fileName: "demo_s01e02_caption_en-us_sdh.vtt", class: "caption", locale: "en-US", version: "simulcast", status: "Ready" },
  { id: "INV-1008", fileName: "demo_s01e02_subtitle_es-es_full.vtt", class: "subtitle", locale: "es-ES", version: "simulcast", status: "Ready" },
  { id: "INV-1009", fileName: "demo_s01e02_subtitle_fr-fr_full.vtt", class: "subtitle", locale: "fr-FR", version: "uncut", status: "Ready" },
  { id: "INV-1010", fileName: "demo_s01e02_subtitle_pt-br_forced.vtt", class: "forced", locale: "pt-BR", version: "uncut", status: "Review" },
  { id: "INV-1011", fileName: "demo_s01e02_keyart_main.jpg", class: "image", locale: "-", version: "global", status: "Ready" },
  { id: "INV-1012", fileName: "demo_s01e02_metadata_delivery.xml", class: "metadata", locale: "-", version: "global", status: "Ready" }
];

const reconFixture = [
  { alphaId: "ALP-204", episode: "E02", locale: "en-US", assetClass: "subtitle", expectedExtension: ".vtt", result: "accepted" },
  { alphaId: "ALP-204", episode: "E02", locale: "ja-JP", assetClass: "dub", expectedExtension: ".wav", result: "accepted" },
  { alphaId: "ALP-204", episode: "E02", locale: "pt-BR", assetClass: "forced narrative", expectedExtension: ".vtt", result: "manual-review" }
];

const css = `:root {
  --bg: #f6f5f2;
  --surface: #ffffff;
  --surface-strong: #efeee9;
  --ink: #181a1b;
  --muted: #5e6263;
  --line: #d8d8d2;
  --accent: #0f766e;
  --accent-dark: #125c57;
  --accent-soft: #dcefeb;
  --rust: #c76529;
  --gold: #e2a23d;
  --blue: #2f6f99;
  --danger: #a33a32;
  --dark: #131516;
  --dark-2: #1d2021;
  --radius: 6px;
  --radius-small: 4px;
  --shadow: 0 18px 50px rgba(16, 18, 19, 0.14);
  --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  line-height: 1.6;
}
body, button, input, select { font: inherit; }
img { display: block; max-width: 100%; height: auto; }
[hidden] { display: none !important; }
a { color: inherit; }
a:hover { color: var(--accent-dark); }
code, pre { font-family: var(--mono); }
code { background: #e9efec; border-radius: var(--radius-small); padding: 0.1rem 0.3rem; overflow-wrap: anywhere; word-break: break-word; }
pre { overflow-x: auto; margin: 0; padding: 1.25rem; border-radius: var(--radius); background: #101719; color: #e8f4ef; line-height: 1.55; }
pre code { display: block; padding: 0; border-radius: 0; background: transparent; color: inherit; overflow-wrap: normal; word-break: normal; }
.hero-copy, .hero-console, .project-card, .project-card-body, .demo-panel, .mini-console, .table-wrap, .queue-panel, .flow-node, .workflow-steps li, .case-aside, .case-content, .case-section, .resume-main, .resume-block, .metric-card, .contact-grid article, pre { min-width: 0; }
:focus-visible { outline: 3px solid rgba(15, 118, 110, 0.45); outline-offset: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.skip-link { position: fixed; top: 0.75rem; left: 0.75rem; z-index: 30; transform: translateY(-160%); padding: 0.7rem 1rem; border-radius: var(--radius-small); background: var(--dark); color: white; text-decoration: none; }
.skip-link:focus { transform: translateY(0); }
.shell { width: min(1200px, calc(100% - 2.5rem)); margin: 0 auto; }
.site-header { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid rgba(220, 227, 223, 0.9); background: rgba(247, 248, 245, 0.94); backdrop-filter: blur(14px); }
.nav { min-height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: inline-flex; align-items: center; gap: 0.75rem; text-decoration: none; color: var(--ink); min-width: 0; }
.brand-mark { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--accent); border-radius: var(--radius); color: var(--accent-dark); background: var(--accent-soft); font-weight: 800; }
.brand-copy { display: grid; line-height: 1.15; }
.brand-copy small { color: var(--muted); font-size: 0.76rem; font-weight: 600; }
.nav-links { display: flex; align-items: center; gap: 0.25rem; }
.nav-links a { padding: 0.5rem 0.75rem; border-radius: var(--radius-small); color: var(--muted); font-weight: 750; text-decoration: none; }
.nav-links a:hover, .nav-links a[aria-current="page"] { background: var(--accent-soft); color: var(--accent-dark); }
.nav-toggle { display: none; width: 44px; height: 44px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); color: var(--ink); }
.nav-toggle span:not(.sr-only) { display: block; width: 18px; height: 2px; margin: 4px auto; border-radius: 999px; background: currentColor; }
.hero, .page-hero { border-bottom: 1px solid var(--line); background: #fbfcf9; }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(330px, 0.72fr); gap: 4rem; align-items: center; padding: 5rem 0; }
.eyebrow, .section-kicker, .demo-kicker { margin: 0 0 0.75rem; color: var(--accent-dark); font-size: 0.78rem; font-weight: 850; text-transform: uppercase; }
.hero h1, .page-hero h1 { margin: 0; max-width: 940px; color: var(--ink); font-size: 4.75rem; line-height: 0.98; }
.page-hero h1 { font-size: 3.75rem; }
.hero-title { max-width: 780px; margin: 1.4rem 0 1rem; color: #243133; font-size: 2rem; line-height: 1.18; font-weight: 780; }
.hero-text, .page-hero p { max-width: 760px; margin: 1rem 0 0; color: var(--muted); font-size: 1.08rem; }
.page-hero { padding: 5rem 0 3.5rem; }
.hero-actions, .button-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.7rem; }
.button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0.7rem 1rem; border: 1px solid var(--line); border-radius: var(--radius-small); font-weight: 800; text-decoration: none; cursor: pointer; }
.button-primary { background: var(--accent); border-color: var(--accent); color: white; }
.button-primary:hover { background: var(--accent-dark); color: white; }
.button-secondary { background: var(--surface); color: var(--ink); }
.button-ghost { background: transparent; color: var(--ink); }
.button-danger { background: var(--danger); border-color: var(--danger); color: white; }
.button.is-disabled { opacity: 0.5; cursor: not-allowed; }
.hero-console, .demo-panel, .mini-console.dark { background: var(--dark); color: #edf5f2; border: 1px solid #2d3b3d; border-radius: var(--radius); box-shadow: var(--shadow); }
.hero-console { padding: 1rem; }
.console-top, .demo-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 1rem; }
.console-top span, .console-log, .video-pane small { color: #aebbbb; }
.console-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0; }
.console-grid div, .inventory-stats div, .metric-card, .mini-console, .resume-block, .contact-grid article { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 1rem; min-width: 0; }
.console-grid div { background: var(--dark-2); border-color: #2f4143; }
.console-grid span, .metric-card span, .metadata-grid dt, .impact-strip span { display: block; color: var(--muted); font-size: 0.85rem; font-weight: 750; }
.console-grid strong { display: block; color: white; margin-top: 0.25rem; }
.console-log { margin: 1rem 0 0; padding-left: 1.25rem; font-family: var(--mono); font-size: 0.86rem; }
.section { padding: 4.5rem 0; }
.section-tinted { background: var(--surface-strong); border-block: 1px solid var(--line); }
.split-section { display: grid; grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr); gap: clamp(1.5rem, 5vw, 4rem); align-items: start; }
.section-heading { max-width: 820px; margin-bottom: 1.8rem; }
h2, h3, p { overflow-wrap: anywhere; }
h2 { margin: 0; font-size: 2.35rem; line-height: 1.08; }
h3 { margin: 0 0 0.5rem; line-height: 1.2; }
.rich-text p { margin: 0 0 1rem; color: var(--muted); font-size: 1.05rem; }
.text-link { color: var(--accent-dark); font-weight: 850; text-decoration-thickness: 0.12em; text-underline-offset: 0.18em; }
.card-grid, .project-index-grid, .capability-grid, .metric-grid, .history-grid, .process-grid, .contact-grid { display: grid; gap: 1rem; }
.three-up, .project-index-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.capability-grid, .process-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.metric-grid, .history-grid, .contact-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.project-card { min-width: 0; }
.project-card-link { display: grid; grid-template-rows: 150px 1fr; height: 100%; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); overflow: hidden; text-decoration: none; box-shadow: 0 10px 26px rgba(23,32,33,0.06); }
.project-card-link:hover { transform: translateY(-2px); color: inherit; }
.project-card-body { display: grid; align-content: start; gap: 0.75rem; padding: 1rem; min-width: 0; }
.project-card h3 { font-size: 1.1rem; }
.project-card p { margin: 0; color: var(--muted); }
.project-card strong { color: var(--accent-dark); }
.project-visual { display: block; min-height: 150px; background: var(--dark); position: relative; overflow: hidden; }
.project-visual::before, .project-visual::after { content: ""; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,0.16); border-radius: var(--radius-small); }
.project-visual::after { inset: auto 20px 20px; height: 46px; background: var(--accent); border: 0; }
.project-visual-reconciliation::after { background: var(--blue); width: 58%; }
.project-visual-linking::after { left: auto; right: 20px; width: 42%; background: var(--rust); }
.project-visual-linking::before { inset: 28px 38% 28px 20px; box-shadow: 150px 18px 0 -12px rgba(255,255,255,0.12); }
.project-visual-video::after { background: var(--rust); width: 36%; left: 42%; }
.project-visual-oped::after { background: var(--gold); width: 70%; }
.project-visual-calendar::after { background: #d8d8d8; height: 72px; }
.project-visual-keyframes::after { background: var(--accent-soft); box-shadow: 80px 0 0 var(--rust), 160px 0 0 var(--blue); width: 45px; }
.status-badge { display: inline-flex; width: fit-content; max-width: 100%; padding: 0.32rem 0.55rem; border-radius: var(--radius-small); background: var(--accent-soft); color: var(--accent-dark); font-size: 0.78rem; font-weight: 850; }
.tag-list { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.tag-list span { padding: 0.25rem 0.5rem; border-radius: var(--radius-small); background: #eef2ef; color: #3e4a4c; font-size: 0.82rem; font-weight: 700; }
.capability-grid article, .process-grid article, .history-grid article { border-top: 2px solid var(--accent); padding-top: 1rem; min-width: 0; }
.capability-grid span, .process-grid span { display: block; margin-bottom: 0.65rem; color: var(--rust); font-family: var(--mono); font-weight: 800; }
.capability-grid p, .history-grid p, .process-grid p { margin: 0; color: var(--muted); }
.metric-card strong { display: block; font-size: 1.65rem; line-height: 1.1; margin-bottom: 0.5rem; }
.section-action { margin-top: 1.5rem; }
.contact-band { border-top: 1px solid var(--line); }
.case-hero .metadata-grid { margin-top: 2rem; }
.metadata-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.8rem; }
.metadata-grid div { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 0.85rem; min-width: 0; }
.metadata-grid dd { margin: 0.25rem 0 0; font-weight: 760; }
.demo-panel { padding: 1rem; margin-bottom: 1rem; }
.demo-panel .demo-panel-header { border-color: rgba(255,255,255,0.12); }
.demo-panel h2, .demo-panel h3 { color: #f7fffb; }
.demo-panel p, .demo-panel li, .demo-panel label, .demo-panel small { color: #c9d4d1; }
.inventory-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0; }
.inventory-stats div { background: var(--dark-2); border-color: #2f4143; }
.inventory-stats span { display: block; color: white; font-size: 1.3rem; font-weight: 850; }
.inventory-stats small { display: block; color: #aebbbb; }
.demo-controls { display: grid; grid-template-columns: minmax(200px, 1fr) repeat(3, minmax(140px, 0.45fr)) auto; gap: 0.75rem; align-items: end; margin-bottom: 1rem; }
.demo-controls label { display: grid; gap: 0.35rem; font-weight: 750; }
input, select { width: 100%; min-height: 42px; border: 1px solid var(--line); border-radius: var(--radius-small); background: white; color: var(--ink); padding: 0.55rem 0.65rem; }
input[type="checkbox"] { width: 18px; height: 18px; min-height: 18px; padding: 0; accent-color: var(--accent); }
.queue-toggle { min-height: 34px; padding: 0.35rem 0.55rem; border: 1px solid #3b5356; border-radius: var(--radius-small); background: #0f1a1c; color: #dcebe6; font-weight: 800; cursor: pointer; }
.queue-toggle[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: white; }
.demo-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 0.32fr); gap: 1rem; }
.table-wrap { max-width: 100%; overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); min-width: 0; }
table { width: 100%; border-collapse: collapse; min-width: 720px; }
th, td { padding: 0.75rem; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
th { color: #3c494b; background: #eef3ef; font-size: 0.82rem; }
td { color: #273638; }
.demo-panel .table-wrap { border-color: #314345; background: var(--dark-2); }
.demo-panel th { color: #d5e4df; background: #1d2a2c; }
.demo-panel td { color: #edf5f2; border-color: #314345; }
.queue-panel { border: 1px solid #314345; border-radius: var(--radius); padding: 1rem; background: var(--dark-2); min-width: 0; }
.queue-panel ul { min-height: 120px; margin: 0 0 1rem; padding-left: 1.2rem; }
.log-panel { margin-top: 1rem; padding: 0.85rem; border: 1px solid #314345; border-radius: var(--radius-small); background: #0b1112; color: #d6e6e1; font-family: var(--mono); font-size: 0.86rem; white-space: pre-wrap; }
.modal-backdrop { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; padding: 1rem; background: rgba(9, 14, 15, 0.7); }
.confirm-dialog { max-width: 520px; border-radius: var(--radius); background: white; color: var(--ink); padding: 1.25rem; box-shadow: var(--shadow); }
.confirm-dialog h3, .confirm-dialog p { color: var(--ink); }
.recon-grid, .comparison-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.mini-console.light { background: white; color: var(--ink); }
.mini-console.light h3, .mini-console.light li, .mini-console.light p { color: var(--ink); }
.mini-console ul, .mini-console ol { margin: 0; padding-left: 1.1rem; }
.check { display: inline-grid; place-items: center; width: 1rem; height: 1rem; margin-right: 0.35rem; border: 1px solid var(--line); border-radius: 50%; }
.check.done { background: var(--accent); border-color: var(--accent); }
.check.done::after { content: "v"; color: white; font-size: 0.7rem; font-weight: 900; }
.video-panes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.video-pane { border: 1px solid #314345; border-radius: var(--radius); padding: 1rem; background: var(--dark-2); }
.video-pane span { display: block; margin-bottom: 0.75rem; font-weight: 850; }
.frame-art { aspect-ratio: 16 / 9; border-radius: var(--radius-small); background: linear-gradient(135deg, #273638, #0f766e); }
.frame-b { background: linear-gradient(135deg, #273638, #9a4f2f); }
.difference-timeline { position: relative; min-height: 62px; margin: 1rem 0; border: 1px solid #314345; border-radius: var(--radius); background: #0b1112; }
.difference-timeline::before { content: ""; position: absolute; left: 1rem; right: 1rem; top: 50%; height: 3px; background: #314345; }
.difference-timeline button { position: absolute; left: var(--start); top: 17px; width: var(--width); min-height: 30px; border: 0; border-radius: var(--radius-small); background: var(--gold); color: #101719; font-size: 0.75rem; font-weight: 850; cursor: pointer; overflow: hidden; }
.difference-timeline button.is-active { background: var(--accent-soft); }
.screenshot-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.screenshot-strip span { display: block; aspect-ratio: 16 / 9; border-radius: var(--radius-small); background: #d7ddd9; }
.oped-layout, .calendar-layout, .resume-layout { display: grid; grid-template-columns: minmax(220px, 0.32fr) minmax(0, 1fr); gap: 1rem; margin-top: 1rem; }
.episode-list { display: grid; align-content: start; gap: 0.5rem; border: 1px solid #314345; border-radius: var(--radius); padding: 1rem; background: var(--dark-2); }
.episode-list button { min-height: 40px; border: 1px solid #314345; border-radius: var(--radius-small); background: #101719; color: #d9e8e3; text-align: left; padding: 0.5rem; }
.episode-list button.active { background: var(--accent); color: white; }
.waveform-card { min-width: 0; }
.waveform { position: relative; height: 180px; border: 1px solid #314345; border-radius: var(--radius); background: repeating-linear-gradient(90deg, #142123 0 10px, #182b2d 10px 18px); overflow: hidden; }
.waveform::after { content: ""; position: absolute; inset: 35px 0; background: linear-gradient(90deg, transparent, rgba(217,239,235,0.8), transparent, rgba(181,139,43,0.75), transparent); clip-path: polygon(0 50%, 5% 42%, 10% 61%, 15% 35%, 20% 68%, 26% 45%, 33% 58%, 40% 31%, 48% 64%, 56% 46%, 64% 70%, 72% 38%, 80% 55%, 90% 44%, 100% 50%); }
.candidate { position: absolute; top: 0; bottom: 0; border: 2px solid var(--gold); background: rgba(181,139,43,0.16); }
.candidate.op { left: 11%; width: 13%; }
.candidate.ed { right: 9%; width: 15%; border-color: var(--accent); background: rgba(15,118,110,0.16); }
.signal-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin-top: 0.75rem; }
.signal-grid div { border: 1px solid #314345; border-radius: var(--radius-small); padding: 0.75rem; background: var(--dark-2); }
.signal-grid strong, .signal-grid span, .signal-grid small { display: block; }
.calendar-image { margin: 0; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: white; }
.calendar-image figcaption { padding: 0.65rem 0.8rem; color: var(--muted); font-size: 0.86rem; }
.permissions-matrix { min-width: 0; }
.flow-diagram { display: grid; gap: 0.7rem; }
.flow-diagram:not(.compact) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.flow-node { position: relative; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 0.85rem; font-weight: 800; min-width: 0; }
.flow-node span { display: block; margin-bottom: 0.4rem; color: var(--rust); font-family: var(--mono); font-size: 0.82rem; }
.filmstrip { display: grid; grid-template-columns: repeat(5, minmax(80px, 1fr)); gap: 0.75rem; margin: 1rem 0; overflow-x: auto; }
.frame { display: grid; place-items: center; aspect-ratio: 4 / 5; border-radius: var(--radius); border: 2px solid #314345; background: #1b2b2d; color: white; font-weight: 850; }
.frame.selected { border-color: var(--accent); background: #123a38; }
.frame.rejected { border-color: var(--rust); opacity: 0.72; }
.impact-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.impact-strip div { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 1rem; }
.impact-strip strong { display: block; margin-top: 0.25rem; }
.case-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 3rem); }
.case-aside { position: sticky; top: 96px; align-self: start; }
.case-aside nav { display: grid; gap: 0.3rem; border-left: 2px solid var(--line); padding-left: 1rem; }
.case-aside a { color: var(--muted); text-decoration: none; font-weight: 800; }
.case-section { padding: 2rem 0; border-bottom: 1px solid var(--line); }
.case-section:first-child { padding-top: 0; }
.clean-list { margin: 1rem 0 0; padding-left: 1.2rem; color: var(--muted); }
.clean-list li + li { margin-top: 0.55rem; }
.workflow-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0 0; padding: 0; list-style: none; counter-reset: steps; }
.workflow-steps li { counter-increment: steps; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 0.85rem; font-weight: 760; }
.workflow-steps li::before { content: counter(steps, decimal-leading-zero); display: block; margin-bottom: 0.4rem; color: var(--rust); font-family: var(--mono); }
.resume-aside { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 1rem; align-self: start; }
.resume-main { display: grid; gap: 1rem; min-width: 0; }
.site-footer { padding: 3rem 0 1.5rem; background: var(--dark); color: #d8e5e1; }
.footer-grid { display: grid; grid-template-columns: minmax(0, 1fr) 220px 220px; gap: 2rem; }
.footer-title, .footer-heading { margin: 0 0 0.6rem; color: white; font-weight: 850; }
.site-footer a { display: block; color: #d8e5e1; text-decoration: none; margin: 0.3rem 0; }
.footer-bottom { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #2d3b3d; color: #aebbbb; font-size: 0.9rem; }
.home-hero { display: grid; gap: 3rem; padding: 5.5rem 0 3rem; }
.home-hero .hero-copy { max-width: 900px; }
.hero-work-sample { margin: 0; overflow: hidden; border: 1px solid #303334; border-radius: var(--radius); background: var(--dark); box-shadow: var(--shadow); }
.hero-work-sample img { width: 100%; aspect-ratio: 2.35 / 1; object-fit: cover; object-position: center; }
.hero-work-sample figcaption { display: flex; justify-content: space-between; gap: 1rem; padding: 0.7rem 0.9rem; color: #aebbbb; font-size: 0.78rem; font-family: var(--mono); }
.hero-work-sample figcaption strong { color: #d8e5e1; }
.section-ruled { border-block: 1px solid var(--line); background: #fbfaf7; }
.section-dark { background: var(--dark); color: #edf3f0; }
.section-dark h2, .section-dark h3 { color: white; }
.section-dark .section-kicker { color: #67c6bb; }
.section-dark .rich-text p { color: #bdc7c4; }
.section-dark .metric-card { border-color: #34393a; background: #1d2021; }
.section-dark .metric-card strong { color: white; }
.section-dark .metric-card span { color: #bdc7c4; }
.two-up, .project-index-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.project-card-link { grid-template-rows: 230px 1fr; box-shadow: none; }
.project-card-link:hover { border-color: #a9aaa5; transform: translateY(-2px); }
.project-visual { min-height: 230px; }
.project-visual-image img { width: 100%; height: 100%; object-fit: cover; }
.project-visual-image::before, .project-visual-image::after { display: none; }
.project-visual-calendar-image img { object-position: top; background: white; }
.practice-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--line); }
.practice-list article { display: grid; grid-template-columns: 44px 1fr; gap: 0.8rem; padding: 1.25rem 1rem 1.25rem 0; border-bottom: 1px solid var(--line); }
.practice-list article:nth-child(odd) { border-right: 1px solid var(--line); }
.practice-list article:nth-child(even) { padding-left: 1.25rem; }
.practice-list span { color: var(--rust); font-family: var(--mono); font-size: 0.82rem; font-weight: 800; }
.practice-list h3 { margin: 0 0 0.35rem; }
.practice-list p { margin: 0; color: var(--muted); }
.demo-state { color: #9eaaa7; font-family: var(--mono); font-size: 0.75rem; }
.standalone-demo-embed { padding: 0; overflow: hidden; }
.standalone-demo-embed > .demo-panel-header { padding: 1rem; }
.standalone-demo-frame { height: min(78vh, 820px); min-height: 680px; border-top: 1px solid #343738; background: #111312; }
.standalone-demo-frame iframe { display: block; width: 100%; height: 100%; border: 0; background: #111312; }
.reconciliation-demo-frame { height: min(82vh, 880px); }
.inventory-demo { padding: 0; overflow: hidden; }
.inventory-demo > .demo-panel-header { padding: 1rem; }
.inventory-demo-frame { height: min(78vh, 820px); min-height: 650px; border-top: 1px solid #343738; background: #111312; }
.inventory-demo-frame iframe { display: block; width: 100%; height: 100%; border: 0; background: #111312; }
.oms-stage { position: relative; display: grid; grid-template-columns: 240px minmax(0, 1fr); min-height: 620px; background: #191a1c; overflow: hidden; }
.oms-poster { position: relative; display: flex; align-items: flex-end; min-height: 620px; padding: 1.4rem; overflow: hidden; border-right: 1px solid #333537; background: #252729; }
.oms-poster::before, .oms-poster::after, .oms-geo-lines { content: ""; position: absolute; inset: -15%; background: repeating-linear-gradient(28deg, transparent 0 82px, rgba(199,101,41,0.32) 83px, transparent 84px 148px); transform: rotate(-8deg); }
.oms-poster::after { background: repeating-linear-gradient(112deg, transparent 0 105px, rgba(199,101,41,0.22) 106px, transparent 107px 176px); transform: rotate(8deg); }
.oms-poster strong { position: relative; z-index: 1; color: #f2f2ed; font-size: 2rem; line-height: 0.95; }
.oms-cms { display: flex; min-width: 0; flex-direction: column; padding: 1.7rem 22rem 1rem 1.6rem; }
.oms-episode-heading h3 { margin: 0; font-size: 1.8rem; font-weight: 500; }
.oms-episode-heading span { display: inline-block; margin-top: 0.55rem; padding: 0.2rem 0.55rem; border-radius: 2px; background: #1978c9; color: white; font-size: 0.66rem; font-weight: 800; }
.oms-season-row { display: flex; justify-content: space-between; gap: 1rem; margin: 1rem 0 0.7rem; padding: 0.65rem 0.8rem; border: 1px solid #4c3b31; background: #27282a; color: #d7d7d3; }
.oms-season-row small { color: #999d9f; }
.oms-episode-list { display: grid; gap: 0.4rem; }
.oms-episode-list span { padding: 0.62rem 0.8rem; border: 1px solid #353739; background: #232527; color: #b8bbbc; }
.oms-episode-list .active { border-color: var(--rust); background: #3a291f; color: #f1c6a8; }
.oms-tabs { display: flex; gap: 1.2rem; margin-top: auto; border-bottom: 1px solid #333638; color: #7f8384; font-size: 0.68rem; text-transform: uppercase; }
.oms-tabs span, .oms-tabs strong { padding: 0.7rem 0.2rem; }
.oms-tabs strong { border-bottom: 2px solid var(--rust); color: #ee9a63; }
.oms-inventory-controls { display: grid; grid-template-columns: minmax(150px, 1fr) repeat(3, minmax(95px, 0.5fr)); gap: 0.5rem; align-items: end; padding-top: 0.9rem; }
.oms-inventory-controls label { display: grid; gap: 0.25rem; color: #969b9c; font-size: 0.68rem; }
.oms-inventory-controls input, .oms-inventory-controls select { min-height: 36px; border-color: #3a3d3e; background: #111314; color: #ecefeb; font-size: 0.72rem; }
.oms-reset { grid-column: 1 / -1; min-height: 32px; border: 1px solid #424647; background: transparent; color: #b9bdbc; cursor: pointer; }
.oms-overlay { position: absolute; z-index: 2; top: 2rem; right: 1.1rem; display: flex; flex-direction: column; width: min(410px, 38%); height: 548px; border: 1px solid #3ccf78; background: #101211; color: #dce6df; box-shadow: 0 16px 45px rgba(0,0,0,0.45); }
.oms-overlay-title { display: flex; justify-content: space-between; gap: 1rem; padding: 0.7rem 0.8rem; border-bottom: 1px solid #28302b; color: #5ee08f; font-family: var(--mono); font-size: 0.68rem; }
.oms-overlay-title span { color: #c7ccc9; }
.oms-hydrate, .oms-review { min-height: 38px; margin: 0.65rem; border: 0; background: #196c63; color: white; font-size: 0.7rem; font-weight: 850; cursor: pointer; }
.oms-review { margin-top: 0; background: #2f873c; }
.oms-progress { height: 4px; margin: 0 0.65rem 0.55rem; background: #25312b; }
.oms-progress span { display: block; width: 100%; height: 100%; background: #42d87d; }
.oms-overlay-log { min-height: 45px; padding: 0.55rem 0.7rem; border-block: 1px solid #272c29; color: #9aa39d; font-family: var(--mono); font-size: 0.64rem; }
.oms-file-list { flex: 1; min-height: 0; overflow: auto; }
.oms-file-list table { min-width: 0; font-size: 0.65rem; }
.oms-file-list th, .oms-file-list td { padding: 0.35rem 0.4rem; border-color: #262a28; }
.oms-file-list th { position: sticky; top: 0; z-index: 1; background: #171a18; color: #89928d; }
.oms-file-list td code { padding: 0; background: transparent; color: #d3d9d5; font-size: 0.62rem; }
.oms-file-list .status-badge { padding: 0.15rem 0.3rem; border-radius: 2px; background: #2f873c; color: white; font-size: 0.58rem; text-transform: uppercase; }
.oms-file-list .queue-toggle { min-height: 25px; padding: 0.15rem 0.3rem; border-radius: 2px; font-size: 0.58rem; }
.oms-queue { display: grid; grid-template-columns: auto 1fr; gap: 0.6rem; align-items: center; min-height: 48px; padding: 0.45rem 0.7rem; border-top: 1px solid #292e2b; font-size: 0.65rem; }
.oms-queue div { display: grid; }
.oms-queue small { color: #89928d; }
.oms-queue ol { display: flex; gap: 0.4rem; min-width: 0; margin: 0; padding: 0; list-style: none; overflow: hidden; }
.oms-queue li { min-width: 0; color: #a8b0ab; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.oms-queue li code { padding: 0; background: transparent; color: inherit; font-size: 0.6rem; }
.inventory-impact { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #343738; }
.inventory-impact div { padding: 1rem; border-right: 1px solid #343738; }
.inventory-impact div:last-child { border-right: 0; }
.inventory-impact strong, .inventory-impact span { display: block; }
.inventory-impact strong { color: white; }
.inventory-impact span { margin-top: 0.2rem; color: #9fa9a6; font-size: 0.78rem; }
.vmaf-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 1rem; border: 1px solid #343a3b; }
.vmaf-summary div { padding: 0.8rem; border-right: 1px solid #343a3b; }
.vmaf-summary div:last-child { border-right: 0; }
.vmaf-summary span, .vmaf-summary strong { display: block; }
.vmaf-summary span { color: #96a09d; font-size: 0.72rem; text-transform: uppercase; }
.vmaf-summary strong { margin-top: 0.25rem; color: white; font-family: var(--mono); }
.video-pane { margin: 0; }
.video-pane figcaption { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
.video-pane figcaption span { margin: 0; }
.frame-art { position: relative; overflow: hidden; background: linear-gradient(#253336 0 46%, #182122 46% 100%); }
.frame-art::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 49.7%, rgba(255,255,255,0.09) 50%, transparent 50.3%), linear-gradient(transparent 49.7%, rgba(255,255,255,0.09) 50%, transparent 50.3%); }
.frame-art span { position: absolute; display: block; margin: 0; }
.frame-horizon { left: 0; right: 0; top: 45%; height: 2px; background: #647476; }
.frame-subject { left: 28%; bottom: 18%; width: 18%; aspect-ratio: 0.72; border-radius: 45% 45% 18% 18%; background: #d9b17a; box-shadow: 0 -38px 0 -19px #d9b17a; }
.frame-monitor { right: 15%; bottom: 22%; width: 23%; height: 30%; border: 5px solid #48585a; background: #0f1718; }
.frame-art b { position: absolute; left: 0.65rem; top: 0.6rem; padding: 0.2rem 0.35rem; background: rgba(10,12,12,0.8); color: #d8e2df; font-family: var(--mono); font-size: 0.65rem; }
.frame-b { background: linear-gradient(#2d3535 0 46%, #211d1b 46% 100%); }
.frame-b .frame-subject { left: 31%; filter: saturate(0.7); }
.difference-box { left: 25% !important; bottom: 12%; width: 27%; height: 66%; border: 2px solid #f4a54f; color: #f4c08a; font-family: var(--mono); font-size: 0.6rem; padding: 0.2rem; }
.screenshot-strip span { border: 1px solid #455052; background: linear-gradient(150deg, #2d3a3c 0 48%, #162021 48%); }
.screenshot-strip .sample-two { background: linear-gradient(30deg, #382c26 0 48%, #1b2223 48%); }
.screenshot-strip .sample-three { background: linear-gradient(90deg, #172021 0 40%, #8a5b3a 40% 48%, #1f292a 48%); }
.code-disclosure { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.code-disclosure summary { padding: 0.9rem 1rem; color: var(--accent-dark); font-weight: 850; cursor: pointer; }
.code-disclosure h2 { padding: 1rem 1rem 0; font-size: 1.35rem; }
.code-disclosure pre { margin: 1rem; }
.resume-sheet { max-width: 900px; }
.resume-section { padding: 2rem 0; border-bottom: 1px solid var(--line); }
.resume-section:first-child { padding-top: 0; }
.resume-section h2 { font-size: 1.75rem; }
.resume-section p { color: var(--muted); }
.footer-main { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-start; }
.footer-main p { max-width: 600px; margin: 0; color: #aebbbb; }
.footer-main a { margin: 0; font-weight: 800; }
.reveal { opacity: 0; transform: translateY(12px); transition: opacity 420ms ease, transform 420ms ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
@media (max-width: 980px) {
  .hero-grid, .split-section, .case-layout, .oped-layout, .calendar-layout, .resume-layout { grid-template-columns: 1fr; }
  .three-up, .project-index-grid, .capability-grid, .process-grid, .metadata-grid, .workflow-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .case-aside { position: static; }
  .demo-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .demo-split, .recon-grid, .comparison-grid, .video-panes, .impact-strip, .metric-grid, .history-grid, .contact-grid, .footer-grid { grid-template-columns: 1fr; }
  .oms-stage { grid-template-columns: 190px minmax(0, 1fr); }
  .oms-poster { min-height: 430px; }
  .oms-cms { min-height: 430px; padding-right: 1.6rem; }
  .oms-overlay { position: relative; top: auto; right: auto; grid-column: 1 / -1; width: auto; height: 520px; margin: 1rem; }
  .vmaf-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .vmaf-summary div:nth-child(2) { border-right: 0; }
  .vmaf-summary div:nth-child(-n + 2) { border-bottom: 1px solid #343a3b; }
}
@media (max-width: 720px) {
  .nav-toggle { display: block; }
  .nav-links { position: absolute; top: 74px; left: 1rem; right: 1rem; display: none; flex-direction: column; align-items: stretch; padding: 0.6rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
  .nav-links.is-open { display: flex; }
  .brand-copy small { display: none; }
  .shell { width: min(100% - 2rem, 1200px); }
  .hero h1 { font-size: 3rem; }
  .page-hero h1 { font-size: 2.55rem; }
  .hero-title { font-size: 1.55rem; }
  h2 { font-size: 1.9rem; }
  .home-hero { gap: 2rem; padding: 3.75rem 0 2.25rem; }
  .hero-work-sample img { aspect-ratio: 16 / 9; }
  .hero-work-sample figcaption { flex-direction: column; gap: 0.15rem; }
  .section { padding: 3rem 0; }
  .two-up, .three-up, .project-index-grid, .capability-grid, .process-grid, .metadata-grid, .workflow-steps, .inventory-stats, .signal-grid, .practice-list, .inventory-impact { grid-template-columns: 1fr; }
  .practice-list article, .practice-list article:nth-child(even) { padding: 1rem 0; border-right: 0; }
  .project-card-link { grid-template-rows: 180px 1fr; }
  .project-visual { min-height: 180px; }
  .demo-controls { grid-template-columns: 1fr; }
  .footer-main, .footer-bottom { flex-direction: column; }
  .flow-diagram:not(.compact) { grid-template-columns: 1fr; }
  .oms-stage { grid-template-columns: 1fr; }
  .oms-poster { min-height: 210px; }
  .oms-cms { min-height: 500px; padding: 1.25rem; }
  .oms-inventory-controls { grid-template-columns: 1fr 1fr; }
  .oms-search { grid-column: 1 / -1; }
  .oms-overlay { grid-column: 1; height: 520px; margin: 0.75rem; }
  .inventory-demo > .demo-panel-header { align-items: flex-start; flex-direction: column; }
  .standalone-demo-embed > .demo-panel-header { align-items: flex-start; flex-direction: column; }
  .standalone-demo-frame { height: 820px; min-height: 0; }
  .reconciliation-demo-frame { height: 980px; }
  .inventory-demo-frame { height: 780px; min-height: 0; }
  .inventory-impact div { border-right: 0; border-bottom: 1px solid #343738; }
  .inventory-impact div:last-child { border-bottom: 0; }
  .vmaf-summary { grid-template-columns: 1fr 1fr; }
  .video-pane figcaption { align-items: flex-start; flex-direction: column; gap: 0.25rem; }
  .code-disclosure pre { margin: 0.75rem; }
  table { min-width: 0; table-layout: fixed; }
  th, td { padding: 0.55rem; overflow-wrap: anywhere; word-break: break-word; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
}`;

const js = `const inventoryAssets = ${JSON.stringify(inventoryFixture, null, 2)};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

function setupInventoryDemo(root) {
  let loadedCount = 6;
  const selected = new Set();
  const rows = root.querySelector("[data-inventory-rows]");
  const queue = root.querySelector("[data-inventory-queue]");
  const search = root.querySelector("[data-inventory-search]");
  const mode = root.querySelector("[data-inventory-mode]");
  const classFilter = root.querySelector("[data-inventory-class]");
  const localeFilter = root.querySelector("[data-inventory-locale]");
  const loaded = root.querySelector("[data-inventory-loaded]");
  const visible = root.querySelector("[data-inventory-visible]");
  const selectedCount = root.querySelector("[data-inventory-selected]");
  const log = root.querySelector("[data-inventory-log]");
  const modal = root.querySelector("[data-inventory-modal]");

  function matches(asset) {
    const query = search.value.trim();
    const classValue = classFilter.value;
    const localeValue = localeFilter.value;

    if (classValue !== "all" && asset.class !== classValue) return false;
    if (localeValue !== "all" && asset.locale !== localeValue) return false;
    if (!query) return true;

    if (mode.value === "exact") return asset.fileName.toLowerCase() === query.toLowerCase();
    if (mode.value === "regex") {
      try {
        return new RegExp(query, "i").test(asset.fileName);
      } catch {
        return false;
      }
    }

    return query.toLowerCase().split(/\\s+/).every((part) => asset.fileName.toLowerCase().includes(part));
  }

  function renderQueue() {
    selectedCount.textContent = String(selected.size);
    queue.innerHTML = Array.from(selected).map((id) => {
      const asset = inventoryAssets.find((item) => item.id === id);
      return asset ? '<li><code>' + asset.fileName + '</code></li>' : "";
    }).join("") || "<li>No files queued.</li>";
  }

  function render() {
    const assets = inventoryAssets.slice(0, loadedCount);
    const filtered = assets.filter(matches);
    rows.innerHTML = filtered.map((asset) => {
      const queued = selected.has(asset.id);
      const label = queued ? "In" : "Add";
      return '<tr><td><button class="queue-toggle" type="button" data-queue-id="' + asset.id + '" aria-pressed="' + String(queued) + '">' + label + '</button></td><td><span class="status-badge">' + asset.class + '</span></td><td><code>' + asset.fileName + '</code></td><td>' + asset.locale + '</td></tr>';
    }).join("");
    loaded.textContent = String(loadedCount);
    visible.textContent = String(filtered.length);
    renderQueue();
  }

  rows.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-queue-id]");
    if (!button) return;
    const id = button.getAttribute("data-queue-id");
    if (!id) return;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    render();
  });

  [search, mode, classFilter, localeFilter].forEach((control) => control.addEventListener("input", render));

  root.querySelector("[data-inventory-hydrate]").addEventListener("click", () => {
    loadedCount = inventoryAssets.length;
    log.textContent = "Hydrated virtualized inventory until row count stabilized. Listed " + loadedCount + " fictional assets.";
    render();
  });

  root.querySelector("[data-inventory-clear]").addEventListener("click", () => {
    search.value = "";
    mode.value = "and";
    classFilter.value = "all";
    localeFilter.value = "all";
    selected.clear();
    log.textContent = "Filters reset.";
    render();
  });

  root.querySelector("[data-inventory-open-modal]").addEventListener("click", () => {
    if (!selected.size) {
      log.textContent = "Select at least one file before reviewing a simulated action.";
      return;
    }
    modal.hidden = false;
  });

  root.querySelector("[data-inventory-cancel]").addEventListener("click", () => {
    modal.hidden = true;
  });

  root.querySelector("[data-inventory-confirm]").addEventListener("click", () => {
    log.textContent = "Simulated review complete for " + selected.size + " queued file(s). No files were deleted.";
    selected.clear();
    modal.hidden = true;
    render();
  });

  render();
}

document.querySelectorAll("[data-inventory-demo]").forEach(setupInventoryDemo);

document.querySelectorAll("[data-reconciliation-demo]").forEach((root) => {
  const run = root.querySelector("[data-recon-run]");
  const activity = root.querySelector("[data-recon-activity]");
  const log = root.querySelector("[data-recon-log]");
  run.addEventListener("click", () => {
    activity.innerHTML = [
      "Read 3 unchecked tracker requirements.",
      "Opened authenticated ingest interface with Puppeteer.",
      "Searched ALP-204 and collected candidates.",
      "Verified DONE status for en-US subtitle and ja-JP dub.",
      "Stopped pt-BR forced narrative row for manual review."
    ].map((item) => "<li>" + item + "</li>").join("");

    root.querySelectorAll(".check").forEach((check, index) => {
      check.classList.toggle("done", index < 2);
      check.classList.toggle("empty", index >= 2);
    });

    log.textContent = "2 fields updated from unchecked to checked. 1 row routed to manual review because multiple candidates matched.";
  });
});

document.querySelectorAll("[data-video-demo]").forEach((root) => {
  const output = root.querySelector("[data-diff-output]");
  root.querySelectorAll("[data-diff-range]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-diff-range]").forEach((node) => node.classList.remove("is-active"));
      button.classList.add("is-active");
      output.textContent = button.getAttribute("data-diff-range") + " selected for screenshot and report review.";
    });
  });

  const exportButton = root.querySelector("[data-report-export]");
  exportButton.addEventListener("click", () => {
    output.textContent = "Simulated report export: metadata, detected ranges, screenshots and audio-offset notes prepared for human review.";
  });
});

document.querySelectorAll("[data-oped-demo]").forEach((root) => {
  root.querySelector("[data-oped-approve]").addEventListener("click", () => {
    root.querySelector("[data-oped-status]").textContent = "Approved in demo";
    root.querySelector("[data-oped-table-status]").textContent = "Human approved";
  });
});

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionAllowed && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".project-card, .practice-list article, .metric-card, .demo-panel, .case-section").forEach((node) => {
    node.classList.add("reveal");
    observer.observe(node);
  });
}`;

const readme = `# Ali Aslam Portfolio

Static GitHub Pages portfolio for Ali Aslam, focused on media operations systems, creative production, production workflow design, browser automation, media asset management and AI-assisted workflow experimentation.

The portfolio uses plain HTML, CSS and vanilla JavaScript. There is no framework, backend, package install or required build step. The optional generator in \`scripts/generate-portfolio.mjs\` rebuilds the static pages from shared project data.

Repository reference: <https://github.com/Ali1128/ali-aslam-portfolio>

## Project List

- Season-Level Media Inventory Operations Console
- Browser-Side File Linking Search and Inventory Hydration
- Ingest Status Reconciliation and Airtable Readiness Automation
- Automated Video Version Comparison and Difference Reporter
- Dataset-Assisted Opening and Ending Timestamp Detection
- Live Multi-Studio Schedule and Calendar Platform
- AI-Assisted Instructional Keyframe Selection

## File Structure

\`\`\`text
.
├── index.html
├── projects.html
├── about.html
├── resume.html
├── styles.css
├── script.js
├── projects/
│   ├── media-inventory-console/
│   ├── file-linking-search/
│   ├── asset-reconciliation/
│   ├── video-version-comparison/
│   ├── op-ed-detection/
│   ├── ktaekwondo-calendar/
│   └── ktaekwondo-keyframes/
├── assets/
│   ├── data/
│   ├── code/
│   ├── images/
│   └── operations-overlay-portfolio-mockup.html
├── docs/
├── demos/
└── scripts/
\`\`\`

Older draft project pages may remain in \`projects/*.html\` while the public navigation uses the route folders above.

## Run Locally

Open \`index.html\` directly, or run a static server:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Then open <http://localhost:8000>.

## Mock Demos

The interactive demos are public reconstructions with fictional internal-tool data. They demonstrate UI behavior, workflow logic, safeguards and review states without exposing private systems.

- Inventory demo data is embedded in \`script.js\` and mirrored in \`assets/data/demo-inventory.json\`.
- Reconciliation fixture rows are mirrored in \`assets/data/reconciliation-fixtures.json\`.
- Sanitized code examples are collected in \`assets/code/sanitized-excerpts.md\`.
- K-Taekwondo uses authorized public project details and public calendar imagery only.

## Add Or Update A Project

1. Update the project object in \`scripts/generate-portfolio.mjs\`.
2. Run \`node scripts/generate-portfolio.mjs\`.
3. Review the generated page under \`projects/<slug>/index.html\`.
4. Test links, responsive layout and demo interactions.

## Public Links

The portfolio intentionally includes no public email address, LinkedIn link or PDF resume. The simple web and plain-text resume versions contain no contact details.

## Deployment

This repo is GitHub Pages compatible. Commit the static files and configure Pages to serve the repository root from the selected branch.

## Privacy And Sanitization

Do not commit credentials, browser session files, private screenshots, private API details, employee data, unreleased title information, private Airtable identifiers, Cloudflare configuration or private Softr settings. Use \`reference-private/\` locally for non-public source material; it is ignored by Git.

See \`docs/privacy-and-sanitization.md\` and \`SECURITY.md\`.

## AI Collaboration Disclosure

Gemini and Codex supported iterative development, debugging, interface prototyping and code refinement. Ali defined the production problems, workflow architecture, domain logic, validation requirements and operational testing.`;

const security = `# Security Notes

This repository is intended to contain only public portfolio material.

Do not commit:

- Credentials or private environment files
- Browser session exports, cookies or HAR captures
- Private API details or admin URLs
- Private screenshots from employer systems
- Employee names, private emails or unreleased title information
- Private Airtable identifiers, Cloudflare configuration or Softr settings

Use \`reference-private/\` for local-only research material. That folder is ignored by Git.

If a private value is accidentally committed, remove it from the repository history before publishing and rotate the affected credential or configuration outside this repo.`;

const privacyDoc = `# Privacy And Sanitization

This portfolio separates public evidence from private source material.

## Public Material

- Fictional internal-tool titles, IDs, filenames and fixture data
- Reconstructed HTML demos showing workflow behavior
- Sanitized illustrative code excerpts
- Authorized public K-Taekwondo branding, public page link and public calendar imagery

## Private Material Excluded

- Employer source code and private selectors
- Browser session data, cookies and HAR files
- Private API details or admin URLs
- Private Airtable, Cloudflare or Softr configuration
- Employee names, private user emails and unreleased content information
- Screenshots that expose private domains or production-only browser state

## Case Study Language

Each project page labels whether the work was production-facing, working automation, experimental or publicly reconstructed. Reconstructed examples are not presented as exact private production implementations.`;

const envExample = `# This static portfolio does not require runtime environment variables.
# Keep private credentials out of this repository.

PUBLIC_PORTFOLIO_URL=
PUBLIC_KTAEKWONDO_TEST_URL=https://www.k-taekwondo.com/test
`;

const gitignore = `.DS_Store

# Logs and local diagnostics
logs/
*.log
coverage/
.nyc_output/

# Dependencies and generated caches
node_modules/
.cache/
.parcel-cache/
.vite/
dist/
out/

# Environment and private configuration
.env
.env.*
!.env.example

# Private reference material
reference-private/
private/
downloads-private/
secrets/
*.har
*.cookies.json
*.session.json

# Editor state
.vscode/
.idea/`;

const excerpts = `# Sanitized Code Excerpts

These excerpts are illustrative public versions. They are not private production source code.

## Inventory Hydration

\`\`\`js
async function hydrateInventory(scrollArea, readRows) {
  let previousCount = 0;
  let stablePasses = 0;

  while (stablePasses < 3) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
    await waitForIdleFrame();

    const rows = readRows();
    stablePasses = rows.length === previousCount ? stablePasses + 1 : 0;
    previousCount = rows.length;
  }

  return classifyRows(readRows()).filter((row) => row.fileName);
}
\`\`\`

## Readiness Update Guard

\`\`\`js
if (!requirement.readinessChecked && matches.length === 1) {
  await tracker.markReady(requirement.rowId, requirement.readinessField);
}
\`\`\`

## Keyframe Similarity

\`\`\`js
const distance = cosineDistance(previousEmbedding, currentEmbedding);
const shouldSave = distance > threshold;
\`\`\`
`;

const demosReadme = `# Demos

Standalone demos are self-contained and GitHub Pages compatible.

- media-inventory-console/index.html: sanitized interactive reconstruction of a season-level media inventory overlay.
- file-linking-search/index.html: sanitized reconstruction of a hydrated search layer inside a file-linking modal.
- asset-status-reconciliation/index.html: sanitized reconstruction of browser-based ingest verification and scoped tracker updates.

All titles, filenames, paths, IDs, people and workflow records are fictional. No private selectors, credentials, cookies, tokens or session identifiers are included.`;

write("index.html", homePage());
write("projects.html", projectsPage());
write("about.html", aboutPage());
write("resume.html", resumePage());
write("styles.css", css);
write("script.js", js);
write("README.md", readme);
write(".gitignore", gitignore);
write(".env.example", envExample);
write("SECURITY.md", security);
write("docs/privacy-and-sanitization.md", privacyDoc);
write("demos/README.md", demosReadme);
write("assets/data/demo-inventory.json", JSON.stringify(inventoryFixture, null, 2));
write("assets/data/reconciliation-fixtures.json", JSON.stringify(reconFixture, null, 2));
write("assets/code/sanitized-excerpts.md", excerpts);

for (const project of projects) {
  write(`projects/${project.slug}/index.html`, renderProjectPage(project));
}

console.log(`Generated ${projects.length} project case studies and shared site files.`);
