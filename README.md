# Ali Aslam Portfolio

Static GitHub Pages portfolio for Ali Aslam, focused on media operations systems, creative production, production workflow design, browser automation, media asset management and AI-assisted workflow experimentation.

The portfolio uses plain HTML, CSS and vanilla JavaScript. There is no framework, backend or package install. The generator in `scripts/generate-portfolio.mjs` rebuilds the pages, copies every required public demo and image, validates local references and fails when an asset is missing.

Repository reference: <https://github.com/Ali1128/ali-aslam-portfolio>

## Project List

- Season-Level Media Inventory Operations Console
- Ingest Status Reconciliation and Airtable Readiness Automation
- Automated Video Version Comparison and Difference Reporter
- Dataset-Assisted Opening and Ending Timestamp Detection
- Live Multi-Studio Schedule and Calendar Platform
- AI-Assisted Instructional Keyframe Selection

## File Structure

```text
.
├── index.html
├── projects.html
├── about.html
├── resume.html
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
```

Older draft project pages may remain in `projects/*.html` while the public navigation uses the route folders above.

## Run Locally

Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Mock Demos

The interactive demos are public reconstructions with fictional internal-tool data. The Browser-Side File Linking Search iteration is preserved inside the Media Inventory Console case study. Demonstration metrics and timecodes are labeled as fictional values.

- Inventory demo data is embedded in `script.js` and mirrored in `assets/data/demo-inventory.json`.
- Reconciliation fixture rows are mirrored in `assets/data/reconciliation-fixtures.json`.
- Sanitized code examples are collected in `assets/code/sanitized-excerpts.md`.
- K-Taekwondo uses authorized public project details and public calendar imagery only.

## Add Or Update A Project

1. Update the project object in `scripts/generate-portfolio.mjs`.
2. Run `node scripts/generate-portfolio.mjs`.
3. Review the generated page under `projects/<slug>/index.html`.
4. Test links, responsive layout and demo interactions.

## Public Links

The portfolio includes Ali's professional email, LinkedIn, GitHub and a generated public resume PDF. No phone number or private contact data is included.

## Deployment

This repo is GitHub Pages compatible. Commit the static files and configure Pages to serve the repository root from the selected branch.

## Privacy And Sanitization

Do not commit credentials, browser session files, private screenshots, private API details, employee data, unreleased title information, private Airtable identifiers, Cloudflare configuration or private Softr settings. Use `reference-private/` locally for non-public source material; it is ignored by Git.

See `docs/privacy-and-sanitization.md` and `SECURITY.md`.

## AI Collaboration Disclosure

Gemini and Codex supported iterative development, debugging, interface prototyping and code refinement. Ali defined the production problems, workflow architecture, domain logic, validation requirements and operational testing.
