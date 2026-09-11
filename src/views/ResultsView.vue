<script setup>
import { useFpvsStore } from '../stores/fpvs'

const store = useFpvsStore()

// calculate mean
function getMean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

// calc standard deviation
function getStd(values) {
  const mean = getMean(values)
  const squaredDiffs = values.map((v) => (v - mean) ** 2)
  return Math.sqrt(getMean(squaredDiffs))
}

// calc delta between values in array
function getDeltas(values) {
  return values.slice(1).map((v, i) => v - values[i])
}

// worst-case deviation of any entry's onset from its ideal position
// on the schedule (index * targetMsec)
function getWorstCaseMsec(entries, targetMsec) {
  return Math.max(...entries.map((entry) => Math.abs(entry.onsetMs - entry.index * targetMsec)))
}

// Extract onSetTime and whether stim was oddball
const onsetTimes = store.onsetLog.map((entry) => entry.onsetMs)
const isOddballArray =  store.onsetLog.map((entry) => entry.isOddball)

// Calc deltas
const onsetDeltasMsec = getDeltas(onsetTimes)
const oddBallDeltasMsec = getDeltas(onsetTimes.filter((_, index) => isOddballArray[index]))


// Calc mean, std, min max for ALl stimuli and for the oddball stimuli
const meanIntervalMsec = getMean(onsetDeltasMsec)
const stdIntervalMsec = getStd(onsetDeltasMsec)
const minIntervalMsec = Math.min(...onsetDeltasMsec)
const maxIntervalMsec = Math.max(...onsetDeltasMsec)

const meanOddBallIntervalMsec = getMean(oddBallDeltasMsec)
const stdOddBallIntervalMsec = getStd(oddBallDeltasMsec)
const minOddBallIntervalMsec = Math.min(...oddBallDeltasMsec)
const maxOddBallIntervalMsec = Math.max(...oddBallDeltasMsec)

// Calc target intervals and oddball stim rate for reference
const targetIntervalMsec = 1000 / store.baseRateHz
const targetOddBallIntervalMsec = targetIntervalMsec * store.oddballEvery
const oddballRateHz = store.baseRateHz / store.oddballEvery

// Worst-case deviation of any single onset from its target interval
const worstCaseMsec = getWorstCaseMsec(store.onsetLog, targetIntervalMsec)

// Same for the oddball onsets
// note: still measured against the base-rate schedule, as oddballs are also 
// fired in the base-rate (6 Hz) stream (they don't have a seperate clock)
const worstCaseOddBallMsec = getWorstCaseMsec(
  store.onsetLog.filter((entry) => entry.isOddball),
  targetIntervalMsec,
)

function backToSetup() {
  store.goTo('setup')
}

</script>

<template>
  <section class="view">
    <button type="button" class="back-btn" @click="backToSetup">Back</button>
    <h1>Fast Periodic Visual Stimulation</h1>
    <h2>Results</h2>

    <!-- All stim interval stats-->
    <table class="stats">
      <caption>All intervals:</caption>
      <tbody>
        <tr><th>Target</th><td>{{ targetIntervalMsec.toFixed(2) }} ms ({{ store.baseRateHz.toFixed(2) }} Hz)</td></tr>
        <tr><th>Mean ± std</th><td>{{ meanIntervalMsec.toFixed(2) }} ± {{ stdIntervalMsec.toFixed(2) }} ms</td></tr>
        <tr><th>Min</th><td>{{ minIntervalMsec.toFixed(2) }} ms</td> <th>Max</th><td>{{ maxIntervalMsec.toFixed(2) }} ms</td></tr>
        <tr><th>Worst case (vs. ideal time)</th><td>{{ worstCaseMsec.toFixed(2) }} ms</td></tr>
      </tbody>
    </table>

    <!-- Oddbal stim interval stats-->
    <table class="stats">
      <caption>Oddball intervals:</caption>
      <tbody>
        <tr><th>Target</th><td>{{ targetOddBallIntervalMsec.toFixed(2) }} ms ({{ oddballRateHz.toFixed(2) }} Hz)</td></tr>
        <tr><th>Mean ± std</th><td>{{ meanOddBallIntervalMsec.toFixed(2) }} ± {{ stdOddBallIntervalMsec.toFixed(2) }} ms</td></tr>
        <tr><th>Min</th><td>{{ minOddBallIntervalMsec.toFixed(2) }} ms</td> <th>Max</th><td>{{ maxOddBallIntervalMsec.toFixed(2) }} ms</td></tr>
        <tr><th>Worst case (vs. ideal time)</th><td>{{ worstCaseOddBallMsec.toFixed(2) }} ms</td></tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.stats {
  border-collapse: collapse;
}

.stats caption {
  font-weight: 500;
  text-align: left;
  margin-bottom: 4px;
  text-decoration: underline;
}

.stats th,
.stats td {
  text-align: left;
  padding: 4px 16px 4px 0;
}
</style>
