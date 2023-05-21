<template>
  <div class="dashboard-page">
    <DashboardDesktopLayout
      :title="welcomeText"
      :category-usage-options="categoryUsageOptions"
      :spending-trend-options="spendingTrendOptions"
    />

    <DashboardMobileLayout
      :title="welcomeText"
      :category-usage-options="categoryUsageOptions"
      :spending-trend-options="spendingTrendOptions"
    />
  </div>
</template>

<script setup lang="ts">
import DashboardDesktopLayout from '~~/components/pages/dashboard/pageLayout/DashboardDesktopLayout.vue'
import DashboardMobileLayout from '~~/components/pages/dashboard/pageLayout/DashboardMobileLayout.vue'
import { ITransaction } from '~~/types/transaction'
import COPY from '~~/constants/copy/dashboard'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { useCategories } from '~~/stores/categories'
import categoriesUsageTopThree from '~~/helpers/charts/categories/categoriesUsageTopThree'
import spendingTrend from '~~/helpers/charts/transactions/spendingTrend'
import { useProfile } from '~~/stores/profile'

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
@import '~~/assets/css/pages/dashboard.scss';
</style>
