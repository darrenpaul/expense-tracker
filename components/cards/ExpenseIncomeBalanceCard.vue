<template>
  <div class="card flex flex-col gap-3 w-full md:w-1/2">
    <!-- BALANCE -->
    <div class="border-b pb-3 text-center">
      <h4>{{ COPY.balance }}</h4>
      <h3>
        <b>
          {{ balance }}
        </b>
      </h3>
    </div>

    <!-- INCOME -->
    <div class="border-b pb-3 text-center">
      <h4>{{ COPY.income }}</h4>
      <h3>
        {{ income }}
      </h3>
    </div>

    <!-- EXPENSE -->
    <div class="text-center">
      <h4>{{ COPY.expense }}</h4>
      <h3>
        {{ expense }}
      </h3>
    </div>
  </div>
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

const income = computed(() => {
  return currencyFormat({
    value: incomeAmount.value,
    currency: userSettingStore.currency,
  })
})

const expense = computed(() => {
  return currencyFormat({
    value: expenseAmount.value,
    currency: userSettingStore.currency,
  })
})
</script>

<style lang="scss">
@import './cards.scss';
</style>
