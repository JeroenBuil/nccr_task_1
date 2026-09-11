<script setup>
import { useFpvsStore } from './stores/fpvs'
import SetupView from './views/SetupView.vue'
import RunView from './views/RunView.vue'
import ResultsView from './views/ResultsView.vue'

const store = useFpvsStore()
</script>

<template>
  <SetupView v-if="store.currentView === 'setup'" />
  <RunView v-else-if="store.currentView === 'run'" />
  <ResultsView v-else-if="store.currentView === 'results'" />
  <p v-else>Unknown view: {{ store.currentView }}</p>
</template>
