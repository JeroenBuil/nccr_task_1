import Chart from 'chart.js/auto'

/**
 * Renders one or more series plotted against time (linear x-axis).
 * @param {Array<{ times: number[], values: number[], label: string, color?: string }>} series
 */
export function createTimeSeriesChart(canvas, series, { yLabel, suggestedMin, suggestedMax } = {}) {
  return new Chart(canvas, {
    type: 'line',
    data: {
      datasets: series.map(({ times, values, label, color }) => ({
        label,
        data: times.map((t, i) => ({ x: t, y: values[i] })),
        backgroundColor: color ?? 'rgba(170, 59, 255, 1)',
        showLine: false,
        pointRadius: 2,
      })),
    },
    options: {
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Time [s]' } },
        y: { title: { display: true, text: yLabel }, suggestedMin, suggestedMax },
      },
    },
  })
}
