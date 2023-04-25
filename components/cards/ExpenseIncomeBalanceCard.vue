<template>
  <ClientOnly>
    <div class="card flex flex-col gap-3 w-full md:w-1/2">
      <!-- MONEY IN -->
      <div class="border-b pb-3 text-center">
        <h4>{{ COPY.moneyIn }}</h4>
        <h3>
          {{ moneyInAmount }}
        </h3>
      </div>

      <!-- MONEY OUT -->
      <div class="border-b pb-3 text-center">
        <h4>{{ COPY.moneyOut }}</h4>
        <h3>
          {{ moneyOutAmount }}
        </h3>
      </div>

      <!-- BALANCE -->
      <div class="text-center">
        <h4>{{ COPY.balance }}</h4>
        <h3>
          {{ balanceAmount }}
        </h3>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { balance } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useAccounts } from '~~/stores/accounts'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()
const accountStore = useAccounts()

const transactionAccountIds = computed(() => {
  // These are the accounts that have includeInBalance set to true
  const accountsIncludedInBalance = accountStore.accounts.filter(
    ({ includeInBalance }) => includeInBalance === true
  )
  return accountsIncludedInBalance.map(({ id }) => id)
})

const balanceAmount = computed(() => {
  return currencyFormat({
    value: balance(),
    currency: userSettingStore.currency,
  })
})

const moneyInAmount = computed(() => {
  return currencyFormat({
    value: transactionStore.incomeV2(transactionAccountIds.value),
    currency: userSettingStore.currency,
  })
})

const moneyOutAmount = computed(() => {
  return currencyFormat({
    value: transactionStore.expenseV2(transactionAccountIds.value),
    currency: userSettingStore.currency,
  })
})
</script>

<style lang="scss">
@import './cards.scss';
</style>
