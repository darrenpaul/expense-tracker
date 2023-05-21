<template>
  <div class="dashboard-desktop-layout">
    <div class="col-span-9 flex flex-col gap-4">
      <div class="grid grid-cols-6 w-full gap-4">
        <div class="dashboard-header-card col-span-2">
          <h3>{{ COPY.dashboard }}</h3>
          <small>{{ props.title }}</small>
        </div>

        <div class="col-span-2">
          <DashboardBalanceCard />
        </div>

        <div class="col-span-2">
          <DashboardDailySpendBalanceCard />
        </div>
      </div>

      <div class="flex gap-4">
        <DashboardBudgetList />

        <DashboardGoalList />
      </div>
    </div>

    <div class="col-span-3">
      <DashboardAccountList />
    </div>

    <div class="col-span-3">
      <div class="card !p-0">
        <Chart :options="props.categoryUsageOptions" height="323px" />
      </div>
    </div>

    <div class="col-span-3">
      <DashboardTransactionList />
    </div>

    <div class="col-span-6">
      <div class="card !p-0">
        <Chart :options="props.spendingTrendOptions" height="323px" />
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
