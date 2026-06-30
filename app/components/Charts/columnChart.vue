<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { Solve } from '~/types/solve'

const props = defineProps<{
  data: Solve[]
}>()

const bins = computed(() => {
  const values = props.data
    .map((s) => getDNFOrSolveTime(s))
    .filter((t): t is number => t !== 'DNF' && t != null)
    .map((t) => t / 1000)

  if (values.length === 0) {
    return {
      categories: [],
      data: []
    }
  }

  const min = Math.floor(Math.min(...values))
  const max = Math.ceil(Math.max(...values))

  const size = Math.max(0, max - min)

  if (size === 0) {
    return {
      categories: [],
      data: []
    }
  }

  const result = Array(size).fill(0)

  values.forEach((v) => {
    const idx = Math.floor(v) - min
    if (idx >= 0 && idx < result.length) {
      result[idx]++
    }
  })

  return {
    categories: Array.from({ length: max - min }, (_, i) => {
      const a = min + i
      return `${a}-${a + 1}`
    }),
    data: result
  }
})

const series = computed(() => [
  {
    name: 'Count',
    data: bins.value.data
  }
])
// TODO: Remove this hardcoded color
const options = {
  chart: {
    type: 'bar' as const,
    background: '#1f1f1f' as const
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '70%'
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: false
  },
  xaxis: {
    categories: bins.value.categories,
    labels: {
      style: {
        colors: '#9ca3af'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  theme: {
    mode: 'dark' as const
  },
  colors: ['#00ff5a']
}
</script>

<template>
  <ClientOnly>
    <VueApexCharts
      type="bar"
      height="100%"
      :options="options"
      :series="series"
    />
  </ClientOnly>
</template>
