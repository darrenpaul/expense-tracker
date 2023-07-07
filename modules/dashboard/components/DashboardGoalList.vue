<template>
  <div class="dashboard-progress-list">
    <DashboardCardHeader :title="COPY.goals" :url="GOALS_ROUTE.path" />

    <TransitionGroup name="list">
      <DashboardGoalCard
        v-for="goal in dashboardGoals"
        :key="goal.id"
        :goal="goal"
      />
    </TransitionGroup>

    <template v-if="goalStore.goals.length === 0">
      <DashboardBudgetGoalCardSkeleton />
      <DashboardBudgetGoalCardSkeleton />
      <DashboardBudgetGoalCardSkeleton />
    </template>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/modules/dashboard/components/DashboardCardHeader.vue'
import DashboardGoalCard from '~~/modules/dashboard/components/DashboardGoalCard.vue'
import DashboardBudgetGoalCardSkeleton from '~~/modules/dashboard/components/DashboardBudgetGoalCardSkeleton.vue'
import COPY from '~~/constants/copy/goals'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { useGoals } from '~~/stores/goals'

const goalStore = useGoals()

const dashboardGoals = computed(() => {
  return goalStore.goals.slice(0, 3)
})
</script>
