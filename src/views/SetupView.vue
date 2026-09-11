<script setup>
import { useFpvsStore } from '../stores/fpvs'

const store = useFpvsStore()

function start() {
  store.goTo('run')
}
</script>

<template>
  <section class="view">
    <h1>Setup</h1>

    <form class="form" @submit.prevent="start">
      <!-- Base Rate -->
      <div class="field">
        <label for="base-rate">Base rate (Hz)</label>
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
        <label for="oddball-every">Oddball every Nth stimulus</label>
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
        <label for="sequence-length">Sequence length (s)</label>
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
        <label for="stimulus-set">Stimulus set</label>
        <select id="stimulus-set" v-model="store.stimulusSet">
          <option value="fpvs">Fast Periodic Visual Stimulation (FPVS)</option>
        </select>
      </div>

      <button type="submit">Run</button>
    </form>
  </section>
</template>
