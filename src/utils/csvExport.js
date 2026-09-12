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
  // header lines with meta data
  const headerLines = [
    `baseRateHz,${baseRateHz}`,
    `oddballEvery,${oddballEvery}`,
    `sequenceLengthSec,${sequenceLengthSec}`,
    `stimulusSet,${stimulusSet}`,
    `runStartDateTime,${runStartDateTime}`,
  ]

  // 
  const dataLines = [
    'index,image,isOddball,onsetMs',
    ...onsetLog.map((entry) => `${entry.index},${entry.image},${entry.isOddball},${entry.onsetMs}`),
  ]

  // join the header with the data with a white line in between
  return [...headerLines, '', ...dataLines].join('\n')
}

/**
 * Triggers a browser download of the given text content as a file.
 *
 * @param {string} filename - name the downloaded file is saved as
 * @param {string} csvContent - raw CSV text to write to the file
 */
export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv' }) // convert to blob
  const url = URL.createObjectURL(blob) // create url so that the download action can point to something
  const link = document.createElement('a') // create a clickable link that triggers the download attribute (=>only works for <a> elements)
  link.href = url // link this link to the url
  link.download = filename // set filename as suggested file name
  link.click() // programatically click the link
  URL.revokeObjectURL(url) // cleanup (releases Blob)
}
