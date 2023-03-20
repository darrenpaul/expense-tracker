<template>
  <div class="dashboard-container">
    <div class="dashboard-card-container">
      <div class="card-stretch">
        <Chart :options="expensesVsIncomesOptions" />
      </div>
    </div>

    <div class="dashboard-glance-cards">
      <GlanceCard
        v-if="transactionStore"
        :title="TRANSACTION_COPY.balance"
        :amount="
          currencyFormat({
            value: balance(),
            currency: userSettings.currency,
          })
        "
      />
      <GlanceCard
        :title="TRANSACTION_COPY.moneyIn"
        :amount="
          currencyFormat({
            value: transactionStore.income(),
            currency: userSettings.currency,
          })
        "
      />
      <GlanceCard
        :title="TRANSACTION_COPY.moneyOut"
        :amount="
          currencyFormat({
            value: transactionStore.expense(),
            currency: userSettings.currency,
          })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import GlanceCard from '~~/components/cards/GlanceCard.vue'
import { balance } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const userSettings = useUserSettings()
const transactionStore = useTransactions()

onMounted(() => {
  transactionStore.fetch()
})

const expensesVsIncomesOptions = computed(() => {
  if (transactionStore.list === null) {
    return {}
  }
  return expensesVsIncomes(transactionStore.list as Array<ITransaction>)
})
</script>

<style lang="scss">
@import '~~/assets/css/pages/dashboard.scss';
</style>