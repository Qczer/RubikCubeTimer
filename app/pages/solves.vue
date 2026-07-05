<script setup lang="ts">
import Button from '~/components/Solves/button.vue'
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-8">
    <Header title="Solves" />
    <div class="flex gap-2 p-2">
      <div>
        <div class="flex gap-2">
          <Button text="3x3" icon="cube" />
          <Button icon="filter" />
          <Button icon="sort" />
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>
