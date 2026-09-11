import { defineStore } from 'pinia'

/**
 * Shared state for the FPVS app, used by all three views (Setup, Run, Results)
 * => maintains the same config and results when navigation between them.
 */
export const useFpvsStore = defineStore('fpvs', {
  state: () => ({
    /** Current view mounted in App.vue. */
    currentView: 'setup', // options: 'setup' | 'run' | 'results'

    // --- Setup config ---
    /** Stimulus presentation rate [Hz] */
    baseRateHz: 6,
    /** Oddball stimuli position within each cycle (5 = every 5th stimulus) */
    oddballEvery: 5,
    /** Sequence length [s] (default ~60s) */
    sequenceLengthSec: 60,
    /** Name of the stimuli set folder (under public/stimuli/) */
    stimulusSet: 'fpvs',

    // --- Generated at Run start ---
    /** Ordered stimulus sequence for this run: [{ image, isOddball }, ...]. */
    sequence: [],

    // --- Run output ---
    /** PLACEHOLDER: Onset timestamps (ms) logged by Run and displayed in Results. */
    onsetLog: [],
  }),
  actions: {
    /** Switches the view App.vue renders. */
    goTo(view) {
      this.currentView = view
    },
  },
})
