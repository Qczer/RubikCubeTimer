<script setup lang="ts">
import { computed } from 'vue'
import type { DonutChartProps } from '~/types/donut.ts'

import VueApexCharts from 'vue3-apexcharts'

const props = withDefaults(defineProps<DonutChartProps>(), {
  height: 300,
  normalize: false
})

// If normalize = true: scale values to 100%
function normalizeData(data: Record<string, number>) {
  const sum = Object.values(data).reduce((a, b) => a + b, 0)

  if (sum === 0) return data

  const factor = 100 / sum

  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v * factor])
  )
}

const preparedData = computed(() => {
  return props.normalize ? normalizeData(props.data) : props.data
})

const series = computed(() => Object.values(preparedData.value))

const options = computed(() => ({
  chart: {
    type: 'donut' as const,
    toolbar: { show: false }
  },

  labels: Object.keys(preparedData.value),

  dataLabels: {
    formatter: (val: number) => `${Math.round(val)}%`
  },

  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(1)}%`
    }
  },

  legend: {
    position: 'right' as const,
    labels: {
      colors: '#fff'
    }
  },

  stroke: {
    width: 0
  }
}))
</script>

<template>
  <ClientOnly>
    <VueApexCharts
      type="donut"
      :height="height"
      :options="options"
      :series="series"
    />
  </ClientOnly>
</template>
