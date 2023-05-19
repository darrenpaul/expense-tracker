<template>
  <div>
    <div class="flex items-center justify-between">
      <h4 class="w-32 truncate">{{ props.goal.name }}</h4>
      <h4>
        {{ balanceWithCurrency }}
      </h4>
    </div>

    <ProgressBarSlim
      :current-amount="balance"
      :max-amount="goal.amount"
      :progress-bar-color="progressBarColor"
    />
  </div>
</template>

<script setup lang="ts">
import ProgressBarSlim from '~~/components/progressBars/ProgressBarSlim.vue'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'
import { IGoal } from '~~/types/goal'

const props = defineProps<{ goal: IGoal }>()

const transactionStore = useTransactions()
const userSettingStore = useUserSettings()

const balance = computed(() => {
  return transactionStore.transactionsForGoal(props.goal.accountId)
})

const balanceWithCurrency = computed(() => {
  return currencyFormat({
    value: balance.value,
    currency: userSettingStore.currency,
  })
})

const progressBarColor = computed(() => {
  if (balance.value >= props.goal.amount) {
    return 'bg-app-green'
  }

  return 'bg-app-blue'
})
</script>
