<script setup>
import { useFpvsStore } from '../stores/fpvs'
import { generateSequence } from '../utils/sequenceUtils'
import { STIMULUS_SETS } from '../config/stimulusSets'

const store = useFpvsStore()

const { path, baseImages, oddballImage } = STIMULUS_SETS[store.stimulusSet]
const resolve = (filename) => `/${path}/${filename}`

store.sequence = generateSequence({
  baseRateHz: store.baseRateHz,
  oddballEvery: store.oddballEvery,
  sequenceLengthSec: store.sequenceLengthSec,
  baseImages: baseImages.map(resolve),
  oddballImage: resolve(oddballImage),
})
</script>

<template>
  <section class="view">
    <h1>Run</h1>
  </section>
</template>
