<template>
  <div>
    <div class="transactions-container">
      <div class="transactions-card-container">
        <div class="card-stretch">
          <Chart :options="transactionsForPeriodChartOptions" />
        </div>
      </div>

      <div class="column">
        <GlanceCard
          v-if="transactionsStore.transactions"
          :title="TRANSACTION_COPY.balance"
          :amount="
            currencyFormat({
              value: balance(),
              currency: 'R',
            })
          "
        />

        <GlanceCard
          v-if="transactionsStore.transactions"
          :title="TRANSACTION_COPY.spendPerDay"
          :amount="
            currencyFormat({
              value: spendPerDay({
                balance: balance(),
                endDate: monthEndDate,
              }),
              currency: 'R',
            })
          "
        />

        <GlanceCard
          v-if="transactionsStore.transactions"
          :title="TRANSACTION_COPY.spendPerWeek"
          :amount="
            currencyFormat({
              value: spendPerWeek({
                balance: balance(),
                endDate: monthEndDate,
              }),
              currency: 'R',
            })
          "
        />
      </div>
    </div>

    <HeadingWithButton
      :heading="TRANSACTION_COPY.transactions"
      :button-text="TRANSACTION_COPY.addTransaction"
      @on-click="() => (showTransactionModal = true)"
    >
      <AccountSelect :account="account" @on-account-change="account = $event" />

      <PeriodSelect :period="period" @on-period-change="period = $event" />
    </HeadingWithButton>

    <TransactionList
      v-if="transactionsStore.transactions"
      :transactions="filteredTransactions"
      @on-edit="onEditTransaction"
      @change="refreshData"
    />

    <!-- TRANSACTION FORM -->
    <Modal :is-open="showTransactionModal" @close="onCloseTransactionModal">
      <TransactionForm
        :transaction="transaction"
        @close-modal="onCloseTransactionModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {
  addMonths,
  isAfter,
  isToday,
  setDate,
  subDays,
  isWithinInterval,
  addDays,
  subMonths,
} from 'date-fns'
import PeriodSelect from '~~/components/buttons/PeriodSelect.vue'
import AccountSelect from '~~/components/buttons/AccountSelect.vue'
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import TransactionForm from '~~/components/forms/TransactionForm.vue'
import TransactionList from '~~/components/tables/transactionList/index.vue'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import transactionsForPeriod from '~~/helpers/charts/transactions/transactionsForPeriod'
import { PERIODS } from '~~/helpers/dateFnsWrapper'
import TRANSACTION_COPY from '~~/constants/copy/transactions'
import GlanceCard from '~~/components/cards/GlanceCard.vue'
import { spendPerDay, spendPerWeek, balance } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const userSettingsStore = useUserSettings()
const transactionsStore = useTransactions()

const showTransactionModal = ref(false)
const period = ref(PERIODS.week.displayName)
const account = ref('All')
const transaction = ref({})

const transactionsForPeriodChartOptions = computed(() => {
  if (transactionsStore.transactions === null) {
    return {}
  }

  return transactionsForPeriod({
    transactions: filteredTransactions.value as Array<ITransaction>,
    date: monthEndDate.value,
    period: period.value,
    currency: userSettingsStore.currency,
  })
})

const monthEndDate = computed(() => {
  let date = subDays(setDate(new Date(), userSettingsStore.monthStart), 1)

  if (isAfter(new Date(), date)) {
    date = setDate(addMonths(new Date(), 1), userSettingsStore.monthStart)
  }
  return date
})

const filteredTransactions = computed(() => {
  const transactionsByAccount = transactionsStore.transactions.filter(
    (t) => account.value === t.account.id || account.value === 'All'
  )

  if (period.value === PERIODS.day.displayName) {
    return transactionsByAccount.filter((transaction) =>
      isToday(new Date(transaction.date))
    )
  }

  if (period.value === PERIODS.week.displayName) {
    const startDate = subDays(new Date(), 7)
    const endDate = addDays(new Date(), 1)

    return transactionsByAccount.filter((transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: startDate,
        end: endDate,
      })
    )
  }

  if (period.value === PERIODS.month.displayName) {
    const startDate = setDate(
      subMonths(new Date(), 1),
      userSettingsStore.monthStart
    )
    const endDate = addDays(new Date(), 1)

    return transactionsByAccount.filter((transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: startDate,
        end: endDate,
      })
    )
  }

  return transactionsStore.transactions
})

const onCloseTransactionModal = (refresh = false) => {
  showTransactionModal.value = false
  transaction.value = {}

  if (refresh) {
    refreshData()
  }
}

const onEditTransaction = (transactionId: string) => {
  const matchedTransaction = transactionsStore.list?.find(
    ({ id }) => id === transactionId
  )
  if (matchedTransaction) {
    transaction.value = matchedTransaction
    showTransactionModal.value = true
  }
}

const refreshData = () => {
  transactionsStore.fetch()
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/transactions.scss';
</style>
