# Get-GSA Opportunity Workspace

A polished mini-workspace built with Next.js, TypeScript, and Tailwind CSS for exploring GSA-style opportunities. The experience focuses on rapid filter tuning, responsive insights, and thoughtful micro-interactions.

## Getting Started

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## UX Highlights

- Progressive filter panel with inline validation, preset save/load, and URL-sync apply flow.
- Debounced quick-search paired with chipified keyword filters for fast refining.
- Details drawer with stage timeline and contextual actions (Mark as submitted) that feeds the dashboard.
- Responsive layout (375px → desktop) with accessible headless inputs and skeleton loading states.

## Accessibility & State Notes

- All form controls include explicit labels, keyboard-focus rings, aria-live feedback, and Headless UI comboboxes for multi-selects.
- Filter state persists to both the URL (shareable) and localStorage (last session + preset + view preference).
- Toast confirmations (save preset / mark submitted) provide non-blocking feedback.

## If I Had More Time…

- Add CSV export of the current slice and configurable column visibility.
- Layer in dark mode and keyboard shortcuts for switching views/presets.
