import { describe, it, expect } from 'vitest'
import { generateSequence } from './sequenceUtils'

const baseImagePaths = [
  '/stimuli/fpvs/base_01.png',
  '/stimuli/fpvs/base_02.png',
  '/stimuli/fpvs/base_03.png',
  '/stimuli/fpvs/base_04.png',
]
const oddballImagePath = '/stimuli/fpvs/oddball_01.png'

const baseConfig = {
  baseRateHz: 6,
  oddballEvery: 5,
  sequenceLengthSec: 60,
  baseImagePaths,
  oddballImagePath,
}

describe('generateSequence', () => {
  it('returns the correct total number of stimuli', () => {
    const sequence = generateSequence(baseConfig)
    expect(sequence).toHaveLength(Math.ceil(baseConfig.sequenceLengthSec * baseConfig.baseRateHz))
  })

  it('places the oddball at every Nth position and nowhere else', () => {
    const sequence = generateSequence(baseConfig)
    sequence.forEach((image, index) => {
      const isOddballPosition = (index + 1) % baseConfig.oddballEvery === 0
      expect(image === oddballImagePath).toBe(isOddballPosition)
    })
  })

  it('never repeats the same image in two consecutive slots', () => {
    const sequence = generateSequence(baseConfig)
    for (let i = 1; i < sequence.length; i++) {
      expect(sequence[i]).not.toBe(sequence[i - 1])
    }
  })
})
