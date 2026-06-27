<script setup lang="ts">
import { Menu } from '@lucide/vue'

const showList = ref(false)

const hideLayout = useState('hide-layout')
const toggleList = () => {
  showList.value = !showList.value
}
</script>

<template>
  <div
    v-if="!hideLayout"
    class="bg-surface sticky top-0 z-50 h-12 w-screen rounded-2xl p-2 md:h-screen md:w-20 md:p-5 lg:w-70"
  >
    <div class="hidden flex-col md:flex">
      <h2 class="flex items-center justify-center gap-2 text-lg font-bold">
        <img class="h-6 invert" alt="Cuboid" src="/icons/cuboid.svg" />
        <span class="hidden lg:block">Rubik Cube Timer</span>
      </h2>
      <div class="flex flex-col gap-2 pt-5">
        <SidebarButton text="timer" />
        <SidebarButton text="stats" />
        <SidebarButton text="solves" />
        <SidebarButton text="sessions" />
        <SidebarButton text="settings" />
      </div>
      <div></div>
    </div>
    <div class="flex h-full items-center justify-between p-1 md:hidden">
      <div class="h-full flex-1 items-center">
        <button class="rounded-md bg-zinc-900 p-2" @click="toggleList">
          <Menu :size="12" />
        </button>
        <div
          v-if="showList"
          class="mt-5 flex flex-col gap-2 rounded-xl bg-zinc-900 p-2"
        >
          <SidebarButton showText invert text="timer" @click="toggleList" />
          <SidebarButton showText invert text="stats" @click="toggleList" />
          <SidebarButton showText invert text="solves" @click="toggleList" />
          <SidebarButton showText invert text="sessions" @click="toggleList" />
          <SidebarButton showText invert text="settings" @click="toggleList" />
        </div>
      </div>
      <img
        class="h-full flex-1 p-1 invert"
        alt="Cuboid"
        src="/icons/cuboid.svg"
      />
      <div class="flex-1"></div>
    </div>
  </div>
</template>
