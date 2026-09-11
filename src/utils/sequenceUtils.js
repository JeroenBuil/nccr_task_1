/**
 * Builds the ordered stimulus sequence for one FPVS run.
 * Base images are placed in random order with no immediate repeats;
 * the oddball image is placed every `oddballEvery`-th slot.
 *
 * @param {number} baseRateHz - stimulus presentation rate in Hz
 * @param {number} oddballEvery - oddball position within each cycle (5 = every 5th slot)
 * @param {number} sequenceLengthSec - target run duration in seconds
 * @param {string[]} baseImagePaths - resolved URLs of the base images
 * @param {string} oddballImagePath - resolved URL of the oddball image
 * @returns {Array<{image: string, isOddball: boolean}>} ordered stimulus sequence
 */
export function generateSequence({ baseRateHz, oddballEvery, sequenceLengthSec, baseImagePaths, oddballImagePath }) {
    const nStimuli = Math.ceil(sequenceLengthSec * baseRateHz)
    const nBaseImages = baseImagePaths.length

    let sequence = []
    let previousBaseImage = null
    for (let iStim = 1; iStim <= nStimuli; iStim++) {
        const stimIndex = iStim - 1 // offset iStim number to get index
        
        // Every oddBallEvery-th slot insert the oddballImage
        if (iStim % oddballEvery === 0) {
            sequence[stimIndex] = { image: oddballImagePath, isOddball: true }
            previousBaseImage = null // oddball image breaks immediate repeat, so reset previousBaseImage to null
        }
        // Else: insert a random base image, without allowing immediate repeats
        else {
            const noRepeatCandidates = baseImagePaths.filter((path) => path !== previousBaseImage) // filter out previous base image
            const randomBaseIndex = Math.floor(Math.random() * noRepeatCandidates.length) // take random index from the noRepeat candidates
            const randomImage = noRepeatCandidates[randomBaseIndex]
            sequence[stimIndex] = { image: randomImage, isOddball: false }
            previousBaseImage = randomImage
        }
    }
    return sequence
}
