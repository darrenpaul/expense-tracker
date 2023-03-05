<template>
  <div>
    <div class="row">
      <div class="card card-stretch">
        <Chart :options="expensesVsIncomesOptions" />
      </div>

      <div class="column w-1/3">
        <GlanceCard
          v-if="transactions"
          :title="TRANSACTION_COPY.balance"
          :amount="
            currencyFormat({
              value: transactions.balance,
              currency: userSettings.currency,
            })
          "
        />
        <GlanceCard
          :title="TRANSACTION_COPY.moneyIn"
          :amount="
            currencyFormat({
              value: transactions.incomes,
              currency: userSettings.currency,
            })
          "
        />
        <GlanceCard
          :title="TRANSACTION_COPY.moneyOut"
          :amount="
            currencyFormat({
              value: transactions.expenses,
              currency: userSettings.currency,
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import GlanceCard from '~~/components/GlanceCard/index.vue'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const userSettings = useUserSettings()
const transactions = useTransactions()

const expensesVsIncomesOptions = computed(() => {
  if (transactions.list === null) {
    return {}
  }
  return expensesVsIncomes(transactions.list as Array<ITransaction>)
})
</script>
