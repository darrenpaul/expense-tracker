<template>
  <div class="dashboard-mobile-layout">
    <div class="dashboard-header-card">
      <h3>{{ COPY.dashboard }}</h3>
      <small>{{ props.title }}</small>
    </div>

    <DashboardBalanceCard />

    <DashboardDailySpendBalanceCard />

    <DashboardTransactionList />

    <DashboardBudgetList />

    <DashboardGoalList />

    <DashboardAccountList />

    <div class="card !p-0">
      <Chart :options="props.categoryUsageOptions" height="323px" />
    </div>

    <div class="card !p-0">
      <Chart :options="props.spendingTrendOptions" height="323px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardBudgetList from '~~/modules/dashboard/components/DashboardBudgetList.vue'
import DashboardGoalList from '~~/modules/dashboard/components/DashboardGoalList.vue'
import DashboardAccountList from '~~/modules/dashboard/components/DashboardAccountList.vue'
import DashboardTransactionList from '~~/modules/dashboard/components/DashboardTransactionList.vue'
import DashboardDailySpendBalanceCard from '~~/modules/dashboard/components/DashboardDailySpendBalanceCard.vue'
import DashboardBalanceCard from '~~/modules/dashboard/components/DashboardBalanceCard.vue'
import Chart from '~~/components/Chart.vue'
import COPY from '~~/constants/copy/dashboard'

const props = defineProps({
  title: { type: String, default: '' },
  categoryUsageOptions: { type: Object, default: () => {} },
  spendingTrendOptions: { type: Object, default: () => {} },
})
</script>
