<template>
  <div class="dashboard-desktop-layout">
    <div class="--main-wrapper">
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

      <div class="--row-group h-full">
        <div class="card !p-0 !w-full !h-auto">
          <Chart :options="props.spendingTrendOptions" height="100%" />
        </div>

        <div class="card !p-0 !w-full !h-auto">
          <Chart :options="props.categoryUsageOptions" height="100%" />
        </div>
      </div>
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
