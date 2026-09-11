/**
 * Builds a CSV string: run setup metadata, a blank line, then the onset log table.
 *
 * @param {number} baseRateHz - stimulus presentation rate in Hz
 * @param {number} oddballEvery - oddball position within each cycle (5 = every 5th slot)
 * @param {number} sequenceLengthSec - target run duration in seconds
 * @param {string} stimulusSet - id of the stimulus set used for this run
 * @param {string} runStartDateTime - wall-clock time the run started (ISO string)
 * @param {Array<{index: number, image: string, isOddball: boolean, onsetMs: number}>} onsetLog
 * @returns {string} CSV content, ready to write to a file
 */
export function buildOnsetLogCsv({
  baseRateHz,
  oddballEvery,
  sequenceLengthSec,
  stimulusSet,
  runStartDateTime,
  onsetLog,
}) {
  const metaLines = [
    `baseRateHz,${baseRateHz}`,
    `oddballEvery,${oddballEvery}`,
    `sequenceLengthSec,${sequenceLengthSec}`,
    `stimulusSet,${stimulusSet}`,
    `runStartDateTime,${runStartDateTime}`,
  ]

  const dataLines = [
    'index,image,isOddball,onsetMs',
    ...onsetLog.map((entry) => `${entry.index},${entry.image},${entry.isOddball},${entry.onsetMs}`),
  ]

  return [...metaLines, '', ...dataLines].join('\n')
}

/** Triggers a browser download of the given text content as a file. */
export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
