<template>
  <div class="dashboard-mobile-layout">
    <div class="dashboard-header-card">
      <h3>{{ COPY.dashboard }}</h3>
      <small>{{ props.title }}</small>
    </div>

    <DashboardBalanceCard />

    <DashboardDailySpendBalanceCard />

    <DashboardBudgetList />

    <DashboardGoalList />

    <DashboardAccountList />

    <div class="card !p-0">
      <Chart :options="props.categoryUsageOptions" height="323px" />
    </div>

    <DashboardTransactionList />

    <div class="card !p-0">
      <Chart :options="props.spendingTrendOptions" height="323px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardBudgetList from '~~/components/pages/dashboard/DashboardBudgetList.vue'
import DashboardGoalList from '~~/components/pages/dashboard/DashboardGoalList.vue'
import DashboardAccountList from '~~/components/pages/dashboard/DashboardAccountList.vue'
import DashboardTransactionList from '~~/components/pages/dashboard/DashboardTransactionList.vue'
import DashboardDailySpendBalanceCard from '~~/components/pages/dashboard/DashboardDailySpendBalanceCard.vue'
import Chart from '~~/components/Chart.vue'
import COPY from '~~/constants/copy/dashboard'
import DashboardBalanceCard from '~~/components/pages/dashboard/DashboardBalanceCard.vue'

const props = defineProps({
  title: { type: String, default: '' },
  categoryUsageOptions: { type: Object, default: () => {} },
  spendingTrendOptions: { type: Object, default: () => {} },
})
</script>
