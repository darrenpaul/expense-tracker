<template>
  <ClientOnly>
    <div class="card flex flex-col gap-3 w-full md:w-1/2">
      <!-- MONEY IN -->
      <div class="border-b pb-3 text-center">
        <h4>{{ COPY.moneyIn }}</h4>
        <h3>
          {{ moneyIn }}
        </h3>
      </div>

      <!-- MONEY OUT -->
      <div class="border-b pb-3 text-center">
        <h4>{{ COPY.moneyOut }}</h4>
        <h3>
          {{ moneyOut }}
        </h3>
      </div>

      <!-- BALANCE -->
      <div class="text-center">
        <h4>{{ COPY.balance }}</h4>
        <h3>
          {{ balance }}
        </h3>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useAccounts } from '~~/stores/accounts'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()
const accountStore = useAccounts()

const incomeAmount = computed(() => {
  return transactionStore.balanceIncome()
})

const expenseAmount = computed(() => {
  return transactionStore.balanceExpense()
})

const balance = computed(() => {
  // TODO: Added computed property for when adding the budget totals
  return currencyFormat({
    value: transactionStore.balance(),
    currency: userSettingStore.currency,
  })
})

const moneyIn = computed(() => {
  return currencyFormat({
    value: incomeAmount.value,
    currency: userSettingStore.currency,
  })
})

const moneyOut = computed(() => {
  return currencyFormat({
    value: expenseAmount.value,
    currency: userSettingStore.currency,
  })
})
</script>

<style lang="scss">
@import './cards.scss';
</style>
