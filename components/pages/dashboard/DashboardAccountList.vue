<template>
  <div class="w-full h-full">
    <div class="card flex flex-col gap-3 w-full !h-full">
      <DashboardCardHeader :title="COPY.accounts" :url="ACCOUNTS_ROUTE.path" />

      <template v-if="dashboardAccounts.length === 0">
        <DashboardAccountCardSkeleton />
        <DashboardAccountCardSkeleton />
        <DashboardAccountCardSkeleton />
      </template>

      <div class="h-full grid grid-rows-3 gap-4">
        <TransitionGroup name="list">
          <DashboardAccountCard
            v-for="account in dashboardAccounts"
            :key="account.id"
            :account="account"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/components/pages/dashboard/DashboardCardHeader.vue'
import COPY from '~~/constants/copy/account'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import DashboardAccountCard from '~~/components/pages/dashboard/DashboardAccountCard.vue'
import DashboardAccountCardSkeleton from '~~/components/pages/dashboard/DashboardAccountCardSkeleton.vue'
import { useAccounts } from '~~/stores/accounts'

const dashboardAccounts = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.slice(0, 3)
})

const accountStore = useAccounts()
</script>
