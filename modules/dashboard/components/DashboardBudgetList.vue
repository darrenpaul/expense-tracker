<template>
  <div class="dashboard-progress-list">
    <DashboardCardHeader :title="COPY.budgets" :url="BUDGETS_ROUTE.path" />

    <TransitionGroup name="list">
      <DashboardBudgetCard
        v-for="budget in dashboardBudgets"
        :key="budget.id"
        :budget="budget"
      />
    </TransitionGroup>

    <template v-if="budgetStore.budgets.length === 0">
      <DashboardBudgetGoalCardSkeleton />
      <DashboardBudgetGoalCardSkeleton />
      <DashboardBudgetGoalCardSkeleton />
    </template>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/modules/dashboard/components/DashboardCardHeader.vue'
import DashboardBudgetCard from '~~/modules/dashboard/components/DashboardBudgetCard.vue'
import DashboardBudgetGoalCardSkeleton from '~~/modules/dashboard/components/DashboardBudgetGoalCardSkeleton.vue'
import COPY from '~~/constants/copy/budget'
import { BUDGETS_ROUTE } from '~~/constants/routes/budgets'
import { useBudgets } from '~~/stores/budgets'

const budgetStore = useBudgets()

const dashboardBudgets = computed(() => {
  return budgetStore.budgets.slice(0, 3)
})
</script>
