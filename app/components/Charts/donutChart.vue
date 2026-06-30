<script setup lang="ts">
import { computed } from 'vue'
import type { DonutChartProps } from '~/types/donut.ts'

import VueApexCharts from 'vue3-apexcharts'

const props = withDefaults(defineProps<DonutChartProps>(), {
  height: '100%',
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
  const data = props.data ?? {}

  const entries = Object.entries(data)

  if (entries.length === 0) {
    return { empty: 0 }
  }

  return props.normalize ? normalizeData(props.data) : props.data
})

const series = computed(() => {
  const values = Object.values(preparedData.value)

  return values.length ? values : [1]
})

const labels = computed(() => {
  const keys = Object.keys(preparedData.value)

  return keys.length ? keys : ['No data']
})

const options = computed(() => ({
  chart: {
    type: 'donut' as const,
    toolbar: { show: false }
  },
  labels: labels.value,
  dataLabels: {
    enabled: false
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
