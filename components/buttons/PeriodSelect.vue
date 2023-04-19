<template>
  <div class="flex flex-row gap-4 justify-center">
    <DropDownButton
      :is-open="periodDropdownOpen"
      :button-text="period"
      :button-style="'button-secondary'"
      @toggle-is-open="periodDropdownOpen = $event"
    >
      <template #dropdownButtons>
        <button
          :class="
            period === PERIODS.day.displayName ? 'button' : 'button-secondary'
          "
          :value="PERIODS.day.displayName"
          @click="() => onPeriodClick(PERIODS.day.displayName)"
        >
          {{ PERIODS.day.displayName }}
        </button>

        <button
          :class="
            period === PERIODS.week.displayName ? 'button' : 'button-secondary'
          "
          :value="PERIODS.week.displayName"
          @click="() => onPeriodClick(PERIODS.week.displayName)"
        >
          {{ PERIODS.week.displayName }}
        </button>

        <button
          :class="
            period === PERIODS.month.displayName ? 'button' : 'button-secondary'
          "
          :value="PERIODS.month.displayName"
          @click="() => onPeriodClick(PERIODS.month.displayName)"
        >
          {{ PERIODS.month.displayName }}
        </button>

        <button
          :class="
            period === PERIODS.infinity.displayName
              ? 'button'
              : 'button-secondary'
          "
          :value="PERIODS.infinity.displayName"
          @click="() => onPeriodClick(PERIODS.infinity.displayName)"
        >
          {{ PERIODS.infinity.displayName }}
        </button>
      </template>
    </DropDownButton>
  </div>
</template>

<script setup lang="ts">
import { PERIODS } from '~~/helpers/dateFnsWrapper'
import DropDownButton from '~~/components/buttons/DropDownButton.vue'

const emit = defineEmits(['onPeriodChange'])

const props = defineProps({
  period: { type: String, required: true },
})

const periodDropdownOpen = ref(false)

const onPeriodClick = (value: string) => {
  periodDropdownOpen.value = false
  emit('onPeriodChange', value)
}
</script>
