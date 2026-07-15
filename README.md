# Ali Aslam Portfolio

This is a static GitHub Pages portfolio for Ali Aslam. It presents sanitized case studies for media operations, content operations, creative production, technical operations, workflow automation, and AI-assisted production.

The site uses plain HTML, CSS, and vanilla JavaScript. There is no framework, backend, database, package install, or build step.

Repository reference: <https://github.com/Ali1128/ali-aslam-portfolio>

## File Structure

```text
.
├── index.html
├── projects.html
├── about.html
├── resume.html
├── styles.css
├── script.js
├── assets/
│   ├── operations-overlay-portfolio-mockup.html
│   └── streaming-overlay-concept.jpeg
├── projects/
│   ├── streaming-asset-operations-overlay.html
│   ├── asset-status-cross-check-tool.html
│   ├── video-version-comparison-workflow.html
│   ├── sla-asset-readiness-dashboard.html
│   ├── timestamp-dataset.html
│   ├── ai-assisted-qc-prototypes.html
│   └── OMS Overlay/
│       └── Sanitized Overlay v001.jpeg
```

The `projects/OMS Overlay/` folder contains the original image that was already in the workspace. A copy is stored in `assets/` for easier use by the website.

## Run Locally

Because this is a static site, you can open `index.html` directly in a browser.

Optional local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Edit Content

- Main homepage copy: `index.html`
- Project index: `projects.html`
- Biography: `about.html`
- Resume sections: `resume.html`
- Case-study content: files inside `projects/`
- Colors, spacing, typography, cards, and responsive behavior: `styles.css`
- Contact links and resume PDF path: `script.js`

## Replace Contact Links

Open `script.js` and edit the `CONTACT_DETAILS` object near the top:

```js
const CONTACT_DETAILS = {
  email: {
    label: "ali.email@example.com",
    href: "mailto:ali.email@example.com"
  },
  linkedin: {
    label: "linkedin.com/in/your-profile",
    href: "https://www.linkedin.com/in/your-profile"
  },
  github: {
    label: "github.com/Ali1128/ali-aslam-portfolio",
    href: "https://github.com/Ali1128/ali-aslam-portfolio"
  },
  imdb: {
    label: "IMDb profile placeholder",
    href: "https://www.imdb.com/name/your-id"
  },
  resumePdf: ""
};
```

## Add The Resume PDF

1. Add the PDF to the `assets/` folder, for example `assets/ali-aslam-resume.pdf`.
2. Update `resumePdf` in `script.js`:

```js
resumePdf: "assets/ali-aslam-resume.pdf"
```

If the PDF button is used from a project page, use a root-relative path only after confirming your GitHub Pages setup. For the current static structure, the resume button appears on `resume.html`.

## Add A New Project

1. Create a new HTML file in the `projects/` folder.
2. Use the same structure as the existing project pages:
   - Project title
   - One-sentence summary
   - The problem
   - My approach
   - Process or workflow
   - Tools and technologies
   - Sample interface or diagram
   - Results or expected impact
   - Key lessons
   - Next steps
3. Add the new project to `projects.html`.
4. Add it to the homepage featured section only if it should be featured.

## Deploy With GitHub Pages

1. Commit these files to a GitHub repository.
2. In GitHub, open the repository settings.
3. Go to **Pages**.
4. Set the source to the branch that contains `index.html`.
5. Keep the folder as `/root` if these files live at the repository root.
6. Save the settings.

GitHub Pages should serve `index.html` as the homepage. The site uses relative links, so it can work from a user site or project repository.

## Notes

- All project examples use fictional or generalized data.
- The content intentionally avoids confidential systems, internal tool names, proprietary interfaces, credentials, and specific performance claims.
- Animations are subtle and respect `prefers-reduced-motion`.
