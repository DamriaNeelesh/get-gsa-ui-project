## Get-GSA Opportunity Workbench

Modern search workspace for shaping federal opportunity pursuits. Built with Next.js 16, TypeScript, and Tailwind.

### Setup

```bash
npm install
npm run dev
```

The app starts on [http://localhost:3000](http://localhost:3000).

### UX Notes

- Parameter panel uses headless, accessible comboboxes with chipified multi-selects and inline ceiling validation.
- Apply waits behind a lightweight skeleton (300–600 ms) while results update and persist to the URL/localStorage.
- Dashboard mirrors visible results with stacked status bar, live KPI cards, and average progress meter.

### Accessibility & State

- Labels, focus-rings, and aria messaging on form controls; keyboard navigation for all listbox/combobox widgets.
- Filters, presets, and view mode persist via `localStorage`; sharable URLs sync the active filter payload.
- Toast feedback announces saved presets and submitted statuses.
