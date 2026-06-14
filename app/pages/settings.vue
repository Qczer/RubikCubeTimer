<script setup lang="ts">
import Setting from '~/components/Setting/index.vue'
import {
  inspectionSettingKeys,
  settingsSchema,
  timerSettingKeys,
  type InspectionSettingKey,
  type TimerSettingKey
} from '~/types/settings'

const section = ref<'timer'>('timer')
const settings = useSettingsStore()

const timerLabelKey = (key: TimerSettingKey | 'inspection') =>
  `settings.timer.${key}`

const inspectionLabelKey = (key: InspectionSettingKey) =>
  `settings.timer.inspection.children.${key}`
</script>
<template>
  <div class="flex flex-col gap-4 p-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-4xl font-bold">Settings</h2>
      <div class="w-[70%] rounded-sm border-t border-t-[2px] border-zinc-700" />
    </div>
    <div v-if="section === 'timer'">
      <Setting
        v-for="key in timerSettingKeys"
        :key="key"
        v-model="settings.timer[key]"
        :label-key="timerLabelKey(key)"
        :schema="settingsSchema[key]"
      />
      <Setting
        v-model="settings.timer.inspection.enabled"
        :label-key="timerLabelKey('inspection')"
        :schema="settingsSchema.inspection.enabled"
        :section="true"
      >
        <Setting
          v-for="key in inspectionSettingKeys"
          :key="key"
          v-model="settings.timer.inspection[key]"
          :label-key="inspectionLabelKey(key)"
          :schema="settingsSchema.inspection[key]"
        />
      </Setting>
    </div>
  </div>
</template>
