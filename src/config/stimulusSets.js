/**
 * Lookup of available stimulus sets, keyed by id.
 * Each entry has:
 *   - label: full name of the stimulus set
 *   - path: folder path under public/ its images live in
 *   - baseImages: array of base image filenames
 *   - oddballImage: oddball image filename
 * Adding a new experiment's stimuli means adding one entry here —
 * no other file needs to know the filenames.
 */
export const STIMULUS_SETS = {
  fpvs: {
    label: 'Fast Periodic Visual Stimulation (FPVS)',
    path: 'stimuli/fpvs',
    baseImages: ['base_01.png', 'base_02.png', 'base_03.png', 'base_04.png'],
    oddballImage: 'oddball_01.png',
  },
}
