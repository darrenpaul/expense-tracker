<template>
  <div>
    <div class="row">
      <div class="card card-stretch">
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

      <div class="column w-1/3">
        <GlanceCard
          v-if="transactions.list"
          :title="TRANSACTION_COPY.balance"
          :amount="
            currencyFormat({
              value: transactions.balance,
              currency: 'R',
            })
          "
        />
        <GlanceCard
          v-if="transactions.list"
          :title="TRANSACTION_COPY.spendPerDay"
          :amount="
            currencyFormat({
              value: spendPerDay({
                balance: transactions.balance,
                date: new Date(),
              }),
              currency: 'R',
            })
          "
        />
        <GlanceCard
          v-if="transactions.list"
          :title="TRANSACTION_COPY.spendPerWeek"
          :amount="
            currencyFormat({
              value: spendPerWeek({
                balance: transactions.balance,
                date: new Date(),
              }),
              currency: 'R',
            })
          "
        />
      </div>
    </div>

    <div class="column">
      <h2>{{ TRANSACTION_COPY.transactions }}</h2>
      <button @click="() => (showTransactionModal = true)">
        {{ TRANSACTION_COPY.addTransaction }}
      </button>
    </div>

    <TransactionList
      v-if="transactions.list"
      :transactions="transactions.list"
      @on-edit="onEditTransaction"
      @change="refreshData"
    />

    <!-- TRANSACTION FORM -->
    <Modal :is-open="showTransactionModal" @close="onCloseTransactionModal">
      <TransactionForm
        :transaction="transaction"
        @close-modal="onCloseTransactionModal"
        @refresh="onTransactionCreatedUpdated"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import TransactionForm from '~~/components/transactions/TransactionForm.vue'
import TransactionList from '~~/components/transactions/TransactionList.vue'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesForPeriod from '~~/helpers/charts/transactions/expensesForPeriod'
import { PERIODS } from '~~/helpers/dateFnsWrapper'
import { TRANSACTION_COPY } from '~~/constants/copy'
import GlanceCard from '~~/components/GlanceCard/index.vue'
import { spendPerDay, spendPerWeek } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const userSettings = useUserSettings()
const transactions = useTransactions()

onMounted(() => {
  transactions.fetchTransactions()
})

const showTransactionModal = ref(false)
const period = ref(PERIODS.day.displayName)
const transaction = ref({})

const expensesForPeriodOptions = computed(() => {
  if (transactions.list === null) {
    return {}
  }

  return expensesForPeriod({
    transactions: transactions.list as Array<ITransaction>,
    date: new Date(),
    period: period.value,
    currency: userSettings.currency,
  })
})

const onCloseTransactionModal = () => {
  showTransactionModal.value = false
  transaction.value = {}
}
const onEditTransaction = (transactionId: string) => {
  const matchedTransaction = transactions.list?.find(
    ({ id }) => id === transactionId
  )
  if (matchedTransaction) {
    transaction.value = matchedTransaction
    showTransactionModal.value = true
  }
}

const onTransactionCreatedUpdated = () => {
  refreshData()
}

const refreshData = () => {
  transactions.fetchTransactions()
}

const onPeriodButtonClick = (event: Event) => {
  event.preventDefault()
  const eventValue = event.target.value
  period.value = eventValue
}
</script>
