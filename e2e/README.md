# MyTimetable e2e tests

End-to-end tests for [MyTimetable](https://github.com/compsci-adl/mytimetable), the drag-and-drop timetable planner for Adelaide University students, written with [e2e](https://e2e.com).
The suite runs against the app's own mock course API, so it needs no backend and no account.

## What it tests

- `tests/welcome.e2e.ts`: a first-time visitor opens the planner from the welcome screen.
- `tests/timetable.e2e.ts`: locator tests for the planner:
  - add a course through the subject and course search
  - remove an enrolled course
  - list the class numbers to enrol in, in the "Ready for Enrolment" dialog
  - drag a workshop to another time, then check the new class number
- `tests/agentic.e2e.ts`: the same flows driven by the agent from plain-English goals, each one followed by a locator check.

### Patterns worth copying

- **Drag and drop with hidden drop zones.**
  The other times for a class only appear while a drag is held, so `dragTo` has no target yet.
  The test holds the pointer down with `browser.mouse`, waits for the drop zone, then releases it on that zone.
- **A button that never holds still.**
  "Start scheduling!" pulses forever, so it never passes the stability check before a tap.
  The test taps the center of its box with `screen.tapAt`.
- **Skipping onboarding.**
  `browser.addInitScript` sets the app's `MTT.first-time` flag before the page loads, as for a returning visitor.

## Run

Use Node 22.22.3+, 24.8+, or 26+, and pnpm for the app.
From the repository root, install the app once:

```bash
pnpm install
```

Then from this folder:

```bash
npm install
npm test
```

The runner starts the Vite dev server with `VITE_API_BASE_URL=/mock` at `http://localhost:5173`.
It downloads Chromium on the first run if needed.

## Agent tests

Set a [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) key:

```bash
AI_GATEWAY_API_KEY="your-key" npm test
```

Without the key, the agent tests are skipped.
Results are in `.e2e/report.json`, and each test's trace page is in `.e2e/results/`.

See [e2e.config.ts](e2e.config.ts) and [tests/](tests/) for the setup.

Last checked with e2e 0.23.1, @e2e-dev/web 0.16.0, and Node 26.
