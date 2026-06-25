<script setup lang="ts">
import DonutChart from '~/components/Stats/donutChart.vue'
import puzzles from '~/types/puzzles'
import Section from '../section.vue'
import type { statsCardProp } from '../card.vue'

const overviewCards: statsCardProp[] = [
  {
    title: 'Time Spent Cubing',
    value: formatTime(totalTime()),
    icon: 'time',
    color: 'green'
  },
  {
    title: 'Total Solves',
    value: totalSolves(),
    icon: 'number',
    color: 'blue'
  },
  {
    title: 'Number of Events',
    value: totalEvents(),
    icon: 'number'
  },
  {
    title: 'Top Event',
    value: bestEvent() ? puzzles[bestEvent()!] : 'None',
    icon: 'top'
  }
]

const best = getBestSolveTime(allSolves.value)
const first = getFirstSolveTime(allSolves.value)
const dnfCount = getDNFCount(allSolves.value)
const plusTwoCount = getPlusTwoCount(allSolves.value)

const moreStatsCards: statsCardProp[] = [
  {
    title: 'Best Solve',
    value: best ? formatTime(best) : null,
    icon: 'best'
  },
  {
    title: 'First Solve',
    value: first ? formatTime(getSolveTime(first)) : null,
    icon: 'time'
  },
  {
    title: 'DNFs',
    value: dnfCount,
    icon: 'DNF'
  },
  {
    title: '+2s',
    value: plusTwoCount,
    icon: 'best'
  }
]
</script>
<template>
  <Section header="Overview" :cards="overviewCards" />
  <Section header="Event Distribution">
    <div class="bg-surface h-full w-full rounded-2xl p-2">
      <DonutChart :data="eventDistribution" height="100%" />
    </div>
  </Section>
  <Section header="More Stats" :cards="moreStatsCards" />
</template>
