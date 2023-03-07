<template>
  <div class="progress-bar-container">
    <div
      v-if="percentage > 0"
      class="progress-bar"
      :style="{ width: `${percentage}%` }"
    ></div>
    <div class="progress-bar-text-container">{{ current }} / {{ total }}</div>
  </div>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'

const props = defineProps({
  currentAmount: { type: Number, default: 0 },
  maxAmount: { type: Number, default: 1 },
})

const userSettingStore = useUserSettings()

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
@import './progressBar.scss';
</style>
