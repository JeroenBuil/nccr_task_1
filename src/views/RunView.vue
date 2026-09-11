<script setup>
import { useFpvsStore } from '../stores/fpvs'
import { generateSequence } from '../utils/sequenceUtils'
import { STIMULUS_SETS, resolveStimulusPath } from '../config/stimulusSets'

// Fetch store instance
const store = useFpvsStore()

// Get stimulus config
const { path, baseImages, oddballImage } = STIMULUS_SETS[store.stimulusSet]

// Generate stimuli sequence and stores it in store
store.sequence = generateSequence({
  baseRateHz: store.baseRateHz,
  oddballEvery: store.oddballEvery,
  sequenceLengthSec: store.sequenceLengthSec,
  baseImagePaths: baseImages.map((filename) => resolveStimulusPath(path, filename)),
  oddballImagePath: resolveStimulusPath(path, oddballImage),
})

</script>

<template>
  <section class="view">
    <h1>Run</h1>
  </section>
</template>
