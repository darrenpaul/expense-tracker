<template>
  <div class="dashboard-desktop-layout">
    <div class="w-full h-full flex flex-col gap-4 py-4">
      <div class="--row-group">
        <div class="dashboard-header-card">
          <h3>{{ COPY.dashboard }}</h3>
          <small>{{ props.title }}</small>
        </div>

        <DashboardBalanceCard />
        <DashboardDailySpendBalanceCard />
      </div>

      <div class="--row-group">
        <DashboardTransactionList />
        <DashboardAccountList />

        <DashboardBudgetList />
        <DashboardGoalList />
      </div>

      <div class="flex w-full h-full gap-4">
        <div class="card !p-0 !w-full !h-auto">
          <Chart :options="props.spendingTrendOptions" height="100%" />
        </div>

        <div class="card !w-full !h-auto !p-0">
          <Chart :options="props.categoryUsageOptions" height="100%" />
        </div>
      </div>
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
