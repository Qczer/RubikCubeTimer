<template>
  <main class="flex min-h-screen w-full min-w-0 flex-col md:flex-row">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <slot />
    </div>
  </main>
</template>
