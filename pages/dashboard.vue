<template>
  <div class="dashboard-page">
    <DashboardLayoutDesktop
      :title="welcomeText"
      :category-usage-options="categoryUsageOptions"
      :spending-trend-options="spendingTrendOptions"
    />

    <DashboardLayoutMobile
      :title="welcomeText"
      :category-usage-options="categoryUsageOptions"
      :spending-trend-options="spendingTrendOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ITransaction } from '~~/types/transaction'
import COPY from '~~/constants/copy/dashboard'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useCategories } from '~~/stores/categories'
import { useProfile } from '~~/stores/profile'
import spendingTrend from '~~/helpers/charts/transactions/spendingTrend'
import DashboardLayoutDesktop from '~~/modules/dashboard/components/DashboardLayoutDesktop.vue'
import DashboardLayoutMobile from '~~/modules/dashboard/components/DashboardLayoutMobile.vue'
import categoriesUsageTopThree from '~~/helpers/charts/categories/categoriesUsageTopThree'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'dashboard',
})

const transactionStore = useTransactions()
const categoryStore = useCategories()
const userSettingStore = useUserSettings()
const profileStore = useProfile()

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
</script>

<style lang="scss">
@import '~~/modules/dashboard/styles/dashboard.scss';
</style>
