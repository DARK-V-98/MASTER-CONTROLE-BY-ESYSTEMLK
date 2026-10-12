# Master Control dashboard design

Standalone, responsive dashboard design prototype for the Master Control business operating system. This folder is independent of the existing React app in `apps/web`.

## Preview

From the repository root, run:

```sh
python -m http.server 4173 --directory dashboard-design/dist
```

Open http://localhost:4173. No package installation or build step is required. Alternatively, open `dist/index.html` directly in a browser.

## Included

- Owner overview with a sample AI briefing, performance cards and revenue chart
- Approval queue with local approve, edit and reject interactions
- Finance and operations views
- Customer, people, automation and report design views
- Business and reporting-period selectors, workspace search and responsive mobile navigation

## Scope

All figures and business records are illustrative. The briefing and AI answers are scripted design content. Approval changes are held in browser memory and reset on reload; no real payments, stock movements or messages occur. Authentication, tenant isolation, service connections and production workflows are not implemented. This prototype does not claim completion of any production phase in `AI_AGENT_BUILD_GUIDE.md`.

Fonts are loaded from Google Fonts when available, with local sans-serif fallbacks. Sites hosting identity, Git metadata and credentials are excluded from this portable copy.

## Files

`dist/index.html` is the page shell, `dist/style.css` contains the responsive design, and `dist/app.js` contains sample data and browser interactions.

## Validation

JavaScript syntax checked with `node --check dashboard-design/dist/app.js`. Desktop and phone layouts and a local approval interaction were checked in the browser during design creation.
