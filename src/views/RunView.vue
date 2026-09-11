<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// Initialisation for timed image sequence display
let startTime = null // start time when RunView is mounted
let rafId = null // current outstanding frame id
  
const currentIndex = ref(0)
const currentStimulus = computed(() => store.sequence[currentIndex.value]) // derived reactive value => compute ensures currentStimulus is updated when currentIndex.value changes
const frameIntervalMs = 1000 / store.baseRateHz // time (in ms) each sequence frame should be displayeed

/**
 * requestAnimationFrame callback, rescheduling itself every frame.
 * Advances currentIndex based on elapsed time, then reschedules itself.
 * Navigates to Results once the sequence is exhausted.
 *
 * @param {DOMHighResTimeStamp} timestamp - timestamp supplied by requestAnimationFrame
 */
function stimulusUpdateLoop(timestamp) {
  if (startTime === null) {
      startTime = timestamp
      // Stimulus onset logging for first stimulus in sequence
      store.onsetLog.push({
        index: 0,
        isOddball: store.sequence[0].isOddball,
        onsetMs: 0,
      })
    }

    const elapsed = timestamp - startTime
    const targetIndex = Math.floor(elapsed / frameIntervalMs) // updates targetIndex when it is time to show the next image in the sequence

    // Update the currentIndex if the targetIndex updates => this triggers a rerender of the sequence viewer with the new image
    if (targetIndex > currentIndex.value && targetIndex < store.sequence.length) {
      currentIndex.value = targetIndex
      // Stimulus onset logging:
      store.onsetLog.push({
        index: targetIndex,
        isOddball: store.sequence[targetIndex].isOddball,
        onsetMs: elapsed,
      })
    }
    // if all images in the sequence have been displayed, then move to the results view
    if (targetIndex >= store.sequence.length) {
      store.goTo('results')
    }

    // update rafId and reschedules this same function for the next frame
    rafId = requestAnimationFrame(stimulusUpdateLoop)

    
  }

// When RunView is mounted store animation frame request id
onMounted(() => {
  rafId = requestAnimationFrame(stimulusUpdateLoop)
})
// When RunView is unmounted cancel animation frame request
onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})

</script>

<template>
  <section class="view">
    <button type="button" class="back-btn" @click="backToSetup">Back</button>

    <div class="sequence-viewer">
      <img
        :src="currentStimulus?.image"
      />
    </div>
  </section>
</template>

<style scoped>

.view {
  background: rgb(128, 128, 128); /* mid-grey background for the stimulus as per requirements */
}

.sequence-viewer {
  max-width: 100%;
}

.sequence-viewer img {
  width: 400px;
  height: 400px;
  object-fit: cover;
}

</style>
