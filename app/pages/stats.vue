<script setup lang="ts">
import puzzles from '~/types/puzzles'
import DonutChart from '~/components/Stats/donutChart.vue'
</script>
<template>
  <div class="flex w-full flex-col gap-4 p-8">
    <Header title="Stats" />
    <div class="grid grid-cols-2 gap-12">
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Overview</h2>
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
          <StatsCard
            title="Time Spent Cubing"
            :value="formatTime(totalTime())"
            icon="time"
            color="green"
          />
          <StatsCard
            title="Total Solves"
            :value="totalSolves()"
            icon="number"
            color="blue"
          />
          <StatsCard
            title="Number of Events"
            :value="totalEvents()"
            icon="number"
          />
          <StatsCard
            title="Top Event"
            :value="bestEvent() ? puzzles[bestEvent()!] : 'None'"
            icon="top"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Event Distribution</h2>
        <div class="bg-secondary rounded-2xl p-2">
          <DonutChart :data="eventDistribution" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">More Stats</h2>
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
          <StatsCard
            title="Best Solve"
            :value="bestSolve ? formatTime(bestSolve) : null"
            icon="best"
          />
          <StatsCard
            title="First Solve"
            :value="firstSolve ? formatTime(firstSolve) : null"
            icon="time"
          />
          <StatsCard title="DNFs" :value="dnfCount" icon="DNF" />
          <StatsCard title="+2s" :value="plusTwoCount" icon="plusTwo" />
        </div>
      </div>
    </div>
  </div>
</template>
