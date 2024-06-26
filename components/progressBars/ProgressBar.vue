<template>
  <div class="progress-bar-container">
    <div :class="['progress-bar-bar-container', props.backgroundColor]">
      <div
        v-if="percentage > 0"
        :class="['progress-bar', props.progressBarColor]"
        :style="{ width: `${percentage}%` }"
      />
      <div class="progress-bar-text-container">
        <p
          v-if="hideInnerText === false"
          :class="[
            'text-secondary py-1 px-2 rounded-full',
            props.progressBarColor,
          ]"
        >
          {{ current }} / {{ total }}
        </p>

        <p
          v-if="showPercentage === true"
          :class="[
            'text-secondary py-1 px-2 rounded-full',
            props.progressBarColor,
          ]"
        >
          {{ percentage }}%
        </p>
      </div>
    </div>

    <div class="progress-bar-labels-container">
      <small v-for="{ label, id } in labels" :key="id">{{ label }}</small>
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
  progressBarColor: { type: String, default: 'bg-blue-500' },
  hideInnerText: { type: Boolean, default: false },
  showPercentage: { type: Boolean, default: false },
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
