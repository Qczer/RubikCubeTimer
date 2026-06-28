<script setup lang="ts">
import { Menu, X } from '@lucide/vue'

const showList = ref(false)

const hideLayout = useState('hide-layout')
const toggleList = () => {
  showList.value = !showList.value
}
</script>

<template>
  <div
    v-if="!hideLayout"
    class="bg-surface sticky top-0 z-50 h-12 w-full p-2 md:h-screen md:w-20 md:rounded-r-2xl md:p-5 lg:w-70"
  >
    <div class="hidden flex-col md:flex">
      <h2 class="flex items-center justify-center gap-2 text-lg font-bold">
        <img class="h-6 invert" alt="Cuboid" src="/icons/cuboid.svg" />
        <span class="hidden lg:block">Rubik Cube Timer</span>
      </h2>
      <div class="flex flex-col pt-5">
        <SidebarButton text="timer" />
        <SidebarButton text="stats" />
        <SidebarButton text="solves" />
        <SidebarButton text="sessions" />
        <SidebarButton text="settings" />
      </div>
      <div></div>
    </div>
    <div class="flex h-full w-full items-center justify-between p-1 md:hidden">
      <div class="h-full flex-1 items-center">
        <button
          class="relative h-8 w-8 rounded-md bg-zinc-900 p-2 transition"
          @click="toggleList"
        >
          <Menu
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            :class="
              showList
                ? 'scale-0 rotate-90 opacity-0'
                : 'scale-100 rotate-0 opacity-100'
            "
            :size="16"
          />

          <X
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            :class="
              showList
                ? 'scale-100 rotate-0 opacity-100'
                : 'scale-0 -rotate-90 opacity-0'
            "
            :size="16"
          />
        </button>
        <div
          v-if="showList"
          class="mt-5 flex flex-col rounded-xl bg-zinc-900 p-5 pr-12"
        >
          <SidebarButton showText invert text="timer" @click="toggleList" />
          <SidebarButton showText invert text="stats" @click="toggleList" />
          <SidebarButton showText invert text="solves" @click="toggleList" />
          <SidebarButton showText invert text="sessions" @click="toggleList" />
          <SidebarButton showText invert text="settings" @click="toggleList" />
        </div>
      </div>
      <img
        class="h-full flex-1 p-0.5 invert"
        alt="Cuboid"
        src="/icons/cuboid.svg"
      />
      <div class="flex-1"></div>
    </div>
  </div>
</template>
