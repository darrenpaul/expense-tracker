<template>
  <div class="progress-bar-slim-container">
    <div :class="['progress-bar-slim-bar-container', props.backgroundColor]">
      <div
        v-if="percentage > 0"
        :class="['progress-bar-slim', props.progressBarColor]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { makeUID } from '~~/helpers/generators'

const props = defineProps({
  currentAmount: { type: Number, default: 0 },
  maxAmount: { type: Number, default: 1 },
  labels: { type: Array, default: () => [] },
  backgroundColor: { type: String, default: 'bg-secondary-a' },
  progressBarColor: { type: String, default: 'bg-app-blue' },
})

const userSettingStore = useUserSettings()

const labels = computed(() => {
  return props.labels.map((label) => ({ label, id: makeUID(8) }))
})

const percentage = computed(() => {
  return parseFloat(((props.currentAmount / props.maxAmount) * 100).toFixed(0))
})

const current = computed(() => {
  return currencyFormat({
    value: props.currentAmount,
    currency: userSettingStore.currency,
  })
})

const total = computed(() => {
  return currencyFormat({
    value: props.maxAmount,
    currency: userSettingStore.currency,
  })
})
</script>

<style lang="scss">
@import './styles.scss';
</style>
