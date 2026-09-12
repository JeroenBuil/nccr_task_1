# NCCR Task 1 — Fast Periodic Visual Stimulation (FPVS)

A Vue 3 web app that runs a Fast Periodic Visual Stimulation (FPVS) experiment in the browser: a rapid sequence of base images is shown at a fixed rate, with an "oddball" image inserted at a regular interval. The app measures how accurately stimuli were actually presented (timing jitter, dropped frames) and reports the results.

See [Task 1 WriteUp - Jeroen Buil.pdf](Task%201%20WriteUp%20-%20Jeroen%20Buil.pdf) for the design decisions and other comments.

## How it works

The app is a single-page Vue app with three views, switched via a small Pinia store (`useFpvsStore`) rather than a router:

- **Setup** ([src/views/SetupView.vue](src/views/SetupView.vue)) — configure the run: base presentation rate (Hz), oddball position (every Nth stimulus), sequence length (s), and stimulus set. Values are stored in the Pinia store.
- **Run** ([src/views/RunView.vue](src/views/RunView.vue)) — generates the stimulus sequence and displays it. A `requestAnimationFrame` loop compares elapsed time against the target frame interval to decide when to advance to the next image, and logs the actual onset time of every stimulus shown (`store.onsetLog`). If a frame is delayed enough that a target index is skipped, that stimulus is recorded as dropped.
- **Results** ([src/views/ResultsView.vue](src/views/ResultsView.vue)) — computes timing statistics (mean/std/min/max interval, worst-case deviation from the ideal schedule, dropped-stimulus counts) for all stimuli and for oddballs specifically, and renders them as tables plus two Chart.js time-series charts (interval timing, dropped-stimulus gaps). An **Export CSV** button downloads the run's onset log (plus run setup metadata) as a CSV file for offline analysis.

### Key modules

| File | Purpose |
|---|---|
| [src/stores/fpvs.js](src/stores/fpvs.js) | Pinia store holding run config, the generated sequence, the onset log, and the current view. |
| [src/config/stimulusSets.js](src/config/stimulusSets.js) | Registry of available stimulus sets (image filenames, folder path). Add a new experiment's images here. |
| [src/utils/sequenceUtils.js](src/utils/sequenceUtils.js) | Builds the ordered stimulus sequence (random base images with no immediate repeats, oddball inserted every Nth slot). |
| [src/utils/chartUtils.js](src/utils/chartUtils.js) | Chart.js wrapper for rendering the time-series scatter charts in Results. |
| [src/utils/csvExport.js](src/utils/csvExport.js) | Builds the onset-log CSV (run setup metadata + per-stimulus onset rows) and triggers the browser download. |

Stimulus images live under [public/stimuli/](public/stimuli/) and are served directly by Vite/the static host; `stimulusSets.js` maps a set id to its folder and filenames.

## Setup

Requires Node.js (with npm). If you don't have it installed:

**Windows**

1. Download the LTS installer from [nodejs.org](https://nodejs.org/) and run it (npm is included).
2. Alternatively, with [winget](https://learn.microsoft.com/windows/package-manager/winget/): `winget install OpenJS.NodeJS.LTS`
3. Verify in a new terminal: `node -v` and `npm -v`

**Linux**

- Via your distro's package manager, e.g.:
  - Arch/CachyOS: `sudo pacman -S nodejs npm`
  - Debian/Ubuntu: `sudo apt install nodejs npm`
- Or via [nvm](https://github.com/nvm-sh/nvm) if you want a specific/up-to-date version:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  nvm install --lts
  ```
- Verify: `node -v` and `npm -v`

Once Node.js/npm are available, install the project's dependencies:

```bash
npm install
```

## Running

Start the dev server (with hot reload):

```bash
npm run dev
```

Then open the printed local URL (typically http://localhost:5173) in a browser.

## Other commands

```bash
npm run build    # production build, output to dist/
npm run preview  # serve the production build locally
npm test         # run unit tests (Vitest)
```

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>` SFCs)
- [Pinia](https://pinia.vuejs.org/) for cross-view state
- [Chart.js](https://www.chartjs.org/) for result charts
- [Vite](https://vite.dev/) for dev server/build, [Vitest](https://vitest.dev/) for tests
