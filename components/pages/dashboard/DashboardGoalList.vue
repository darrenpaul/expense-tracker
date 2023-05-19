<template>
  <div class="dashboardProgressList">
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
import DashboardCardHeader from '~~/components/pages/dashboard/DashboardCardHeader.vue'
import DashboardGoalCard from '~~/components/pages/dashboard/DashboardGoalCard.vue'
import DashboardBudgetGoalCardSkeleton from '~~/components/pages/dashboard/DashboardBudgetGoalCardSkeleton.vue'
import COPY from '~~/constants/copy/goals'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { useGoals } from '~~/stores/goals'

const goalStore = useGoals()

const dashboardGoals = computed(() => {
  return goalStore.goals.slice(0, 3)
})
</script>
