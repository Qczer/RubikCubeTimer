<script setup lang="ts">
import { provide, inject } from 'vue'
import SettingListbox from './listbox.vue'
import SettingNumberField from './numberField.vue'
import SettingSwitch from './switch.vue'
import type {
  SettingModelValue,
  SettingSchema,
  SelectSettingSchema
} from '~/types/settings'

const { t, te } = useI18n()
const props = defineProps<{
  labelKey: string
  schema: SettingSchema
  section?: boolean
}>()
const model = defineModel<SettingModelValue>({ required: true })

provide('isChildSetting', true)
const isChild = inject('isChildSetting', false)

const booleanModel = computed<boolean>({
  get: () => (typeof model.value === 'boolean' ? model.value : false),
  set: (value) => {
    model.value = value
  }
})

const numberModel = computed<number>({
  get: () => (typeof model.value === 'number' ? model.value : 0),
  set: (value) => {
    model.value = value
  }
})

const selectSchema = computed<SelectSettingSchema | null>(() =>
  props.schema.type === 'select' ? props.schema : null
)

const shouldShowChildren = computed(() => !props.section || booleanModel.value)
</script>
<template>
  <div
    class="flex flex-col gap-2 py-5"
    :class="!isChild ? 'border-b border-zinc-700' : ''"
  >
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-2xl">{{ t(`${labelKey}.title`) }}</p>
        <p v-if="te(`${labelKey}.description`)" class="text-sm opacity-70">
          {{ t(`${labelKey}.description`) }}
        </p>
      </div>
      <SettingSwitch v-if="schema.type === 'boolean'" v-model="booleanModel" />
      <SettingNumberField
        v-else-if="schema.type === 'number'"
        v-model="numberModel"
        :min="schema.min"
        :max="schema.max"
        :step="schema.step"
      />
      <SettingListbox
        v-else-if="selectSchema"
        v-model="numberModel"
        :options="selectSchema.options"
      />
    </div>
    <div class="flex flex-col gap-4 pl-5">
      <slot v-if="shouldShowChildren" />
    </div>
  </div>
</template>
