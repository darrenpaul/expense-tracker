<template>
  <div>
    <div class="transactions-container">
      <div class="transactions-card-container">
        <div class="card-stretch">
          <Chart :options="transactionsForPeriodOptions" />

          <div class="flex flex-row gap-4 justify-center">
            <button
              :class="
                period === PERIODS.day.displayName
                  ? 'button-small-active'
                  : 'button-small'
              "
              :value="PERIODS.day.displayName"
              @click="onPeriodButtonClick"
            >
              {{ PERIODS.day.displayName }}
            </button>
            <button
              :class="
                period === PERIODS.week.displayName
                  ? 'button-small-active'
                  : 'button-small'
              "
              :value="PERIODS.week.displayName"
              @click="onPeriodButtonClick"
            >
              {{ PERIODS.week.displayName }}
            </button>
            <button
              :class="
                period === PERIODS.month.displayName
                  ? 'button-small-active'
                  : 'button-small'
              "
              :value="PERIODS.month.displayName"
              @click="onPeriodButtonClick"
            >
              {{ PERIODS.month.displayName }}
            </button>
          </div>
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
    />

    <TransactionList
      v-if="transactionsStore.transactions"
      :transactions="transactionsStore.transactions"
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
import { addMonths, isAfter, setDate, subDays } from 'date-fns'
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
const transaction = ref({})

const transactionsForPeriodOptions = computed(() => {
  if (transactionsStore.list === null) {
    return {}
  }
  return transactionsForPeriod({
    transactions: transactionsStore.transactions as Array<ITransaction>,
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

const onPeriodButtonClick = (event: Event) => {
  event.preventDefault()
  const eventValue = event.target.value
  period.value = eventValue
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/transactions.scss';
</style>
