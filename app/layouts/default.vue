<template>
  <main class="flex">
    <div class="bg-secondary flex h-screen w-[15%] flex-col rounded-2xl p-5">
      <h2 class="text-lg font-bold">Rubik Cube Timer</h2>
      <div class="flex flex-col gap-2 pt-5">
        <SidebarButton text="timer" />
        <SidebarButton text="stats" />
        <SidebarButton text="solves" />
        <SidebarButton text="sessions" />
        <SidebarButton text="settings" />
      </div>
    </div>
    <slot />
  </main>
</template>
