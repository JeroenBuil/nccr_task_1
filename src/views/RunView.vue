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

function backToSetup() {
  store.goTo('setup')
}

</script>

<template>
  <section class="view">
    <button type="button" class="back-btn" @click="backToSetup">Exit</button>
    <h1>Run</h1>

    <!-- Debug preview of the generated sequence (not the timed presentation!) to show the sequence is working and the images are loading -->
    <div class="sequence-preview">
      <img
        v-for="(stimulus, index) in store.sequence"
        :key="index"
        :src="stimulus.image"
      />
    </div>
  </section>
</template>

<style scoped>

.sequence-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 100%;
}

.sequence-preview img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 2px;
}

</style>
