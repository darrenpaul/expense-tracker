<template>
  <div class="dashboard-container">
    <div class="row">
      <div class="dashboard-card-container">
        <div class="card-stretch">
          <Chart :options="categoryUsageOptions" />
        </div>
      </div>
      <div class="dashboard-card-container">
        <div class="card-stretch">
          <Chart :options="expensesVsIncomesOptions" />
        </div>
      </div>
    </div>

    <div class="row">
      <ExpenseIncomeBalanceCard />

      <TransactionList
        v-if="transactionStore.transactions"
        :transactions="transactionStore.transactionsForToday"
        :rows="[
          TRANSACTION_COPY.date,
          TRANSACTION_COPY.name,
          TRANSACTION_COPY.amount,
        ]"
        @on-edit="onEditTransaction"
      />
    </div>

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
import TransactionForm from '~~/components/forms/TransactionForm.vue'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import GlanceCard from '~~/components/cards/GlanceCard.vue'
import { balance } from '~~/helpers/transactions'
import TransactionList from '~~/components/tables/transactionList/index.vue'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useCategories } from '~~/stores/categories'
import categoryUsage from '~~/helpers/charts/categories/categoriesUsage'
import ExpenseIncomeBalanceCard from '~~/components/cards/ExpenseIncomeBalanceCard.vue'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const transactionStore = useTransactions()
const categoryStore = useCategories()

const showTransactionModal = ref(false)
const transaction = ref({})

const categoryUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoryUsage(
    transactionStore.transactions as Array<ITransaction>,
    TRANSACTION_COPY.categoryUsage
  )
})

const expensesVsIncomesOptions = computed(() => {
  if (transactionStore.list === null) {
    return {}
  }
  return expensesVsIncomes(transactionStore.list as Array<ITransaction>)
})

const onCloseTransactionModal = (refresh = false) => {
  showTransactionModal.value = false
  transaction.value = {}

  if (refresh) {
    refreshData()
  }
}

const onEditTransaction = (transactionId: string) => {
  const matchedTransaction = transactionStore.list?.find(
    ({ id }) => id === transactionId
  )
  if (matchedTransaction) {
    transaction.value = matchedTransaction
    showTransactionModal.value = true
  }
}
</script>

<style lang="scss">
@import '~~/assets/css/pages/dashboard.scss';
</style>
