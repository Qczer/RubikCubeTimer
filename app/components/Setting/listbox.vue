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
import type { SettingOption } from '~/types/settings'

const model = defineModel<number>({ required: true })
const props = defineProps<{
  options: readonly SettingOption[]
}>()

const selectValue = computed<string>({
  get: () => String(model.value),
  set: (value) => {
    const option = props.options.find((item) => String(item.value) === value)
    if (option) model.value = option.value
  }
})
</script>
<template>
  <SelectRoot v-model="selectValue">
    <SelectTrigger
      class="bg-surface text-md inline-flex h-8.75 min-w-8.75 items-center justify-between gap-1.25 rounded-lg border border-none px-3.75 leading-none outline-none"
      aria-label="Customise options"
    >
      <SelectValue />
      <Icon name="radix-icons:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade bg-surface z-100 min-w-6.25 rounded-lg border shadow-sm will-change-[opacity,transform]"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="bg-surface flex h-6.25 cursor-default items-center justify-center"
        >
          <Icon name="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="p-1.25">
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="text-md relative flex h-6.25 items-center rounded-[3px] pr-8.75 pl-6.25 leading-none select-none data-disabled:pointer-events-none data-highlighted:outline-none"
              :value="String(option.value)"
            >
              <SelectItemIndicator
                class="absolute left-0 inline-flex w-6.25 items-center justify-center"
              >
                <Icon name="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option.label }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>
        <SelectScrollDownButton
          class="bg-surface flex h-6.25 cursor-default items-center justify-center"
        >
          <Icon name="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
