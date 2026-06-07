<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'

const model = defineModel<string | undefined>()
const props = defineProps<{
  type: 'mode' | 'session'
}>()

const sessions = ['Session 1', 'Session 2', 'Session 3']
const modes = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7']

const options = props.type === 'session' ? sessions : modes
</script>
<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      class="bg-secondary inline-flex h-[35px] min-w-[35px] items-center justify-between gap-[5px] rounded-lg border border-none px-[15px] text-sm leading-none outline-none"
      aria-label="Customise options"
    >
      <SelectValue />
      <img
        v-if="type === 'mode'"
        src="/icons/cuboid.svg"
        class="invert"
        alt="Cuboid"
      />
      <Icon v-else name="radix-icons:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade bg-secondary z-[100] min-w-[25px] rounded-lg border shadow-sm will-change-[opacity,transform]"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="bg-secondary flex h-[25px] cursor-default items-center justify-center"
        >
          <Icon name="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px]">
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
              :value="option"
            >
              <SelectItemIndicator
                class="absolute left-0 inline-flex w-[25px] items-center justify-center"
              >
                <Icon name="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton
          class="bg-secondary flex h-[25px] cursor-default items-center justify-center"
        >
          <Icon name="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
