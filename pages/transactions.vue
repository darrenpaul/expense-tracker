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
          v-if="transactionsStore.list"
          :title="TRANSACTION_COPY.balance"
          :amount="
            currencyFormat({
              value: balance(),
              currency: 'R',
            })
          "
        />

        <GlanceCard
          v-if="transactionsStore.list"
          :title="TRANSACTION_COPY.spendPerDay"
          :amount="
            currencyFormat({
              value: spendPerDay({
                balance: balance(),
                date: new Date(),
              }),
              currency: 'R',
            })
          "
        />

        <GlanceCard
          v-if="transactionsStore.list"
          :title="TRANSACTION_COPY.spendPerWeek"
          :amount="
            currencyFormat({
              value: spendPerWeek({
                balance: balance(),
                date: new Date(),
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
      v-if="transactionsStore.list"
      :transactions="transactionsStore.list"
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
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import TransactionForm from '~~/components/forms/TransactionForm.vue'
import TransactionList from '~~/components/tables/TransactionList.vue'
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
    transactions: transactionsStore.list as Array<ITransaction>,
    date: new Date(),
    period: period.value,
    currency: userSettingsStore.currency,
  })
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

const onTransactionCreatedUpdated = () => {
  refreshData()
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
