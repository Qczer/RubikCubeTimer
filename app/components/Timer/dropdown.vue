<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import puzzles from '~/types/puzzles'

const model = defineModel<string | undefined>()
const props = defineProps<{
  type: 'puzzle' | 'session'
  bg?: 'zinc-700' | 'zinc-800' | 'zinc-900' | string
  text?: string
}>()

const bgClass = computed(() => {
  if (props.bg === 'zinc-700') return 'bg-zinc-700'
  else if (props.bg === 'zinc-800') return 'bg-zinc-800'
  else if (props.bg === 'zinc-900') return 'bg-zinc-900'
  return props.bg ?? 'bg-surface'
})

const { sessions } = useSessionsStore()
const modeOptions = Object.entries(puzzles).map(([value, label]) => ({
  value,
  label
}))
const sessionOptions = computed(() =>
  sessions.map((session) => ({
    value: session.name,
    label: session.name
  }))
)
const options = computed(() =>
  props.type === 'session' ? sessionOptions.value : modeOptions
)
const defaultValue = computed(() =>
  props.type === 'session' ? sessions[0]?.name : '222'
)
</script>
<template>
  <SelectRoot v-model="model" :default-value="defaultValue">
    <SelectTrigger
      class="text-md inline-flex h-8.75 w-fit min-w-8.75 items-center justify-between gap-1.25 rounded-lg border border-none px-3.75 leading-none outline-none"
      :class="bgClass"
      aria-label="Customise options"
    >
      {{ text }}
      <SelectValue />
      <img
        v-if="type === 'puzzle'"
        src="/icons/cuboid.svg"
        class="invert"
        alt="Cuboid"
      />
      <Icon v-else name="radix-icons:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-100 min-w-6.25 rounded-lg border shadow-sm will-change-[opacity,transform]"
        :class="bgClass"
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
              class="text-md relative flex items-center rounded-lg px-5 py-2 outline-none select-none"
              :class="
                option.value !== model
                  ? [
                      'cursor-pointer',
                      bg === 'zinc-800'
                        ? 'hover:bg-zinc-700'
                        : 'hover:bg-zinc-800'
                    ]
                  : ['opacity-40']
              "
              :disabled="option.value === model"
              :value="option.value"
            >
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
