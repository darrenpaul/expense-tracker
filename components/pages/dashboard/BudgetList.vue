<template>
  <!-- BUDGETS -->
  <div class="w-full">
    <div class="card flex flex-col gap-4 w-full">
      <DashboardCardHeader :title="COPY.budgets" :url="BUDGETS_ROUTE.path" />

      <BudgetCard
        v-for="budget in dashboardBudgets"
        :key="budget.id"
        :budget="budget"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/components/pages/dashboard/DashboardCardHeader.vue'
import COPY from '~~/constants/copy/budget'
import { BUDGETS_ROUTE } from '~~/constants/routes/budgets'
import BudgetCard from '~~/components/pages/dashboard/BudgetCard.vue'
import { useBudgets } from '~~/stores/budgets'

const budgetStore = useBudgets()

const dashboardBudgets = computed(() => {
  return budgetStore.budgets.slice(0, 3)
})
</script>
