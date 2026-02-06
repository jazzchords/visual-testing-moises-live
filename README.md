# Visual Testing – Moises Live

Visual regression tests for [Moises Live](https://moises-live-ui-v3.vercel.app/v3) using [Playwright](https://playwright.dev/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm

## Installation

```bash
npm install
npx playwright install
```

The second command installs browser binaries (Chromium, Firefox, WebKit) for Playwright.

## Running tests

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/moises-live-multilang.spec.ts
npx playwright test tests/moises-live-flow.spec.ts
npx playwright test tests/moises-live-authenticated.spec.ts
```

## Updating snapshots

When the UI changes intentionally, update the baseline screenshots:

```bash
npx playwright test --update-snapshots
```

## Test suite

| File | Description |
|------|-------------|
| `moises-live-multilang.spec.ts` | Layout and translations across 34 locales (welcome, main, loading, music tab). |
| `moises-live-flow.spec.ts` | Full UI flow: welcome → main → music tab (guest validation, mute blocked, slider limit) → speech tab. |
| `moises-live-authenticated.spec.ts` | Authenticated flow: token injection and mute behavior when logged in. |

## Configuration

- **Test directory:** `./tests`
- **Browsers:** Chromium, Firefox, WebKit (Chromium uses `srgb` color profile and viewport 420×600)
- **Reporter:** HTML report (`npx playwright show-report` after a run)
- **Retries:** 2 on CI, 0 locally

## Technical Highlights

- **Async handling:** Smart waits (e.g. `toBeVisible`) for AI loading states and network variations.
- **Robust selectors:** `getByRole` and text filters to avoid breakage from CSS class changes.
- **Auth bypass:** State injection for faster, stable testing without UI login flows.

## License

ISC
