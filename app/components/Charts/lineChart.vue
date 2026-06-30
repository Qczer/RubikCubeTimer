<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { Solve } from '~/types/solve'

const props = defineProps<{
  data: Solve[]
}>()

const times = computed(() =>
  props.data.map((solve) => {
    const t = getDNFOrSolveTime(solve)
    return t === 'DNF' ? null : t
  })
)

const series = computed(() => [
  {
    name: 'Time',
    data: times.value
  }
])
// TODO: Remove this hardcoded color
const options = {
  chart: {
    type: 'line' as const,
    background: '#1f1f1f' as const,
    zoom: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      formatter: (value: number) => formatTime(value, 0)
    }
  },
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  tooltip: {
    y: {
      formatter: (value: number) => formatTime(value)
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth' as const
  },
  theme: {
    mode: 'dark' as const
  },
  colors: ['#3b82f6']
}
</script>

<template>
  <ClientOnly>
    <VueApexCharts
      type="line"
      height="100%"
      :options="options"
      :series="series"
    />
  </ClientOnly>
</template>
