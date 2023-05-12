<template>
  <div>
    <div class="flex items-center justify-between">
      <h4>{{ props.budget.name }}</h4>
      <h4>
        {{
          currencyFormat({
            value: props.budget.amount,
            currency: userSettingStore.currency,
          })
        }}
      </h4>
    </div>

    <ProgressBarSlim
      :current-amount="balance"
      :max-amount="budget.amount"
      :progress-bar-color="progressBarColor"
    />
  </div>
</template>

<script setup lang="ts">
import { isWithinInterval } from 'date-fns'
import ProgressBarSlim from '~~/components/progressBars/ProgressBarSlim.vue'
import { IBudget } from '~~/types/budget'
import { useTransactions } from '~~/stores/transactions'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { ITransaction } from '~~/types/transaction'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'

const props = defineProps<{ budget: IBudget }>()

const transactionStore = useTransactions()
const userSettingStore = useUserSettings()

const transactionsForPeriod = computed(() => {
  const { startDate, endDate } = props.budget
  const transactionsInPeriod = transactionStore.transactions.filter(
    (transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: new Date(startDate),
        end: new Date(endDate),
      })
  )
  const transactionsWithCategory = transactionsInPeriod.filter((transaction) =>
    props.budget.categoryIds.includes(transaction.category.id)
  )

  return transactionsWithCategory as Array<ITransaction>
})

const balance = computed(() => {
  return totalAmountTransactions(transactionsForPeriod.value) as number
})

const progressBarColor = computed(() => {
  if (balance.value >= props.budget.amount) {
    return 'bg-app-red'
  }

  return 'bg-app-blue'
})
</script>
