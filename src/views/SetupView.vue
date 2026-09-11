<script setup>
import { useFpvsStore } from '../stores/fpvs'

const store = useFpvsStore()

function start() {
  store.goTo('run')
}
function resetToDefaults() {
  store.baseRateHz = 6
  store.oddballEvery = 5
  store.sequenceLengthSec = 60
  store.stimulusSet = 'fpvs'
}
</script>

<template>
  <section class="view">
    <h1>Setup</h1>

    <form class="form" @submit.prevent="start">
      <!-- Base Rate -->
      <div class="field">
        <label for="base-rate" title="Stimulus presentation rate">Base rate [Hz]</label>
        <input
          id="base-rate"
          v-model.number="store.baseRateHz"
          type="number"
          min="0.1"
          step="0.1"
        />
      </div>

      <!-- Oddball Every -->
      <div class="field">
        <label for="oddball-every" title="Position of the oddball within each cycle">Oddball every Nth stimulus</label>
        <input
          id="oddball-every"
          v-model.number="store.oddballEvery"
          type="number"
          min="2"
          step="1"
        />
      </div>

      <!-- Sequence Length -->
      <div class="field">
        <label for="sequence-length" title="Total experiment run duration">Sequence length [s]</label>
        <input
          id="sequence-length"
          v-model.number="store.sequenceLengthSec"
          type="number"
          min="1"
          step="1"
        />
      </div>

      <!-- Stimuli Set -->
      <div class="field">
        <label for="stimulus-set" title="Stimuli set to run this experiment (Note: only FPVS available in this tech test)">Stimulus set</label>
        <select 
          id="stimulus-set" 
          v-model="store.stimulusSet"
        >
          <option value="fpvs">Fast Periodic Visual Stimulation (FPVS)</option>
        </select>
      </div>

      <!-- Reset to default button -->
      <button type="button" @click="resetToDefaults">Reset</button>

      <!-- Run (submit form) button -->
      <button type="submit" class="btn-accent">Run</button>

    </form>
  </section>
</template>
