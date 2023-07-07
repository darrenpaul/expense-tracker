<template>
  <div class="dashboard-card-list">
    <DashboardCardHeader :title="COPY.accounts" :url="ACCOUNTS_ROUTE.path" />

    <template v-if="dashboardAccounts.length === 0">
      <DashboardAccountCardSkeleton />
      <DashboardAccountCardSkeleton />
      <DashboardAccountCardSkeleton />
    </template>

    <div class="--list-wrapper">
      <TransitionGroup name="list">
        <DashboardAccountCard
          v-for="account in dashboardAccounts"
          :key="account.id"
          :account="account"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/modules/dashboard/components/DashboardCardHeader.vue'
import DashboardAccountCardSkeleton from '~~/modules/dashboard/components/DashboardAccountCardSkeleton.vue'
import DashboardAccountCard from '~~/modules/dashboard/components/DashboardAccountCard.vue'
import COPY from '~~/constants/copy/account'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import { useAccounts } from '~~/stores/accounts'

const dashboardAccounts = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.slice(0, 3)
})

const accountStore = useAccounts()
</script>
