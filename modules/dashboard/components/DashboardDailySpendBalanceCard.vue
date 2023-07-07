<template>
  <div class="dashboard-glance-card">
    <h4 class="font-normal">{{ COPY.spendPerDay }}</h4>

    <h3 class="font-black">
      {{ dailySpendBalance }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { addMonths, isAfter, setDate } from 'date-fns'
import COPY from '~~/constants/copy/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'
import { spendPerDay, balance } from '~~/helpers/transactions'

const userSettingStore = useUserSettings()

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
