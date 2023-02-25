<template>
  <div>
    <!-- TODO: Move to .scss file -->
    <div class="grid grid-cols-2 items-start justify-center w-screen">
      <div>
        <Chart :options="expensesForPeriodOptions" />
        <div class="flex justify-center gap-4 items-center">
          <button :value="PERIODS.day.displayName" @click="onPeriodButtonClick">
            {{ PERIODS.day.displayName }}
          </button>
          <button
            :value="PERIODS.week.displayName"
            @click="onPeriodButtonClick"
          >
            {{ PERIODS.week.displayName }}
          </button>
          <button
            :value="PERIODS.month.displayName"
            @click="onPeriodButtonClick"
          >
            {{ PERIODS.month.displayName }}
          </button>
        </div>
      </div>

      <Chart :options="expensesVsIncomesOptions" />
    </div>

    <div class="flex justify-between items-center">
      <h1>{{ TRANSACTION_COPY.transactions }}</h1>
      <button @click="() => (showTransactionModal = true)">
        {{ TRANSACTION_COPY.addTransaction }}
      </button>
    </div>
    <TransactionList
      v-if="transactions"
      :transactions="transactions"
      @change="refreshData"
    />
    <CategoryForm />

    <Modal
      :is-open="showTransactionModal"
      @close="showTransactionModal = false"
    >
      <TransactionForm @change="onTransactionCreatedUpdated" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import TransactionForm from '~~/components/transactions/TransactionForm.vue'
import TransactionList from '~~/components/transactions/TransactionList.vue'
import CategoryForm from '~~/components/CategoryForm/index.vue'
import { viewTransactions } from '~~/endpoints/transaction'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import expensesForPeriod from '~~/helpers/charts/transactions/expensesForPeriod'
import { PERIODS } from '~~/helpers/dateFnsWrapper'
import { TRANSACTION_COPY } from '~~/constants/copy'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})

const showTransactionModal = ref(false)
const period = ref(PERIODS.day.displayName)

const { data: transactions, refresh } = await useAsyncData('transactions', () =>
  viewTransactions()
)

const expensesVsIncomesOptions = computed(() => {
  if (transactions.value && transactions.value?.length === 0) {
    return {}
  }
  return expensesVsIncomes(transactions.value as Array<ITransaction>)
})

const expensesForPeriodOptions = computed(() => {
  if (transactions.value && transactions.value?.length === 0) {
    return {}
  }
  return expensesForPeriod({
    transactions: transactions.value as Array<ITransaction>,
    date: new Date(),
    period: period.value,
  })
})

const onTransactionCreatedUpdated = () => {
  refreshData()
}

const refreshData = () => {
  refresh()
}

const onPeriodButtonClick = (event: Event) => {
  event.preventDefault()
  const eventValue = event.target.value
  period.value = eventValue
}
</script>
