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
import modes from '~/types/modes'

const model = defineModel<string | undefined>()
const props = defineProps<{
  type: 'mode' | 'session'
}>()

let sessions: string[] = []
const options = props.type === 'session' ? sessions : modes

const createSession = () => {
  const name = prompt('Enter session name')
  if (name) {
    sessions.push(name)
    model.value = name
  }
}
</script>
<template>
  <button
    v-if="props.type === 'session' && !sessions.length"
    class="bg-secondary text-md inline-flex h-[35px] min-w-[35px] items-center justify-between gap-[5px] rounded-lg border border-none px-[15px] leading-none outline-none"
    @click="createSession"
  >
    New Session
  </button>
  <SelectRoot
    v-else
    v-model="model"
    :default-value="props.type === 'session' ? sessions[0] : modes['222']"
  >
    <SelectTrigger
      class="bg-secondary text-md inline-flex h-[35px] min-w-[35px] items-center justify-between gap-[5px] rounded-lg border border-none px-[15px] leading-none outline-none"
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
              class="text-md relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
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
