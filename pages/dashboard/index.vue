<template>
  <div class="dashboard-container">
    <div class="col-span-3 flex flex-col gap-4">
      <div class="dashboardHeaderCard">
        <h3>{{ COPY.dashboard }}</h3>
        <small>{{ welcomeText }}</small>
      </div>

      <DashboardGoalList />
    </div>

    <div class="col-span-3 flex flex-col gap-4">
      <DashboardBalanceCard />
      <DashboardBudgetList />
    </div>

    <div class="col-span-3">
      <div class="card !p-0">
        <Chart :options="categoryUsageOptions" height="323px" />
      </div>
    </div>

    <div class="col-span-3 max-h-[323px]">
      <DashboardAccountList />
    </div>

    <div class="col-span-6">
      <div class="card !p-0">
        <Chart :options="spendingTrendOptions" height="323px" />
      </div>
    </div>
    <!--







  -->
    <!--

   -->

    <!-- <div class="row">
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
import DashboardBudgetList from '~~/components/pages/dashboard/DashboardBudgetList.vue'
import DashboardGoalList from '~~/components/pages/dashboard/DashboardGoalList.vue'
import DashboardAccountList from '~~/components/pages/dashboard/DashboardAccountList.vue'
import Chart from '~~/components/Chart.vue'
import { ITransaction } from '~~/types/transaction'
import expensesVsIncomes from '~~/helpers/charts/transactions/expensesVsIncomes'
import COPY from '~~/constants/copy/dashboard'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useCategories } from '~~/stores/categories'
import categoriesUsageTopThree from '~~/helpers/charts/categories/categoriesUsageTopThree'
import spendingTrend from '~~/helpers/charts/transactions/spendingTrend'
import DashboardBalanceCard from '~~/components/pages/dashboard/DashboardBalanceCard.vue'
import { useProfile } from '~~/stores/profile'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'dashboard',
})

const transactionStore = useTransactions()
const categoryStore = useCategories()
const userSettingStore = useUserSettings()
const profileStore = useProfile()

const showTransactionModal = ref(false)
const transaction = ref({})

const welcomeText = computed(() => {
  return `${COPY.welcomeBack} ${profileStore.user.firstName}`
})

const categoryUsageOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return categoriesUsageTopThree(
    transactionStore.expenseTransactionsForMonth() as Array<ITransaction>
  )
})

const spendingTrendOptions = computed(() => {
  if (transactionStore.list === null || categoryStore.categories === null) {
    return {}
  }
  return spendingTrend(
    transactionStore.expensesForLast7Days() as Array<ITransaction>,
    userSettingStore.currency
  )
})

const expensesVsIncomesOptions = computed(() => {
  if (transactionStore.list === null) {
    return {}
  }
  const currency = userSettingStore.currency
  return expensesVsIncomes(
    transactionStore.list as Array<ITransaction>,
    currency
  )
})

const onCloseTransactionModal = (refresh = false) => {
  showTransactionModal.value = false
  transaction.value = {}
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
