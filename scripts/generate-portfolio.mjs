import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const GENERATED_HTML = new Set();

const contact = {
  github: "https://github.com/Ali1128/ali-aslam-portfolio",
  linkedin: "https://www.linkedin.com/in/aliaslam2/",
  resumeText: "docs/resume.txt"
};

function write(relativePath, content) {
  const target = join(ROOT, relativePath);
  const normalized = content
    .trim()
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${normalized}\n`);
  if (extname(target) === ".html") GENERATED_HTML.add(target);
}

function copyRequired(sourcePath, outputPath) {
  const source = join(ROOT, sourcePath);
  const output = join(ROOT, outputPath);

  if (!existsSync(source)) {
    throw new Error(`Required source asset is missing: ${sourcePath}`);
  }

  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(source, output);
  if (extname(output) === ".html") GENERATED_HTML.add(output);
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
    title: "Media Inventory Operations Console",
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
    supportingModuleFor: "media-inventory-console",
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
    title: "Asset Status Reconciliation",
    shortTitle: "Asset Reconciliation",
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
    title: "VMAF Video Quality Check",
    shortTitle: "Video Quality Check",
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
    title: "Anime OP/ED Timecodes",
    shortTitle: "OP/ED Timecodes",
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
    title: "K-Taekwondo Calendar Operations",
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
    visual: "Sanitized Softr-style operations dashboard and public calendar preview",
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
      "The public page uses the supplied annotated instructional images; candidate scores in the interface remain fictional demonstration values."
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
      "Only the supplied instructional stills are shown; source video and private processing material are not included."
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

const publicProjects = projects.filter((project) => !project.supportingModuleFor);
const fileLinkingModule = projects.find((project) => project.slug === "file-linking-search");

const employment = [
  {
    company: "Crunchyroll",
    role: "Media Operations",
    dates: "April 2024 - January 2026",
    bullets: [
      "Coordinated release-critical video, audio, timed-text, localization, metadata and partner-distribution assets across simulcast, catalog and home-video workflows.",
      "Tracked ingest status, missing deliverables, version changes and release blockers across Airtable, Jira, Aspera, cloud storage and internal media systems.",
      "Built operator-facing browser tools and documented workflows for inventory review, file linking and readiness reconciliation."
    ]
  },
  {
    company: "The Mill",
    role: "VFX Coordinator",
    dates: "November 2021 - March 2023",
    bullets: [
      "Coordinated artists, vendors, reviews, approvals and final assets for campaigns spanning broadcast, social and digital delivery.",
      "Tracked capacity, schedules, budgets, purchase orders, invoices and blockers while supporting producers and cross-functional creative teams.",
      "Helped establish a company-wide legal-clearance workflow for production assets."
    ]
  },
  {
    company: "The Third Floor",
    role: "VFX Production Coordinator",
    dates: "January 2021 - August 2021",
    bullets: [
      "Coordinated previs and postvis workflows for film and game projects across remote VFX teams.",
      "Managed artist onboarding, task assignments, shot status, review notes, 3D assets and file integrity in ShotGrid.",
      "Built custom tracking views that improved daily production visibility and review preparation."
    ]
  },
  {
    company: "JK Moodo",
    role: "Video Creative & Editor",
    dates: "March 2017 - November 2021",
    bullets: [
      "Produced and edited branded video for film and athletic studio divisions across web, YouTube and social platforms, managing briefs, shoots, schedules, approvals and delivery.",
      "Built and coordinated a freelance network of cinematographers, editors and animators while tracking feedback, budgets and deliverables across concurrent projects."
    ]
  }
];

const resumeTools = [
  "ShotGrid",
  "Ftrack",
  "Airtable",
  "Jira",
  "Asana",
  "Google Workspace",
  "Microsoft Office",
  "Aspera",
  "AWS/S3",
  "Google Cloud",
  "JavaScript",
  "Puppeteer",
  "Python",
  "FFmpeg",
  "OpenCV",
  "Adobe Creative Cloud",
  "Gemini",
  "Codex",
  "Claude Code"
];

const resumeLanguages = ["English", "Urdu", "Punjabi", "Hindi"];

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
    ["projects", "Work", "index.html#work"],
    ["about", "About", "about.html"],
    ["resume", "Resume", contact.resumeText]
  ];

  return `<header class="site-header" data-site-header>
    <nav class="nav shell" aria-label="Primary navigation">
      <a class="brand" href="${prefix}index.html" aria-label="Ali Aslam home">
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
        <span class="nav-contact-actions" aria-label="Professional links">
          <a class="nav-action" href="${contact.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="nav-action" href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </span>
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
      <nav class="footer-links" aria-label="Professional links">
        <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="${contact.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </div>
    <div class="shell footer-bottom">
      <span>&copy; <span data-current-year></span> Ali Aslam.</span>
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
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="${prefix}styles.css?v=stage2-20260716f">
    <script src="${prefix}script.js?v=stage2-20260716f" defer></script>
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

function projectStaticPreview(project, prefix = "", compact = false) {
  const modifier = compact ? " is-compact" : "";

  if (project.demo === "inventory") {
    return `<span class="project-visual project-visual-image project-preview${modifier}">
      <img src="${prefix}assets/images/media-inventory-overlay-sanitized.jpeg" alt="Sanitized media inventory overlay interface">
    </span>`;
  }

  if (project.demo === "reconciliation") {
    return `<span class="project-visual project-preview preview-reconciliation${modifier}" role="img" aria-label="Airtable requirements, browser automation and completed ingest verification">
      <span class="preview-column preview-requirements"><b>Airtable</b><i>RIVS01007</i><i>EN-US / SCC</i><em>Unchecked</em></span>
      <span class="preview-column preview-automation"><b>Puppeteer</b><i>Hydrate rows</i><i>Exact match</i><em>DONE verified</em></span>
      <span class="preview-column preview-results"><b>Tracker</b><i>One candidate</i><i>Guard passed</i><em>Updated</em></span>
    </span>`;
  }

  if (project.demo === "video") {
    return `<span class="project-visual project-visual-image project-preview${modifier}">
      <img src="${prefix}assets/images/vmaf-anime-comparison.png" alt="Original anime-style reference and compressed-frame quality comparison">
    </span>`;
  }

  if (project.demo === "oped") {
    return `<span class="project-visual project-visual-image project-preview${modifier}">
      <img src="${prefix}assets/images/op-ed-anime-sequence.png" alt="Three original anime-style frames representing recap, opening and ending sequences">
    </span>`;
  }

  if (project.demo === "calendar") {
    return `<span class="project-visual project-visual-image project-visual-calendar-image project-preview${modifier}">
      <img src="${prefix}assets/images/ktaekwondo-calendar-dashboard.png" alt="Sanitized Softr-style calendar operations dashboard and public preview">
    </span>`;
  }

  if (project.demo === "keyframes") {
    return `<span class="project-visual project-visual-image project-visual-keyframe-image project-preview${modifier}">
      <img src="${prefix}assets/images/ktaekwondo-keyframe-03.jpg" alt="Annotated Taekwondo instructional keyframe">
    </span>`;
  }

  return `<span class="project-visual project-preview${modifier}" aria-hidden="true"></span>`;
}

function projectCard(project, prefix = "") {
  return `<article class="project-card">
    <a class="project-card-link" href="${prefix}projects/${project.slug}/index.html">
      ${projectStaticPreview(project, prefix)}
      <span class="project-card-body">
        ${statusBadge(project.status)}
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.purpose)}</p>
        <strong>${escapeHtml(project.result)}</strong>
        ${tagList(project.technologies.slice(0, 4))}
        <span class="card-case-link">View case study <span aria-hidden="true">&rarr;</span></span>
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

function subsectionList(title, items) {
  return `<div class="case-subsection"><h3>${escapeHtml(title)}</h3><ul class="clean-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function disclosureBlock(title, items, id = "") {
  return `<section class="case-section disclosure-section"${id ? ` id="${id}"` : ""}>
    <details class="case-disclosure">
      <summary>${escapeHtml(title)}</summary>
      <div class="disclosure-body"><ul class="clean-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
    </details>
  </section>`;
}

function supportingModuleBlock() {
  const module = fileLinkingModule;
  if (!module) return "";

  return `<section class="case-section supporting-module" id="file-linking-module">
    <details class="case-disclosure module-disclosure">
      <summary>Earlier iteration: ${escapeHtml(module.title)}</summary>
      <div class="disclosure-body">
        <p class="module-purpose">${escapeHtml(module.purpose)}</p>
        ${linkingDemo()}
        <dl class="metadata-grid module-metadata">
          <div><dt>Status</dt><dd>${escapeHtml(module.status)}</dd></div>
          <div><dt>Role</dt><dd>${escapeHtml(module.role)}</dd></div>
          <div><dt>Scale</dt><dd>${escapeHtml(module.scale)}</dd></div>
          <div><dt>Tools</dt><dd>${escapeHtml(module.technologies.join(", "))}</dd></div>
        </dl>
        ${subsectionList("Problem", module.problem)}
        ${subsectionList("Constraints", module.constraints)}
        ${subsectionList("My contribution", module.approach)}
        <div class="case-subsection"><h3>Architecture</h3>${architectureFlow(module)}</div>
        <div class="case-subsection"><h3>Workflow</h3>${workflowSteps(module)}</div>
        ${subsectionList("Implementation notes", module.details)}
        ${subsectionList("Safeguards", module.safeguards)}
        ${subsectionList("Testing", module.testing)}
        ${subsectionList("Results", module.results)}
        ${subsectionList("Limitations", module.limitations)}
        ${subsectionList("Learnings", module.learned)}
        ${subsectionList("Next iteration", module.next)}
        <div class="case-subsection"><h3>${escapeHtml(module.codeLabel)}</h3><pre><code>${escapeHtml(module.code)}</code></pre></div>
      </div>
    </details>
  </section>`;
}

function workflowModel(project) {
  if (project.demo === "inventory") {
    return [
      { system: "Operator + CMS", action: "Select season and hydrate every episode inventory", state: "Virtualized browser-visible rows", result: "Complete local season index" },
      { system: "Browser tool", action: "Normalize and classify filenames", state: "Type, locale, version and scope", result: "Searchable inventory state" },
      { system: "Operator", action: "Search, filter and select assets", state: "Reviewed queue or CSV export", result: "Focused action set" },
      { system: "Human review", action: "Confirm delete or replace request", state: "Named assets and chosen action", result: "Logged outcome or cancellation" }
    ];
  }

  if (project.demo === "reconciliation") {
    return [
      { system: "Airtable operator", action: "Read one unchecked readiness requirement", state: "Alpha ID, locale, asset class and extension", result: "Deterministic search specification" },
      { system: "Puppeteer", action: "Open authenticated search and hydrate rows", state: "Browser-visible ingest records", result: "Complete candidate set" },
      { system: "Rules engine", action: "Match fields and verify completed stage", state: "Accepted, rejected or ambiguous candidates", result: "Explainable decision" },
      { system: "Update guard", action: "Update one field or stop for review", state: "Unchecked tracker field and run log", result: "Scoped update or manual-review state" }
    ];
  }

  return project.architecture.slice(0, 4).map((step, index) => ({
    system: `Workflow stage ${String(index + 1).padStart(2, "0")}`,
    action: step,
    state: project.workflow[index] || "Reviewed production context",
    result: project.workflow[index + 1] || "Human-reviewed output"
  }));
}

function architectureFlow(project) {
  return `<div class="workflow-diagram" aria-label="${escapeHtml(project.title)} architecture and workflow">
    ${workflowModel(project).map((step, index) => `<article class="workflow-node">
      <header><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step.system)}</strong></header>
      <h3>${escapeHtml(step.action)}</h3>
      <dl>
        <div><dt>Data or state</dt><dd>${escapeHtml(step.state)}</dd></div>
        <div><dt>Result</dt><dd>${escapeHtml(step.result)}</dd></div>
      </dl>
    </article>`).join("")}
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
    ["Users", project.users],
    ["Scale", project.scale],
    ["Tools", project.technologies.slice(0, 4).join(", ")]
  ];

  return `<dl class="metadata-grid">
    ${meta.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
  </dl>`;
}

function conciseScale(project) {
  if (project.demo === "inventory") return "1,000+ assets in a season inventory";
  if (project.demo === "reconciliation") return "50-100 tracker records in a typical run";
  return project.scale;
}

function primarySafeguard(project) {
  if (project.demo === "inventory") return "Human confirmation before delete or replace";
  if (project.demo === "reconciliation") return "No exact completed match means no update";
  return project.safeguards[0];
}

function outcomeStrip(project) {
  return `<div class="outcome-strip" aria-label="Project outcome, scale and primary safeguard">
    <div><span>Outcome</span><strong>${escapeHtml(project.result)}</strong></div>
    <div><span>Scale</span><strong>${escapeHtml(conciseScale(project))}</strong></div>
    <div><span>Primary safeguard</span><strong>${escapeHtml(primarySafeguard(project))}</strong></div>
  </div>`;
}

function beforeAfterWorkflow() {
  const before = ["Select season", "Open episode", "Scroll records", "Find asset manually", "Open menu", "Choose action", "Confirm", "Refresh"];
  const after = ["Hydrate season", "Search or filter", "Select asset", "Confirm action", "Review log"];

  return `<div class="workflow-comparison" aria-label="Media inventory workflow before and after">
    <article>
      <p class="evidence-label">Before</p>
      <h3>Repeated episode-by-episode inspection</h3>
      <ol>${before.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </article>
    <article>
      <p class="evidence-label">After</p>
      <h3>One hydrated season workflow</h3>
      <ol>${after.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </article>
  </div>`;
}

function evidenceGallery(project) {
  if (project.demo === "inventory") {
    return `<div class="evidence-gallery evidence-inventory">
      <figure class="evidence-wide">
        ${beforeAfterWorkflow()}
        <figcaption>Before-and-after operator path based on the documented working workflow.</figcaption>
      </figure>
      <figure class="evidence-terminal">
        <div class="evidence-window-head"><span>Selected queue</span><strong>2 assets</strong></div>
        <ol class="evidence-queue"><li><code>signal_s01e02_caption_en-us_full.scc</code></li><li><code>signal_s01e02_caption_en-us_full_alt.scc</code></li></ol>
        <figcaption>Selection remains visible before export, delete or replace review.</figcaption>
      </figure>
      <figure class="evidence-terminal">
        <div class="evidence-window-head"><span>Action log</span><strong>Human reviewed</strong></div>
        <pre class="evidence-log">[OK] 19 rows hydrated\n[INFO] 2 caption candidates selected\n[WAIT] Replace requires confirmation\n[OK] Review logged; no automatic action</pre>
        <figcaption>Sanitized fictional log showing the confirmation boundary.</figcaption>
      </figure>
    </div>`;
  }

  if (project.demo === "reconciliation") {
    return `<div class="evidence-gallery evidence-reconciliation">
      <figure class="evidence-wide">
        <div class="match-evidence" aria-label="Accepted, rejected and ambiguous matching examples">
          <article class="match-accepted"><span>Accepted</span><strong>RIVS01007 / EN-US / SCC</strong><p>One candidate, expected extension, status DONE.</p></article>
          <article class="match-rejected"><span>Rejected</span><strong>NORK01003 / EN-US / DFXP</strong><p>Candidate is delivered, but ingest is not complete.</p></article>
          <article class="match-ambiguous"><span>Ambiguous</span><strong>QHAR01005 / EN-US / SCC</strong><p>Two completed candidates; tracker remains unchanged.</p></article>
        </div>
        <figcaption>Deterministic examples used to explain why an update proceeded or stopped.</figcaption>
      </figure>
      <figure class="evidence-terminal">
        <div class="evidence-window-head"><span>Run log</span><strong>Guarded batch</strong></div>
        <pre class="evidence-log">[OK] Browser rows hydrated: 8\n[OK] Exact completed matches: 4\n[SKIP] Incomplete candidates: 2\n[REVIEW] Ambiguous requirements: 1</pre>
        <figcaption>Every skipped update retains an operator-readable reason.</figcaption>
      </figure>
      <figure class="evidence-tracker">
        <div class="evidence-window-head"><span>Airtable readiness</span><strong>Scoped update</strong></div>
        <div class="tracker-evidence-row"><span>RIVS01007</span><b>A/V &#10003;</b><b>DFXP &#10003;</b><b>SCC &#10003;</b></div>
        <div class="tracker-evidence-row is-review"><span>QHAR01005</span><b>Manual review</b><b>No update</b></div>
        <figcaption>Only mapped unchecked fields receive a verified update.</figcaption>
      </figure>
    </div>`;
  }

  if (project.demo === "calendar") {
    return `<div class="evidence-gallery evidence-calendar">
      <figure class="evidence-wide evidence-calendar-shot">
        <img src="../../assets/images/ktaekwondo-calendar-dashboard.png" alt="Sanitized calendar operations dashboard with Airtable sync state and public preview">
        <figcaption>Sanitized dashboard view showing the operator workflow, source status and public calendar output.</figcaption>
      </figure>
      <figure class="evidence-terminal evidence-calendar-flow">
        <div class="evidence-window-head"><span>Publishing path</span><strong>Reviewable</strong></div>
        <ol class="calendar-evidence-flow"><li><b>Softr</b><span>Studio admin edits a schedule or event.</span></li><li><b>Airtable</b><span>Record state and publishing status stay visible.</span></li><li><b>Public widget</b><span>Approved fields render on the website.</span></li></ol>
        <figcaption>Each handoff has a visible state before public presentation.</figcaption>
      </figure>
    </div>`;
  }

  return `<div class="evidence-gallery">
    <figure class="evidence-wide"><div class="evidence-placeholder">${escapeHtml(project.visual)}</div><figcaption>${escapeHtml(project.results[0])}</figcaption></figure>
  </div>`;
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
      <a class="button button-secondary" href="../../demos/file-linking-search/index.html" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <p class="demo-values-note">Fictional demonstration values.</p>
    <div class="standalone-demo-frame linking-demo-frame">
      <iframe src="../../demos/file-linking-search/index.html" title="Sanitized interactive file linking search" loading="eager"></iframe>
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
        <p class="demo-kicker">SANITIZED INTERACTIVE RECONSTRUCTION</p>
        <h2>Season inventory overlay</h2>
      </div>
      <a class="button button-secondary" href="../../demos/media-inventory-console/index.html" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <div class="inventory-demo-frame">
      <iframe src="../../demos/media-inventory-console/index.html" title="Sanitized interactive media inventory console" loading="lazy"></iframe>
    </div>
    <p class="demo-caption">Fictional demonstration data. Interface behavior reflects the original workflow.</p>
  </section>`;
}

function reconciliationDemo() {
  return `<section class="demo-panel standalone-demo-embed" aria-label="Interactive ingest status reconciliation demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">SANITIZED INTERACTIVE RECONSTRUCTION</p>
        <h2>Ingest status to readiness update</h2>
      </div>
      <a class="button button-secondary" href="../../demos/asset-status-reconciliation/index.html" target="_blank" rel="noopener">Open full-screen demo</a>
    </div>
    <div class="standalone-demo-frame reconciliation-demo-frame">
      <iframe src="../../demos/asset-status-reconciliation/index.html" title="Sanitized interactive ingest status reconciliation" loading="lazy"></iframe>
    </div>
    <p class="demo-caption">Fictional demonstration data. Interface behavior reflects the original workflow.</p>
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
    <p class="demo-values-note">Fictional demonstration values.</p>
    <div class="vmaf-summary">
      <div><span>VMAF mean</span><strong>91.8</strong></div>
      <div><span>Duration delta</span><strong>00:00:51</strong></div>
      <div><span>Review ranges</span><strong>03</strong></div>
      <div><span>Decision</span><strong>Human review</strong></div>
    </div>
    <figure class="generated-production-visual">
      <img src="../../assets/images/vmaf-anime-comparison.png" alt="Original anime-style reference frame beside a compressed comparison frame">
      <figcaption>Original publish-safe production frame created for this reconstruction. Left: reference. Right: intentionally compressed comparison.</figcaption>
    </figure>
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
    <p class="demo-values-note">Fictional demonstration values.</p>
    <figure class="generated-production-visual">
      <img src="../../assets/images/op-ed-anime-sequence.png" alt="Original anime-style recap, opening and ending sequence frames">
      <figcaption>Original publish-safe anime-style frames created for timeline analysis: recap, opening sequence and ending sequence.</figcaption>
    </figure>
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
  return `<section class="demo-panel calendar-demo" data-calendar-demo aria-label="K-Taekwondo calendar operations platform demo">
    <div class="demo-panel-header">
      <div>
        <p class="demo-kicker">Sanitized Softr + Airtable reconstruction</p>
        <h2>Calendar operations workspace</h2>
      </div>
      <a class="button button-primary" href="https://www.k-taekwondo.com/test" target="_blank" rel="noopener noreferrer">Open live test page</a>
    </div>
    <p class="demo-values-note">Fictional demonstration values. No private records, credentials or contact details are shown.</p>
    <div class="calendar-dashboard" data-calendar-dashboard>
      <div class="calendar-dashboard-toolbar">
        <div>
          <span class="calendar-console-label">Softr / studio operations</span>
          <strong>Schedule workspace</strong>
        </div>
        <div class="calendar-toolbar-controls">
          <label>Studio<select data-calendar-studio aria-label="Choose demo studio"><option>Chatsworth</option><option>Glendale</option><option>Pasadena</option></select></label>
          <button class="button button-secondary" type="button" data-calendar-sync>Sync Airtable</button>
        </div>
      </div>
      <div class="calendar-summary-grid" aria-label="Calendar workspace summary">
        <div><span>Published</span><strong>28</strong><small>public records</small></div>
        <div><span>Needs review</span><strong>03</strong><small>operator queue</small></div>
        <div><span>Next sync</span><strong>18 min</strong><small>scheduled refresh</small></div>
        <div><span>Source</span><strong>Airtable</strong><small data-calendar-sync-state>last sync 2 min ago</small></div>
      </div>
      <div class="calendar-dashboard-grid">
        <section class="calendar-operator-panel" aria-labelledby="calendar-operator-title">
          <div class="calendar-panel-heading"><div><span class="calendar-panel-kicker">Operator view</span><h3 id="calendar-operator-title">Upcoming schedule</h3></div><span class="calendar-state" data-calendar-status aria-live="polite">Ready for review</span></div>
          <div class="calendar-view-tabs" role="tablist" aria-label="Calendar views">
            <button type="button" role="tab" aria-selected="true" class="is-active" data-calendar-view="today">Today</button>
            <button type="button" role="tab" aria-selected="false" data-calendar-view="week">Week</button>
            <button type="button" role="tab" aria-selected="false" data-calendar-view="month">Month</button>
          </div>
          <div class="calendar-view-panel is-active" data-calendar-view-panel="today">
            <div class="calendar-date-row"><strong>Thursday, July 16</strong><span>4 items</span></div>
            <div class="calendar-event-list">
              <article class="calendar-event-row" data-calendar-event="class"><time>4:00 PM</time><div><strong>Trial class</strong><span>Yellow belt group / regular class</span></div><b class="calendar-chip is-published">Published</b><button type="button" class="calendar-edit" data-calendar-edit>Edit</button></article>
              <article class="calendar-event-row" data-calendar-event="class"><time>5:00 PM</time><div><strong>Purple to black</strong><span>Intermediate group / regular class</span></div><b class="calendar-chip is-published">Published</b><button type="button" class="calendar-edit" data-calendar-edit>Edit</button></article>
              <article class="calendar-event-row is-review-row" data-calendar-event="event"><time>7:00 PM</time><div><strong>Instructor check-in</strong><span>Internal event / draft announcement</span></div><b class="calendar-chip is-review">Needs review</b><button type="button" class="calendar-edit" data-calendar-edit>Edit</button></article>
            </div>
          </div>
          <div class="calendar-view-panel" data-calendar-view-panel="week" hidden>
            <div class="calendar-week-grid"><div><b>Mon</b><span>4 classes</span><em>1 review</em></div><div><b>Tue</b><span>4 classes</span><em>Published</em></div><div><b>Wed</b><span>3 classes</span><em>Published</em></div><div><b>Thu</b><span>4 classes</span><em>Published</em></div><div><b>Fri</b><span>4 classes</span><em>Published</em></div></div>
            <p class="calendar-panel-note">Weekly schedule is assembled from recurring class records and studio-specific overrides.</p>
          </div>
          <div class="calendar-view-panel" data-calendar-view-panel="month" hidden>
            <div class="calendar-month-grid" aria-label="Fictional July 2026 monthly calendar"><span class="calendar-month-day is-muted">28</span><span class="calendar-month-day is-muted">29</span><span class="calendar-month-day is-muted">30</span><span class="calendar-month-day">1</span><span class="calendar-month-day">2</span><span class="calendar-month-day">3</span><span class="calendar-month-day">4</span><span class="calendar-month-day">5</span><span class="calendar-month-day">6</span><span class="calendar-month-day">7</span><span class="calendar-month-day">8</span><span class="calendar-month-day">9</span><span class="calendar-month-day">10</span><span class="calendar-month-day">11</span><span class="calendar-month-day">12</span><span class="calendar-month-day">13</span><span class="calendar-month-day">14</span><span class="calendar-month-day is-today">15<em>Closure</em></span><span class="calendar-month-day">16<em>Classes</em></span><span class="calendar-month-day">17</span><span class="calendar-month-day is-event">18<em>Belt test</em></span><span class="calendar-month-day">19</span><span class="calendar-month-day">20</span><span class="calendar-month-day">21</span><span class="calendar-month-day">22</span><span class="calendar-month-day">23</span><span class="calendar-month-day">24</span><span class="calendar-month-day">25</span><span class="calendar-month-day">26</span><span class="calendar-month-day">27</span><span class="calendar-month-day">28</span><span class="calendar-month-day">29</span><span class="calendar-month-day">30</span><span class="calendar-month-day">31</span></div>
          </div>
        </section>
        <aside class="calendar-public-panel" aria-labelledby="calendar-public-title">
          <div class="calendar-panel-heading"><div><span class="calendar-panel-kicker">Public preview</span><h3 id="calendar-public-title">What visitors see</h3></div><span class="calendar-live-dot">Live fields</span></div>
          <div class="public-preview-card"><div class="public-preview-heading"><strong>Chatsworth</strong><span>Today’s schedule</span></div><div class="public-class"><time>4:00</time><strong>Trial - Yellow belt</strong></div><div class="public-class"><time>5:00</time><strong>Purple - Black</strong></div><div class="public-class"><time>7:00</time><strong>Adult class</strong></div></div>
          <div class="public-event-list"><div><span>July 18</span><strong>Belt test</strong><small>Published event</small></div><div><span>July 27</span><strong>Nunchuck class</strong><small>Published event</small></div></div>
        </aside>
      </div>
      <div class="calendar-dashboard-footer">
        <div><span class="calendar-panel-kicker">Airtable change log</span><strong data-calendar-log>Public payload ready for review</strong></div>
        <ol><li><b>01</b>Record edited</li><li><b>02</b>Review state checked</li><li><b>03</b>Public fields refreshed</li></ol>
      </div>
    </div>
    <div class="calendar-architecture-strip" aria-label="Calendar system flow"><span><b>01</b>Softr dashboard</span><i>→</i><span><b>02</b>Airtable source</span><i>→</i><span><b>03</b>Worker/API fields</span><i>→</i><span><b>04</b>Public calendar</span></div>
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
    <p class="demo-values-note">Fictional demonstration values apply only to the prototype narrative. The instructional images are supplied real annotated frames.</p>
    <div class="keyframe-gallery" aria-label="Supplied annotated instructional keyframes">
      <figure><img src="../../assets/images/ktaekwondo-keyframe-01.jpg" alt="Annotated ready-stance instructional frame"><figcaption>Ready stance reference</figcaption></figure>
      <figure><img src="../../assets/images/ktaekwondo-keyframe-02.jpg" alt="Annotated low-block instructional frame"><figcaption>Low block candidate</figcaption></figure>
      <figure><img src="../../assets/images/ktaekwondo-keyframe-03.jpg" alt="Annotated right-middle-block instructional frame"><figcaption>Middle block candidate</figcaption></figure>
      <figure><img src="../../assets/images/ktaekwondo-keyframe-04.jpg" alt="Annotated middle-punch instructional frame"><figcaption>Middle punch candidate</figcaption></figure>
      <figure><img src="../../assets/images/ktaekwondo-keyframe-05.jpg" alt="Annotated return-to-ready instructional frame"><figcaption>Sequence close</figcaption></figure>
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

function heroSystemComposition() {
  const inventory = publicProjects.find((project) => project.demo === "inventory");
  const reconciliation = publicProjects.find((project) => project.demo === "reconciliation");

  return `<figure class="hero-system-composition" aria-label="Previews of two production-facing workflow systems">
    <div class="system-layer layer-reconciliation">${projectStaticPreview(reconciliation, "", true)}</div>
    <div class="system-layer layer-inventory">${projectStaticPreview(inventory, "", true)}</div>
    <figcaption>Sanitized static previews of working interfaces and reconstructed workflows.</figcaption>
  </figure>`;
}

function featuredSystem(project, index) {
  const isInventory = project.demo === "inventory";
  const operationalVisual = isInventory
    ? `<div class="featured-metric" aria-label="Reported workflow duration improvement"><span>4-7 minutes per asset</span><b aria-hidden="true">&rarr;</b><strong>under one minute</strong></div>
       <p class="metric-context">Secondary scale: 1,000+ assets in a season inventory.</p>`
    : `<div class="featured-pipeline" aria-label="Reconciliation workflow">
        <span>Airtable requirement</span><b aria-hidden="true">&rarr;</b><span>Puppeteer</span><b aria-hidden="true">&rarr;</b><span>DONE verification</span><b aria-hidden="true">&rarr;</b><span>Guarded tracker update</span>
      </div>
      <p class="metric-context">Typical run: 50-100 records. No exact completed match means no update.</p>`;

  return `<article class="featured-system${index % 2 === 0 ? "" : " is-reversed"}">
    <header class="featured-system-heading">
      <p class="section-kicker">Featured system ${String(index + 1).padStart(2, "0")}</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p><strong>Function:</strong> ${escapeHtml(project.purpose)}</p>
    </header>
    <div class="featured-system-layout">
      <div class="featured-system-visual">${projectStaticPreview(project)}</div>
      <div class="featured-system-details">
        <dl>
          <div><dt>Status</dt><dd>${escapeHtml(project.status)}</dd></div>
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt>Technologies</dt><dd>${escapeHtml(project.technologies.slice(0, 4).join(", "))}</dd></div>
          <div><dt>Scale</dt><dd>${escapeHtml(conciseScale(project))}</dd></div>
          <div><dt>Verified outcome</dt><dd>${escapeHtml(project.result)}</dd></div>
        </dl>
        ${operationalVisual}
        <a class="text-link" href="projects/${project.slug}/index.html">Read the case study <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </article>`;
}

function renderProjectPage(project) {
  const body = `<section class="page-hero case-hero editorial-project-hero">
    <div class="shell">
      <p class="eyebrow">${escapeHtml(project.type)}</p>
      <div class="project-hero-heading">
        <div>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="project-function">${escapeHtml(project.purpose)}</p>
        </div>
        ${statusBadge(project.status)}
      </div>
      <div class="hero-actions">
        <a class="button button-primary" href="#demonstration">View functional demonstration</a>
        <a class="button button-secondary" href="../../projects.html">All projects</a>
      </div>
      ${metaGrid(project)}
    </div>
  </section>
  <section class="section project-demonstration" id="demonstration">
    <div class="shell">
      ${projectDemo(project)}
      ${outcomeStrip(project)}
    </div>
  </section>
  <article class="project-story">
    <section class="section case-section" id="problem">
      <div class="shell story-grid">
        <header><p class="section-kicker">Operational problem</p><h2>Where the workflow broke down.</h2></header>
        <div class="story-copy">
          <ul class="clean-list">${project.problem.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          ${subsectionList("Constraints", project.constraints)}
        </div>
      </div>
    </section>
    <section class="section case-section section-ruled" id="built">
      <div class="shell story-grid">
        <header><p class="section-kicker">What I built</p><h2>A practical production-facing system.</h2><p class="section-summary">${escapeHtml(project.output)}</p></header>
        <div class="story-copy">
          <ul class="clean-list">${project.approach.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          ${subsectionList("Users and stakeholders", project.stakeholders)}
          ${subsectionList("Production supervision lens", productionLens(project))}
        </div>
      </div>
    </section>
    <section class="section case-section workflow-section" id="workflow">
      <div class="shell">
        <div class="section-heading"><p class="section-kicker">Workflow and architecture</p><h2>Who acts, what changes and what happens next.</h2></div>
        ${architectureFlow(project)}
        <div class="case-subsection workflow-sequence"><h3>Operator sequence</h3>${workflowSteps(project)}</div>
      </div>
    </section>
    <section class="section case-section safeguards-section section-ruled" id="safeguards">
      <div class="shell story-grid">
        <header><p class="section-kicker">Safeguards</p><h2>Risk stays visible at the decision point.</h2></header>
        <ul class="safeguard-list">${project.safeguards.slice(0, 4).map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </section>
    <section class="section case-section evidence-section" id="evidence">
      <div class="shell">
        <div class="section-heading"><p class="section-kicker">Evidence</p><h2>Artifacts that make the workflow reviewable.</h2></div>
        ${evidenceGallery(project)}
      </div>
    </section>
    ${project.slug === "media-inventory-console" ? `<div class="shell">${supportingModuleBlock()}</div>` : ""}
    <section class="section case-section result-section section-ruled" id="results">
      <div class="shell story-grid">
        <header><p class="section-kicker">Result</p><h2>${escapeHtml(project.result)}</h2></header>
        <div class="story-copy">
          <ul class="clean-list">${project.results.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          ${subsectionList("Learnings", project.learned)}
        </div>
      </div>
    </section>
    <section class="section case-section technical-details" id="supporting-details">
      <div class="shell">
        <div class="section-heading"><p class="section-kicker">Expandable technical detail</p><h2>Implementation, tests and known limits.</h2></div>
        <div class="disclosure-grid">
          ${disclosureBlock("Implementation notes", project.details)}
          ${disclosureBlock("Testing", project.testing)}
          ${disclosureBlock("Safeguards", project.safeguards)}
          ${disclosureBlock("Limitations", project.limitations)}
          ${disclosureBlock("Next iteration", project.next)}
          <section class="case-section disclosure-section code-section">
            <details class="case-disclosure code-disclosure">
              <summary>Sanitized code</summary>
              <div class="disclosure-body"><h3>${escapeHtml(project.codeLabel)}</h3><pre><code>${escapeHtml(project.code)}</code></pre></div>
            </details>
          </section>
        </div>
      </div>
    </section>
  </article>`;

  return layout({
    title: `${project.title} | Ali Aslam`,
    description: project.purpose,
    active: "projects",
    prefix: "../../",
    body
  });
}

function homePage() {
  const templatePath = join(ROOT, "scripts/templates/home-dashboard.html");

  if (!existsSync(templatePath)) {
    throw new Error("Required homepage template is missing: scripts/templates/home-dashboard.html");
  }

  return readFileSync(templatePath, "utf8");
}

function projectsPage() {
  const core = publicProjects.slice(0, 4).map((project) => projectCard(project)).join("");
  const additional = publicProjects.slice(4).map((project) => projectCard(project)).join("");
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
        <p>I use Codex, Gemini and Claude Code to accelerate exploration, debugging, documentation and interface iteration. I remain responsible for the production problem, workflow architecture, domain rules, test cases and final judgment.</p>
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
  --bg: #f3f0e9;
  --surface: #ffffff;
  --surface-strong: #ebe7df;
  --ink: #121316;
  --muted: #64676d;
  --line: rgba(18, 19, 22, 0.11);
  --accent: #e56835;
  --accent-dark: #b54f27;
  --accent-soft: #f6ddd1;
  --rust: #e56835;
  --gold: #b87925;
  --blue: #3c7fc0;
  --danger: #b74a4a;
  --dark: #15171a;
  --dark-2: #1d2024;
  --radius: 6px;
  --radius-small: 4px;
  --shadow: 0 18px 48px rgba(18, 19, 22, 0.13);
  --font: Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  font-size: 17px;
  line-height: 1.62;
}
button, input, select { font: inherit; }
img { display: block; max-width: 100%; height: auto; }
[hidden] { display: none !important; }
a { color: inherit; }
a:hover { color: var(--accent-dark); }
code, pre { font-family: var(--mono); }
code { background: #e9efec; border-radius: var(--radius-small); padding: 0.1rem 0.3rem; overflow-wrap: anywhere; word-break: break-word; }
pre { overflow-x: auto; margin: 0; padding: 1.25rem; border-radius: var(--radius); background: #101719; color: #e8f4ef; line-height: 1.55; }
pre code { display: block; padding: 0; border-radius: 0; background: transparent; color: inherit; overflow-wrap: normal; word-break: normal; }
.hero-copy, .hero-console, .project-card, .project-card-body, .demo-panel, .mini-console, .table-wrap, .queue-panel, .flow-node, .workflow-steps li, .case-aside, .case-content, .case-section, .resume-main, .resume-block, .metric-card, .contact-grid article, pre { min-width: 0; }
:focus-visible { outline: 3px solid rgba(229, 104, 53, 0.48); outline-offset: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.skip-link { position: fixed; top: 0.75rem; left: 0.75rem; z-index: 30; transform: translateY(-160%); padding: 0.7rem 1rem; border-radius: var(--radius-small); background: var(--dark); color: white; text-decoration: none; }
.skip-link:focus { transform: translateY(0); }
.shell { width: min(1200px, calc(100% - 2.5rem)); margin: 0 auto; }
.site-header { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid var(--line); background: rgba(243, 240, 233, 0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.nav { min-height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: inline-flex; align-items: center; text-decoration: none; color: var(--ink); min-width: 0; }
.brand-copy { display: grid; line-height: 1.15; }
.brand-copy small { color: var(--muted); font-size: 0.76rem; font-weight: 600; }
.nav-links { display: flex; align-items: center; gap: 0.25rem; }
.nav-links a { padding: 0.5rem 0.75rem; border-radius: var(--radius-small); color: var(--muted); font-weight: 750; text-decoration: none; transition: color 180ms ease, background-color 180ms ease; }
.nav-links a:hover, .nav-links a[aria-current="page"] { background: var(--accent-soft); color: var(--accent-dark); }
.nav-contact-actions { display: flex; align-items: center; gap: 0.15rem; margin-left: 0.35rem; padding-left: 0.5rem; border-left: 1px solid var(--line); }
.nav-links .nav-action { padding-inline: 0.55rem; font-size: 0.8rem; }
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
.button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0.7rem 1rem; border: 1px solid var(--line); border-radius: var(--radius-small); font-weight: 800; text-decoration: none; cursor: pointer; transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease, transform 180ms ease; }
.button:hover { transform: translateY(-1px); }
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
.project-card-link { display: grid; grid-template-rows: 150px 1fr; height: 100%; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); overflow: hidden; text-decoration: none; box-shadow: 0 10px 26px rgba(23,32,33,0.06); transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease; }
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
.demo-values-note { margin: 0; padding: 0.6rem 1rem; border-bottom: 1px solid #343738; background: #1a2020; color: #f0c987 !important; font-family: var(--mono); font-size: 0.75rem; font-weight: 800; }
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
.calendar-dashboard { overflow: hidden; border: 1px solid #cdd6d1; border-radius: 6px; background: #edf2ef; color: #17201e; box-shadow: 0 16px 34px rgba(0,0,0,0.18); }
.calendar-dashboard-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.1rem; background: #202a29; color: #f5faf7; }
.calendar-dashboard-toolbar strong { display: block; margin-top: 0.15rem; font-size: 1.05rem; }
.calendar-console-label, .calendar-panel-kicker { display: block; color: #78c7b2; font-family: var(--mono); font-size: 0.68rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.calendar-toolbar-controls { display: flex; align-items: end; gap: 0.65rem; }
.calendar-toolbar-controls label { display: grid; gap: 0.25rem; color: #bdc9c4; font-family: var(--mono); font-size: 0.66rem; text-transform: uppercase; }
.calendar-toolbar-controls select { min-height: 38px; padding: 0.45rem 2rem 0.45rem 0.65rem; border: 1px solid #52625e; border-radius: 4px; background: #2a3532; color: #f5faf7; }
.calendar-toolbar-controls .button { min-height: 38px; padding: 0.5rem 0.75rem; border-color: #d4e1db; background: #f5faf7; color: #17201e; font-size: 0.8rem; }
.calendar-summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid #d5ded9; background: #f7faf8; }
.calendar-summary-grid > div { min-width: 0; padding: 0.85rem 1rem; border-right: 1px solid #d5ded9; }
.calendar-summary-grid > div:last-child { border-right: 0; }
.calendar-summary-grid span, .calendar-summary-grid small { display: block; color: #65716d; font-family: var(--mono); font-size: 0.66rem; text-transform: uppercase; }
.calendar-summary-grid strong { display: block; margin: 0.12rem 0; color: #18211f; font-size: 1.35rem; line-height: 1.2; }
.calendar-summary-grid small { color: #75817c; font-family: var(--font); font-size: 0.72rem; text-transform: none; }
.calendar-dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr); gap: 0.85rem; padding: 0.85rem; }
.calendar-operator-panel, .calendar-public-panel { min-width: 0; border: 1px solid #d0d9d4; border-radius: 5px; background: #ffffff; }
.calendar-panel-heading { display: flex; align-items: end; justify-content: space-between; gap: 0.75rem; padding: 0.85rem 0.95rem; border-bottom: 1px solid #dce4df; }
.calendar-panel-heading h3 { margin: 0.18rem 0 0; color: #17201e; font-size: 1.05rem; }
.calendar-state, .calendar-live-dot { color: #31875b; font-family: var(--mono); font-size: 0.68rem; font-weight: 800; white-space: nowrap; }
.calendar-live-dot::before { display: inline-block; width: 6px; height: 6px; margin-right: 0.35rem; border-radius: 50%; background: #39a96f; content: ""; }
.calendar-view-tabs { display: flex; gap: 0.3rem; padding: 0.75rem 0.95rem 0; }
.calendar-view-tabs button { padding: 0.38rem 0.6rem; border: 1px solid #d3ddd7; border-radius: 4px; background: #f4f7f5; color: #66736e; font-size: 0.76rem; font-weight: 800; cursor: pointer; }
.calendar-view-tabs button.is-active { border-color: #253e38; background: #253e38; color: #ffffff; }
.calendar-view-panel { padding: 0.8rem 0.95rem 0.95rem; }
.calendar-date-row { display: flex; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.45rem; color: #5c6964; font-size: 0.74rem; }
.calendar-date-row strong { color: #25302c; }
.calendar-event-list { display: grid; gap: 0.4rem; }
.calendar-event-row { display: grid; grid-template-columns: 60px minmax(0, 1fr) auto auto; gap: 0.65rem; align-items: center; padding: 0.68rem 0.72rem; border: 1px solid #e0e7e3; border-left: 3px solid #49a779; border-radius: 4px; background: #fbfcfb; }
.calendar-event-row.is-review-row { border-left-color: #d47c38; background: #fffaf3; }
.calendar-event-row time { color: #bf512e; font-family: var(--mono); font-size: 0.72rem; font-weight: 800; }
.calendar-event-row strong, .calendar-event-row span { display: block; }
.calendar-event-row strong { color: #1f2926; font-size: 0.78rem; }
.calendar-event-row span { overflow: hidden; color: #6d7974; font-size: 0.68rem; text-overflow: ellipsis; white-space: nowrap; }
.calendar-chip { padding: 0.22rem 0.4rem; border-radius: 3px; font-family: var(--mono); font-size: 0.61rem; text-transform: uppercase; white-space: nowrap; }
.calendar-chip.is-published { background: #dcefe3; color: #28784f; }
.calendar-chip.is-review { background: #f8e5ca; color: #9b5a1f; }
.calendar-edit { border: 0; background: transparent; color: #8a4b2f; font-family: var(--mono); font-size: 0.66rem; font-weight: 800; cursor: pointer; }
.calendar-week-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.4rem; }
.calendar-week-grid > div { display: grid; gap: 0.22rem; min-height: 92px; padding: 0.6rem; border: 1px solid #dae3de; background: #f6f9f7; }
.calendar-week-grid b { color: #253b35; font-size: 0.76rem; }
.calendar-week-grid span, .calendar-week-grid em { color: #6e7b75; font-size: 0.68rem; font-style: normal; }
.calendar-week-grid em { align-self: end; color: #bb5f31; font-family: var(--mono); font-size: 0.61rem; }
.calendar-panel-note { margin: 0.75rem 0 0; color: #6e7b75 !important; font-size: 0.72rem; }
.calendar-month-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; padding: 2px; background: #d7e0db; }
.calendar-month-day { min-height: 46px; padding: 0.35rem; background: #ffffff; color: #3b4843; font-family: var(--mono); font-size: 0.66rem; }
.calendar-month-day.is-muted { color: #aab3af; }
.calendar-month-day.is-today { background: #e7f1ec; color: #24724b; }
.calendar-month-day.is-event { background: #fff1e4; color: #9c512d; }
.calendar-month-day em { display: block; margin-top: 0.25rem; color: inherit; font-family: var(--font); font-size: 0.56rem; font-style: normal; line-height: 1.1; }
.public-preview-card { margin: 0.9rem; padding: 0.8rem; border: 1px solid #dbe3df; background: #f8faf9; }
.public-preview-heading { display: flex; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.6rem; }
.public-preview-heading strong { color: #1b2924; font-size: 0.85rem; }
.public-preview-heading span { color: #718079; font-family: var(--mono); font-size: 0.63rem; text-transform: uppercase; }
.public-class { display: grid; grid-template-columns: 48px 1fr; gap: 0.5rem; padding: 0.48rem 0; border-top: 1px solid #e0e7e3; }
.public-class time { color: #cf4634; font-family: var(--mono); font-size: 0.75rem; font-weight: 800; }
.public-class strong { color: #25302c; font-size: 0.74rem; }
.public-event-list { display: grid; gap: 0.4rem; padding: 0 0.9rem 0.9rem; }
.public-event-list div { display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 0.35rem 0.55rem; padding: 0.48rem 0; border-top: 1px solid #e0e7e3; }
.public-event-list span { color: #c14f32; font-family: var(--mono); font-size: 0.64rem; font-weight: 800; }
.public-event-list strong { color: #29352f; font-size: 0.72rem; }
.public-event-list small { grid-column: 2; color: #718079; font-size: 0.65rem; }
.calendar-dashboard-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1rem; border-top: 1px solid #d5ded9; background: #e5ede8; }
.calendar-dashboard-footer strong { display: block; margin-top: 0.22rem; color: #283832; font-size: 0.74rem; }
.calendar-dashboard-footer ol { display: flex; flex-wrap: wrap; gap: 0.7rem; margin: 0; padding: 0; list-style: none; color: #65736c; font-family: var(--mono); font-size: 0.63rem; }
.calendar-dashboard-footer li { display: inline-flex; align-items: center; gap: 0.25rem; }
.calendar-dashboard-footer b { color: #b85230; }
.calendar-architecture-strip { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.4rem 0.7rem; padding: 0.8rem 0 0.1rem; color: #b8c8c2; font-family: var(--mono); font-size: 0.68rem; }
.calendar-architecture-strip span { display: inline-flex; align-items: center; gap: 0.35rem; }
.calendar-architecture-strip b { color: #e9a375; }
.calendar-architecture-strip i { color: #7cc5b0; font-style: normal; }
.evidence-calendar-shot { grid-column: 1 / -1; }
.evidence-calendar-shot img { width: 100%; background: #edf2ef; }
.calendar-evidence-flow { display: grid; gap: 0.7rem; margin: 0; padding: 1rem 1.1rem 1rem 2rem; color: #c9cfcc; font-size: 0.72rem; }
.calendar-evidence-flow li { padding-left: 0.2rem; }
.calendar-evidence-flow b, .calendar-evidence-flow span { display: block; }
.calendar-evidence-flow b { color: #e9a375; font-family: var(--mono); font-size: 0.68rem; }
.calendar-evidence-flow span { margin-top: 0.2rem; color: #dbe4e0; }
.flow-diagram { display: grid; gap: 0.7rem; }
.flow-diagram:not(.compact) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.flow-node { position: relative; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 0.85rem; font-weight: 800; min-width: 0; }
.flow-node span { display: block; margin-bottom: 0.4rem; color: var(--rust); font-family: var(--mono); font-size: 0.82rem; }
.filmstrip { display: grid; grid-template-columns: repeat(5, minmax(80px, 1fr)); gap: 0.75rem; margin: 1rem 0; overflow-x: auto; }
.frame { display: grid; place-items: center; aspect-ratio: 4 / 5; border-radius: var(--radius); border: 2px solid #314345; background: #1b2b2d; color: white; font-weight: 850; }
.frame.selected { border-color: var(--accent); background: #123a38; }
.frame.rejected { border-color: var(--rust); opacity: 0.72; }
.keyframe-gallery { display: grid; grid-template-columns: repeat(5, minmax(150px, 1fr)); gap: 0.75rem; margin: 1rem 0; overflow-x: auto; }
.keyframe-gallery figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid #314345; border-radius: var(--radius); background: var(--dark-2); }
.keyframe-gallery img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: center; background: #f4f4f1; }
.keyframe-gallery figcaption { padding: 0.65rem 0.7rem; color: #d8e5e1; font-size: 0.78rem; font-weight: 800; }
.impact-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.impact-strip div { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 1rem; }
.impact-strip strong { display: block; margin-top: 0.25rem; }
.case-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 3rem); }
.case-aside { position: sticky; top: 96px; align-self: start; }
.case-aside nav { display: grid; gap: 0.3rem; border-left: 2px solid var(--line); padding-left: 1rem; }
.case-aside a { color: var(--muted); text-decoration: none; font-weight: 800; }
.case-section { padding: 2rem 0; border-bottom: 1px solid var(--line); }
.case-section:first-child { padding-top: 0; }
.case-lead { margin: 1rem 0 0; color: var(--muted); font-size: 1.08rem; }
.case-subsection { margin-top: 1.5rem; }
.case-subsection h3 { font-size: 1.05rem; }
.disclosure-section { padding: 0.65rem 0; }
.case-disclosure { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.case-disclosure summary { padding: 0.9rem 1rem; color: var(--accent-dark); font-weight: 850; cursor: pointer; }
.case-disclosure summary::marker { color: var(--rust); }
.disclosure-body { padding: 0 1rem 1rem; }
.disclosure-body .clean-list { margin-top: 0.25rem; }
.supporting-module { padding: 1rem 0; }
.module-disclosure > summary { font-size: 1.05rem; }
.module-purpose { margin: 0.5rem 0 1rem; color: var(--muted); }
.module-metadata { margin: 1.25rem 0; }
.supporting-module .demo-panel { margin-top: 1rem; }
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
.project-visual-keyframe-image img { object-position: center 28%; }
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
.code-disclosure h3 { margin-top: 0.5rem; font-size: 1.1rem; }
.code-disclosure pre { margin-top: 1rem; }
.resume-sheet { max-width: 900px; }
.resume-section { padding: 2rem 0; border-bottom: 1px solid var(--line); }
.resume-section:first-child { padding-top: 0; }
.resume-section h2 { font-size: 1.75rem; }
.resume-section p { color: var(--muted); }
.resume-timeline { display: grid; gap: 0; }
.resume-timeline article { padding: 1.5rem 0; border-bottom: 1px solid var(--line); }
.resume-timeline article:last-child { border-bottom: 0; padding-bottom: 0; }
.resume-job-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; }
.resume-job-heading h3 { margin: 0; font-size: 1.2rem; }
.resume-job-heading p { margin: 0.15rem 0 0; }
.resume-job-heading time { color: var(--accent-dark); font-family: var(--mono); font-size: 0.82rem; font-weight: 800; white-space: nowrap; }
.footer-main { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-start; }
.footer-main p { max-width: 600px; margin: 0; color: #aebbbb; }
.footer-main a { margin: 0; font-weight: 800; }
.footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; }
/* Stage 1 editorial shell and function-first project hierarchy */
.nav { min-height: 64px; }
.nav-links a { font-size: 0.82rem; }
.nav-links a:hover, .nav-links a[aria-current="page"] { background: transparent; color: var(--accent-dark); }
.nav-links a[aria-current="page"] { box-shadow: inset 0 -2px 0 var(--accent); }
.hero, .page-hero { background: var(--bg); }
.editorial-home-hero { overflow: hidden; }
.hero-editorial-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(460px, 0.92fr); gap: clamp(2.5rem, 4vw, 4rem); align-items: center; min-height: 0; padding: 5.25rem 0 4.25rem; }
.hero-copy { min-width: 0; }
.hero h1 { max-width: 720px; font-size: 4.6rem; line-height: 1; font-weight: 720; }
.hero-text { max-width: 680px; font-size: 1.12rem; }
.hero-system-composition { position: relative; min-width: 0; min-height: 510px; margin: 0; }
.hero-system-composition figcaption { position: absolute; right: 0; bottom: 0; color: var(--muted); font-family: var(--mono); font-size: 0.68rem; }
.system-layer { position: absolute; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius); background: var(--dark); box-shadow: 0 18px 42px rgba(18,19,22,0.18); }
.system-layer .project-preview { width: 100%; height: 100%; min-height: 0; }
.layer-reconciliation { top: 0; right: 0; width: 82%; height: 220px; z-index: 1; }
.layer-inventory { left: 0; right: 8%; bottom: 38px; height: 330px; z-index: 4; transform: none; }
.layer-inventory img { width: 100%; height: 100%; object-fit: cover; }
.project-preview::before, .project-preview::after { display: none; }
.project-preview { min-height: 230px; background: var(--dark); }
.preview-reconciliation { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; padding: 0.65rem; background: #0f1113; }
.preview-column { display: grid; align-content: start; gap: 0.38rem; min-width: 0; padding: 0.65rem; border: 1px solid #35393d; background: #1d2024; color: #cfd4d2; font-size: 0.68rem; }
.preview-column b { color: white; font-size: 0.73rem; }
.preview-column i { overflow: hidden; color: #929a97; font-family: var(--mono); font-style: normal; text-overflow: ellipsis; white-space: nowrap; }
.preview-column em { margin-top: auto; padding: 0.24rem 0.35rem; border-left: 2px solid var(--blue); background: #182533; color: #88bce8; font-style: normal; font-weight: 800; }
.preview-automation em { border-color: var(--gold); background: #2d2618; color: #e0bb73; }
.preview-results em { border-color: #31885f; background: #172a22; color: #79c69e; }
.preview-video { display: grid; grid-template-rows: 1fr 24px auto; gap: 0.55rem; padding: 0.75rem; }
.preview-video-panes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; }
.preview-video-panes i { display: flex; align-items: flex-end; padding: 0.5rem; border: 1px solid #3b4044; background: linear-gradient(#2b3438 0 48%, #161b1e 48%); color: #c8cfcc; font-size: 0.64rem; font-style: normal; }
.preview-timeline { position: relative; display: block; border: 1px solid #353a3d; background: #0d0f11; }
.preview-timeline::before { content: ""; position: absolute; left: 5%; right: 5%; top: 50%; height: 2px; background: #4b5255; }
.preview-timeline b { position: absolute; top: 6px; width: 12%; height: 10px; background: var(--accent); }
.preview-timeline b:nth-child(1) { left: 18%; }
.preview-timeline b:nth-child(2) { left: 48%; width: 8%; background: var(--blue); }
.preview-timeline b:nth-child(3) { left: 71%; width: 16%; background: var(--gold); }
.preview-technical { color: #8f9894; font-family: var(--mono); font-size: 0.62rem; }
.preview-oped { display: grid; grid-template-columns: 70px 1fr; gap: 0.6rem; padding: 0.7rem; }
.preview-episodes { display: grid; align-content: start; gap: 0.35rem; }
.preview-episodes i { padding: 0.35rem; border: 1px solid #373c3f; background: #1d2024; color: #9da5a2; font-family: var(--mono); font-size: 0.62rem; font-style: normal; }
.preview-episodes i:first-child { border-color: var(--accent); color: white; }
.preview-waveforms { position: relative; display: grid; align-content: center; gap: 0.45rem; overflow: hidden; }
.preview-waveforms b { display: block; height: 18px; background: repeating-linear-gradient(90deg, #263238 0 3px, #52636a 3px 5px, #1b2226 5px 8px); clip-path: polygon(0 50%, 4% 22%, 8% 78%, 12% 35%, 18% 66%, 24% 18%, 31% 74%, 38% 42%, 45% 62%, 53% 28%, 62% 73%, 70% 40%, 78% 68%, 87% 30%, 94% 72%, 100% 50%); }
.preview-waveforms em { position: absolute; top: 18%; bottom: 18%; width: 12%; border: 1px solid var(--accent); background: rgba(229,104,53,0.14); color: #f3a987; font-size: 0.58rem; font-style: normal; text-align: center; }
.preview-waveforms em:nth-of-type(1) { left: 15%; }
.preview-waveforms em:nth-of-type(2) { right: 10%; border-color: var(--blue); background: rgba(60,127,192,0.14); color: #8fbce8; }
.work-intro { margin-bottom: 4.5rem; padding-bottom: 3rem; border-bottom: 1px solid var(--line); }
.featured-system-list { display: grid; gap: 6rem; }
.featured-system { display: grid; gap: 1.5rem; }
.featured-system-heading { display: grid; grid-template-columns: minmax(0, 0.55fr) minmax(0, 1fr); gap: 2rem; align-items: end; }
.featured-system-heading .section-kicker { grid-column: 1 / -1; }
.featured-system-heading h3 { margin: 0; font-size: 3rem; }
.featured-system-heading p:last-child { max-width: 65ch; margin: 0; color: var(--muted); }
.featured-system-layout { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.65fr); gap: 1.5rem; align-items: stretch; }
.featured-system.is-reversed .featured-system-visual { order: 2; }
.featured-system-visual { min-width: 0; overflow: hidden; border: 1px solid #292d31; border-radius: var(--radius); background: var(--dark); box-shadow: var(--shadow); }
.featured-system-visual .project-preview { width: 100%; height: 100%; min-height: 430px; }
.featured-system-visual .project-preview img { width: 100%; height: 100%; object-fit: cover; }
.featured-system-details { display: flex; flex-direction: column; min-width: 0; padding: 1.35rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: 0 12px 32px rgba(18,19,22,0.05); }
.featured-system-details dl { display: grid; gap: 0; margin: 0; }
.featured-system-details dl div { padding: 0.75rem 0; border-bottom: 1px solid var(--line); }
.featured-system-details dt { color: var(--muted); font-size: 0.7rem; font-weight: 850; text-transform: uppercase; }
.featured-system-details dd { margin: 0.18rem 0 0; font-size: 0.9rem; font-weight: 750; }
.featured-system-details .text-link { margin-top: auto; padding-top: 1.25rem; }
.featured-metric { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.65rem; align-items: center; margin-top: 1rem; padding: 0.85rem; background: var(--accent-soft); }
.featured-metric span, .featured-metric strong { font-size: 0.85rem; line-height: 1.25; }
.featured-metric strong { color: var(--accent-dark); }
.featured-metric b { color: var(--accent); }
.metric-context { margin: 0.65rem 0 0; color: var(--muted); font-size: 0.78rem; }
.featured-pipeline { display: grid; gap: 0.35rem; margin-top: 1rem; }
.featured-pipeline span { padding: 0.48rem 0.55rem; border-left: 2px solid var(--accent); background: #f7f3ed; font-size: 0.76rem; font-weight: 800; }
.featured-pipeline b { color: var(--accent); line-height: 1; }
.secondary-work .project-card-body > strong { font-size: 0.86rem; line-height: 1.4; }
.card-case-link { margin-top: auto; padding-top: 0.25rem; color: var(--accent-dark); font-size: 0.84rem; font-weight: 850; }
.editorial-project-hero { padding: clamp(4rem, 8vw, 7rem) 0 3rem; }
.editorial-project-hero h1 { max-width: 980px; font-size: 4.35rem; }
.project-hero-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: start; }
.project-hero-heading .status-badge { margin-top: 0.8rem; }
.project-function { max-width: 72ch !important; font-size: 1.12rem !important; }
.editorial-project-hero .metadata-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 3rem; }
.editorial-project-hero .metadata-grid div { padding: 1rem 0; border: 0; border-top: 1px solid var(--line); border-radius: 0; background: transparent; }
.editorial-project-hero .metadata-grid div + div { padding-left: 1rem; border-left: 1px solid var(--line); }
.project-demonstration { padding-top: 2rem; background: var(--surface); }
.project-demonstration .demo-panel { margin-bottom: 0; }
.demo-caption { margin: 0; padding: 0.8rem 1rem; border-top: 1px solid #34383c; background: #17191c; color: #b9c0bd !important; font-size: 0.76rem; }
.outcome-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 1rem; border: 1px solid var(--line); background: var(--surface); }
.outcome-strip div { padding: 1.15rem; border-right: 1px solid var(--line); }
.outcome-strip div:last-child { border-right: 0; }
.outcome-strip span, .outcome-strip strong { display: block; }
.outcome-strip span { color: var(--accent-dark); font-size: 0.7rem; font-weight: 850; text-transform: uppercase; }
.outcome-strip strong { margin-top: 0.35rem; font-size: 0.9rem; line-height: 1.4; }
.project-story > .case-section { padding: 6rem 0; border-bottom: 0; }
.story-grid { display: grid; grid-template-columns: minmax(250px, 0.72fr) minmax(0, 1.28fr); gap: clamp(2rem, 7vw, 6rem); align-items: start; }
.story-grid header { position: sticky; top: 96px; }
.story-grid header h2 { max-width: 520px; font-size: 2.7rem; }
.section-summary { max-width: 50ch; color: var(--muted); }
.story-copy { max-width: 75ch; }
.story-copy > .clean-list { margin-top: 0; }
.workflow-section .section-heading, .evidence-section .section-heading, .technical-details .section-heading { max-width: 760px; }
.workflow-diagram { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--line); background: var(--surface); }
.workflow-node { min-width: 0; padding: 1.1rem; border-right: 1px solid var(--line); }
.workflow-node:last-child { border-right: 0; }
.workflow-node header { display: flex; gap: 0.55rem; align-items: center; }
.workflow-node header span { color: var(--accent); font-family: var(--mono); font-size: 0.7rem; }
.workflow-node header strong { color: var(--muted); font-size: 0.72rem; text-transform: uppercase; }
.workflow-node h3 { min-height: 4.6em; margin: 1rem 0; font-size: 1rem; }
.workflow-node dl { display: grid; gap: 0.75rem; margin: 0; }
.workflow-node dl div { padding-top: 0.65rem; border-top: 1px solid var(--line); }
.workflow-node dt { color: var(--muted); font-size: 0.65rem; font-weight: 850; text-transform: uppercase; }
.workflow-node dd { margin: 0.18rem 0 0; font-size: 0.78rem; line-height: 1.45; }
.workflow-sequence { margin-top: 3rem; }
.safeguard-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
.safeguard-list li { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 0.8rem; padding: 1rem 0; border-top: 1px solid var(--line); color: var(--muted); }
.safeguard-list span { color: var(--accent); font-family: var(--mono); font-size: 0.72rem; }
.evidence-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.evidence-gallery figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.evidence-gallery figcaption { padding: 0.75rem 0.9rem; border-top: 1px solid var(--line); color: var(--muted); font-size: 0.78rem; }
.evidence-wide { grid-column: 1 / -1; }
.workflow-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.workflow-comparison article { padding: 1.25rem; }
.workflow-comparison article + article { border-left: 1px solid var(--line); background: #f7f4ee; }
.workflow-comparison h3 { font-size: 1rem; }
.workflow-comparison ol { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 1rem 0 0; padding: 0; list-style: none; counter-reset: evidence-steps; }
.workflow-comparison li { counter-increment: evidence-steps; padding: 0.45rem 0.55rem; border: 1px solid var(--line); background: white; font-size: 0.75rem; }
.workflow-comparison li::before { content: counter(evidence-steps, decimal-leading-zero) " "; color: var(--accent); font-family: var(--mono); }
.evidence-label { margin: 0 0 0.5rem; color: var(--accent-dark); font-size: 0.68rem; font-weight: 850; text-transform: uppercase; }
.evidence-terminal { background: var(--dark) !important; color: white; }
.evidence-window-head { display: flex; justify-content: space-between; gap: 1rem; padding: 0.7rem 0.85rem; border-bottom: 1px solid #363a3e; font-family: var(--mono); font-size: 0.7rem; }
.evidence-window-head strong { color: #7ac79f; }
.evidence-queue { min-height: 120px; margin: 0; padding: 1rem 1rem 1rem 2.2rem; color: #c9cfcc; font-size: 0.72rem; }
.evidence-queue code { background: transparent; color: inherit; }
.evidence-log { min-height: 120px; border-radius: 0; background: #101214; color: #b9c2be; font-size: 0.7rem; }
.match-evidence { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.match-evidence article { min-width: 0; padding: 1rem; border-right: 1px solid var(--line); }
.match-evidence article:last-child { border-right: 0; }
.match-evidence span { display: block; margin-bottom: 0.4rem; color: #31885f; font-size: 0.68rem; font-weight: 850; text-transform: uppercase; }
.match-evidence strong { display: block; font-family: var(--mono); font-size: 0.78rem; }
.match-evidence p { margin: 0.55rem 0 0; color: var(--muted); font-size: 0.76rem; }
.match-evidence .match-rejected span { color: var(--danger); }
.match-evidence .match-ambiguous span { color: var(--gold); }
.evidence-tracker { background: white; }
.evidence-tracker .evidence-window-head { border-color: var(--line); color: var(--ink); }
.tracker-evidence-row { display: grid; grid-template-columns: 1fr repeat(3, auto); gap: 0.5rem; padding: 0.85rem; border-bottom: 1px solid var(--line); font-size: 0.72rem; }
.tracker-evidence-row b { color: #31885f; }
.tracker-evidence-row.is-review { background: #fff7e4; }
.tracker-evidence-row.is-review b { color: var(--gold); }
.evidence-placeholder { display: grid; min-height: 220px; place-items: center; padding: 2rem; background: var(--dark); color: white; text-align: center; }
.result-section h2 { font-size: 2.7rem; }
.technical-details { background: var(--surface-strong); }
.disclosure-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.disclosure-grid > .case-section { padding: 0; border: 0; }
.disclosure-grid .case-disclosure { height: 100%; }
.supporting-module { margin: 0 0 4rem; padding: 0; border-bottom: 0; }
.supporting-module .case-disclosure { background: var(--surface); }
@media (max-width: 1120px) {
  .nav-toggle { display: block; }
  .nav-links { position: absolute; top: 64px; left: 1rem; right: 1rem; display: none; flex-direction: column; align-items: stretch; padding: 0.6rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
  .nav-links.is-open { display: flex; }
  .nav-contact-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0.35rem 0 0; padding: 0.5rem 0 0; border-top: 1px solid var(--line); border-left: 0; }
  .nav-links .nav-action { text-align: center; }
}
@media (max-width: 980px) {
  .hero-grid, .hero-editorial-grid, .split-section, .case-layout, .oped-layout, .calendar-layout, .resume-layout, .story-grid { grid-template-columns: 1fr; }
  .hero-editorial-grid { min-height: 0; }
  .hero h1 { font-size: 3.8rem; }
  .editorial-project-hero h1 { font-size: 3.6rem; }
  .story-grid header h2, .result-section h2 { font-size: 2.35rem; }
  .hero-system-composition { width: min(100%, 720px); min-height: 520px; margin-inline: auto; }
  .featured-system-heading { grid-template-columns: 1fr; }
  .featured-system-layout { grid-template-columns: 1fr; }
  .featured-system.is-reversed .featured-system-visual { order: 0; }
  .featured-system-visual .project-preview { min-height: 390px; }
  .editorial-project-hero .metadata-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .editorial-project-hero .metadata-grid div + div { padding-left: 0; border-left: 0; }
  .editorial-project-hero .metadata-grid div:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--line); }
  .story-grid header { position: static; }
  .workflow-diagram { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workflow-node:nth-child(2) { border-right: 0; }
  .workflow-node:nth-child(-n + 2) { border-bottom: 1px solid var(--line); }
  .three-up, .project-index-grid, .capability-grid, .process-grid, .metadata-grid, .workflow-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .case-aside { position: static; }
  .demo-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .demo-split, .recon-grid, .comparison-grid, .video-panes, .impact-strip, .metric-grid, .history-grid, .contact-grid, .footer-grid { grid-template-columns: 1fr; }
  .calendar-dashboard-grid { grid-template-columns: 1fr; }
  .calendar-dashboard-toolbar { align-items: flex-start; flex-direction: column; }
  .oms-stage { grid-template-columns: 190px minmax(0, 1fr); }
  .oms-poster { min-height: 430px; }
  .oms-cms { min-height: 430px; padding-right: 1.6rem; }
  .oms-overlay { position: relative; top: auto; right: auto; grid-column: 1 / -1; width: auto; height: 520px; margin: 1rem; }
  .vmaf-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .vmaf-summary div:nth-child(2) { border-right: 0; }
  .vmaf-summary div:nth-child(-n + 2) { border-bottom: 1px solid #343a3b; }
}
@media (max-width: 720px) {
  body { font-size: 16px; }
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
  .hero-editorial-grid { gap: 2.5rem; padding: 3.5rem 0; }
  .hero-system-composition { display: grid; gap: 0.75rem; min-height: 0; }
  .system-layer { position: relative; inset: auto; width: 100%; height: 120px; transform: none; }
  .layer-inventory { grid-row: 1; height: 220px; }
  .layer-reconciliation { grid-row: 2; height: 160px; }
  .hero-system-composition figcaption { position: static; padding-top: 0.35rem; }
  .work-intro { margin-bottom: 3rem; }
  .featured-system-list { gap: 4rem; }
  .featured-system-heading h3 { font-size: 2rem; }
  .featured-system-visual .project-preview { min-height: 250px; }
  .preview-reconciliation { padding: 0.4rem; }
  .preview-column { padding: 0.45rem; }
  .featured-metric { grid-template-columns: 1fr; }
  .featured-metric b { transform: rotate(90deg); width: fit-content; }
  .project-hero-heading { grid-template-columns: 1fr; gap: 0.5rem; }
  .project-hero-heading .status-badge { margin-top: 0; }
  .editorial-project-hero .metadata-grid, .outcome-strip, .workflow-diagram, .workflow-comparison, .match-evidence, .evidence-gallery, .disclosure-grid { grid-template-columns: 1fr; }
  .editorial-project-hero .metadata-grid div, .editorial-project-hero .metadata-grid div:nth-child(even) { padding: 0.8rem 0; border-left: 0; }
  .outcome-strip div { border-right: 0; border-bottom: 1px solid var(--line); }
  .outcome-strip div:last-child { border-bottom: 0; }
  .project-story > .case-section { padding: 4rem 0; }
  .workflow-node, .workflow-node:nth-child(2) { border-right: 0; border-bottom: 1px solid var(--line); }
  .workflow-node:last-child { border-bottom: 0; }
  .workflow-node h3 { min-height: 0; }
  .workflow-comparison article + article { border-top: 1px solid var(--line); border-left: 0; }
  .evidence-wide { grid-column: auto; }
  .match-evidence article { border-right: 0; border-bottom: 1px solid var(--line); }
  .match-evidence article:last-child { border-bottom: 0; }
  .tracker-evidence-row { grid-template-columns: 1fr; }
  .two-up, .three-up, .project-index-grid, .capability-grid, .process-grid, .metadata-grid, .workflow-steps, .inventory-stats, .signal-grid, .practice-list, .inventory-impact { grid-template-columns: 1fr; }
  .practice-list article, .practice-list article:nth-child(even) { padding: 1rem 0; border-right: 0; }
  .project-card-link { grid-template-rows: 180px 1fr; }
  .project-visual { min-height: 180px; }
  .demo-controls { grid-template-columns: 1fr; }
  .calendar-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .calendar-summary-grid > div:nth-child(2) { border-right: 0; }
  .calendar-summary-grid > div:nth-child(-n + 2) { border-bottom: 1px solid #d5ded9; }
  .calendar-dashboard-footer { align-items: flex-start; flex-direction: column; }
  .calendar-event-row { grid-template-columns: 56px minmax(0, 1fr) auto; }
  .calendar-event-row .calendar-edit { grid-column: 2; justify-self: start; padding: 0; }
  .calendar-week-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
  .nav-contact-actions { grid-template-columns: 1fr; }
  .resume-job-heading { flex-direction: column; gap: 0.35rem; }
  .resume-job-heading time { white-space: normal; }
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

function setupCalendarDemo(root) {
  const studio = root.querySelector("[data-calendar-studio]");
  const syncButton = root.querySelector("[data-calendar-sync]");
  const status = root.querySelector("[data-calendar-status]");
  const syncState = root.querySelector("[data-calendar-sync-state]");
  const log = root.querySelector("[data-calendar-log]");
  const viewButtons = Array.from(root.querySelectorAll("[data-calendar-view]"));
  const panels = Array.from(root.querySelectorAll("[data-calendar-view-panel]"));

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.getAttribute("data-calendar-view");
      viewButtons.forEach((node) => {
        const active = node === button;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.getAttribute("data-calendar-view-panel") === view;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      setStatus((view ? view.charAt(0).toUpperCase() + view.slice(1) : "Calendar") + " view loaded");
    });
  });

  if (studio) {
    studio.addEventListener("change", () => {
      setStatus(studio.value + " workspace loaded");
      if (log) log.textContent = "Studio filter changed; public payload remains scoped to approved fields";
    });
  }

  if (syncButton) {
    syncButton.addEventListener("click", () => {
      syncButton.disabled = true;
      syncButton.textContent = "Syncing...";
      setStatus("Reading Airtable changes...");
      if (log) log.textContent = "Airtable records read; checking publishing state";
      window.setTimeout(() => {
        syncButton.disabled = false;
        syncButton.textContent = "Sync again";
        if (syncState) syncState.textContent = "last sync just now";
        if (log) log.textContent = "Public payload ready for review";
        setStatus("Sync complete; review queue unchanged");
      }, 700);
    });
  }

  root.querySelectorAll("[data-calendar-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-calendar-event]");
      if (!row) return;
      row.classList.add("is-review-row");
      const chip = row.querySelector(".calendar-chip");
      if (chip) {
        chip.classList.remove("is-published");
        chip.classList.add("is-review");
        chip.textContent = "Needs review";
      }
      button.textContent = "Queued";
      setStatus("Change queued for human review");
      if (log) log.textContent = "Draft change captured; no public fields updated";
    });
  });
}

document.querySelectorAll("[data-calendar-demo]").forEach(setupCalendarDemo);`;

const resumeText = `RESUME

SUMMARY
Production operations and media workflow professional with experience across animation, VFX, streaming media, localization, digital distribution and post-production. Builds clear trackers, review systems, status reporting and lightweight tools for evolving creative workflows.

EMPLOYMENT
${employment.map((job) => `${job.company} - ${job.role}
${job.dates}
${job.bullets.map((bullet) => `- ${bullet}`).join("\n")}`).join("\n\n")}

EDUCATION
Santa Clara University - BA in Communication

TOOLS
${resumeTools.join(", ")}

LANGUAGES
${resumeLanguages.join(", ")}
`;

const readme = `# Ali Aslam Portfolio

Static GitHub Pages portfolio for Ali Aslam, focused on media operations systems, creative production, production workflow design, browser automation, media asset management and AI-assisted workflow experimentation.

The portfolio uses plain HTML, CSS and vanilla JavaScript. There is no framework, backend or package install. The generator in \`scripts/generate-portfolio.mjs\` rebuilds the pages, copies every required public demo and image, validates local references and fails when an asset is missing.

Repository reference: <https://github.com/Ali1128/ali-aslam-portfolio>

## Project List

- Media Inventory Operations Console
- Asset Status Reconciliation
- VMAF Video Quality Check
- Anime OP/ED Timecodes
- K-Taekwondo Calendar
- Instructional Keyframes

## File Structure

\`\`\`text
.
├── index.html
├── projects.html
├── about.html
├── styles.css
├── script.js
├── projects/
│   ├── media-inventory-console/
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

The interactive demos are public reconstructions with fictional internal-tool data. The Browser-Side File Linking Search iteration is preserved inside the Media Inventory Console case study. Demonstration metrics and timecodes are labeled as fictional values.

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

The portfolio includes LinkedIn and GitHub links. The plain-text resume contains no name, email, phone number, social profile or other direct contact information.

## Deployment

This repo is GitHub Pages compatible. Commit the static files and configure Pages to serve the repository root from the selected branch.

## Privacy And Sanitization

Do not commit credentials, browser session files, private screenshots, private API details, employee data, unreleased title information, private Airtable identifiers, Cloudflare configuration or private Softr settings. Use \`reference-private/\` locally for non-public source material; it is ignored by Git.

See \`docs/privacy-and-sanitization.md\` and \`SECURITY.md\`.

## AI Collaboration Disclosure

Codex, Gemini and Claude Code supported iterative development, debugging, interface prototyping and code refinement. Ali defined the production problems, workflow architecture, domain logic, validation requirements and operational testing.`;

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

function mergedFileLinkingPage() {
  const body = `<section class="page-hero">
    <div class="shell">
      <p class="eyebrow">Case study merged</p>
      <h1>File Linking Search is now part of the Media Inventory Console case study.</h1>
      <p>The earlier browser-side search and inventory-hydration iteration, its demo, safeguards, testing notes and sanitized code are preserved in the combined case study.</p>
      <div class="hero-actions"><a class="button button-primary" href="../media-inventory-console/#file-linking-module">Open the merged case study</a></div>
    </div>
  </section>`;

  return layout({
    title: "File Linking Search | Merged Case Study",
    description: "The browser-side file linking search module is preserved inside the Media Inventory Console case study.",
    active: "projects",
    prefix: "../../",
    body
  });
}

function validateGeneratedReferences() {
  const broken = [];
  const attributePattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  const ignored = /^(?:#|https?:|mailto:|tel:|data:|javascript:)/i;

  for (const htmlPath of [...GENERATED_HTML].sort()) {
    const html = readFileSync(htmlPath, "utf8");
    let match;

    while ((match = attributePattern.exec(html)) !== null) {
      const reference = match[2].trim();
      if (!reference || ignored.test(reference)) continue;

      const pathOnly = reference.split(/[?#]/, 1)[0];
      let decoded;
      try {
        decoded = decodeURIComponent(pathOnly);
      } catch {
        broken.push({ htmlPath, reference, reason: "invalid URL encoding" });
        continue;
      }

      const target = decoded.startsWith("/")
        ? resolve(ROOT, `.${decoded}`)
        : resolve(dirname(htmlPath), decoded);

      if (!target.startsWith(ROOT)) {
        broken.push({ htmlPath, reference, reason: "path leaves the public site root" });
        continue;
      }

      if (!existsSync(target)) {
        broken.push({ htmlPath, reference, reason: "missing target" });
        continue;
      }

      if (statSync(target).isDirectory() && !existsSync(join(target, "index.html"))) {
        broken.push({ htmlPath, reference, reason: "directory is missing index.html" });
      }
    }
  }

  return broken;
}

const requiredCopies = [
  ["scripts/templates/demos/media-inventory-console/index.html", "demos/media-inventory-console/index.html"],
  ["scripts/templates/demos/file-linking-search/index.html", "demos/file-linking-search/index.html"],
  ["scripts/templates/demos/asset-status-reconciliation/index.html", "demos/asset-status-reconciliation/index.html"],
  ["scripts/source-assets/images/media-inventory-overlay-sanitized.jpeg", "assets/images/media-inventory-overlay-sanitized.jpeg"],
  ["scripts/source-assets/images/op-ed-anime-sequence.png", "assets/images/op-ed-anime-sequence.png"],
  ["scripts/source-assets/images/vmaf-anime-comparison.png", "assets/images/vmaf-anime-comparison.png"],
  ["scripts/source-assets/images/ktaekwondo-calendar-august-2026.png", "assets/images/ktaekwondo-calendar-august-2026.png"],
  ["scripts/source-assets/images/ktaekwondo-calendar-dashboard.png", "assets/images/ktaekwondo-calendar-dashboard.png"],
  ["scripts/source-assets/images/ktaekwondo-keyframe-01.jpg", "assets/images/ktaekwondo-keyframe-01.jpg"],
  ["scripts/source-assets/images/ktaekwondo-keyframe-02.jpg", "assets/images/ktaekwondo-keyframe-02.jpg"],
  ["scripts/source-assets/images/ktaekwondo-keyframe-03.jpg", "assets/images/ktaekwondo-keyframe-03.jpg"],
  ["scripts/source-assets/images/ktaekwondo-keyframe-04.jpg", "assets/images/ktaekwondo-keyframe-04.jpg"],
  ["scripts/source-assets/images/ktaekwondo-keyframe-05.jpg", "assets/images/ktaekwondo-keyframe-05.jpg"]
];

for (const [source, output] of requiredCopies) copyRequired(source, output);

write("index.html", homePage());
write("projects.html", projectsPage());
write("about.html", aboutPage());
write("styles.css", css);
write("script.js", js);
write("README.md", readme);
write(".gitignore", gitignore);
write(".env.example", envExample);
write("SECURITY.md", security);
write("docs/privacy-and-sanitization.md", privacyDoc);
write("docs/resume.txt", resumeText);
write("demos/README.md", demosReadme);
write("assets/data/demo-inventory.json", JSON.stringify(inventoryFixture, null, 2));
write("assets/data/reconciliation-fixtures.json", JSON.stringify(reconFixture, null, 2));
write("assets/code/sanitized-excerpts.md", excerpts);

for (const project of publicProjects) {
  write(`projects/${project.slug}/index.html`, renderProjectPage(project));
}
write("projects/file-linking-search/index.html", mergedFileLinkingPage());

const brokenReferences = validateGeneratedReferences();

if (brokenReferences.length) {
  for (const item of brokenReferences) {
    console.error(`BROKEN ${item.htmlPath.replace(`${ROOT}`, "")} -> ${item.reference} (${item.reason})`);
  }
  console.error(`Broken references: ${brokenReferences.length}`);
  process.exit(1);
}

console.log(`Generated ${publicProjects.length} project case studies, 3 standalone demos and shared site files.`);
console.log("Broken references: 0");
