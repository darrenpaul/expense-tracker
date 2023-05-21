<template>
  <div class="dashboard-balance-card">
    <!-- BALANCE -->
    <div>
      <h4 class="font-normal">{{ COPY.spendPerDay }}</h4>
      <h3 class="font-black">
        {{ dailySpendBalance }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addMonths, isAfter, setDate } from 'date-fns'
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { spendPerDay, balance } from '~~/helpers/transactions'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const dailySpendBalance = computed(() => {
  return currencyFormat({
    value: spendPerDay({
      balance: balance(),
      endDate: monthEndDate.value,
    }),
    currency: userSettingStore.currency,
  })
})

const monthEndDate = computed(() => {
  let date = setDate(new Date(), userSettingStore.monthStart)

  if (isAfter(new Date(), date)) {
    date = setDate(addMonths(new Date(), 1), userSettingStore.monthStart)
  }
  return date
})
</script>
